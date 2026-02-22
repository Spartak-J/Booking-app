// Component: AddCardScreenView. Used in: AddCardScreen.
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button, Input, Typography, ScreenShell } from '@/ui';
import { useTheme } from '@/theme';
import { spacing, radius, typography } from '@/theme';
import { useTranslation } from '@/i18n';
import { s } from '@/utils/scale';

type AddCardValues = {
  holderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  saveCard: boolean;
};

type AddCardScreenViewProps = {
  onBack: () => void;
  onSave: (values: AddCardValues) => void;
};

export const AddCardScreenView: React.FC<AddCardScreenViewProps> = ({ onBack, onSave }) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const { t } = useTranslation();
  const contentStyle = useMemo(() => [styles.scrollContent], [styles.scrollContent]);

  const [values, setValues] = useState<AddCardValues>({
    holderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    saveCard: true,
  });

  const formatCardNumber = (input: string) => {
    const digits = input.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (input: string) => {
    const digits = input.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      return digits;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const formatCvv = (input: string) => input.replace(/\D/g, '').slice(0, 4);

  return (
    <ScreenShell
      title={t('profile.addCard.title')}
      onBack={onBack}
      showKeys
      contentStyle={styles.shellContent}
    >
      <ScrollView contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
        <View style={styles.formSurface}>
          <Typography variant="subtitle" tone="primary" style={styles.subtitle}>
            {t('profile.addCard.subtitle')}
          </Typography>

          <Input
            label={t('profile.addCard.field.holderName')}
            placeholder={t('profile.addCard.placeholder.name')}
            value={values.holderName}
            onChangeText={(text) => setValues((prev) => ({ ...prev, holderName: text }))}
            containerStyle={styles.field}
            inputStyle={styles.fieldInput}
          />

          <Input
            label={t('profile.addCard.field.cardNumber')}
            placeholder={t('profile.addCard.placeholder.cardNumber')}
            value={values.cardNumber}
            onChangeText={(text) =>
              setValues((prev) => ({ ...prev, cardNumber: formatCardNumber(text) }))
            }
            keyboardType="number-pad"
            containerStyle={styles.field}
            inputStyle={styles.fieldInput}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Input
                label={t('profile.addCard.field.cvv')}
                placeholder={t('profile.addCard.placeholder.cvv')}
                value={values.cvv}
                onChangeText={(text) => setValues((prev) => ({ ...prev, cvv: formatCvv(text) }))}
                keyboardType="number-pad"
                secureTextEntry
                inputStyle={styles.fieldInput}
              />
            </View>
            <View style={styles.half}>
              <Input
                label={t('profile.addCard.field.expiry')}
                placeholder={t('profile.addCard.placeholder.expiry')}
                value={values.expiry}
                onChangeText={(text) =>
                  setValues((prev) => ({ ...prev, expiry: formatExpiry(text) }))
                }
                keyboardType="number-pad"
                inputStyle={styles.fieldInput}
              />
            </View>
          </View>

          <Pressable
            style={styles.checkboxRow}
            onPress={() => setValues((prev) => ({ ...prev, saveCard: !prev.saveCard }))}
          >
            <View style={[styles.checkbox, values.saveCard && styles.checkboxActive]}>
              {values.saveCard ? (
                <MaterialCommunityIcons name="check" size={s(14)} color={tokens.textPrimary} />
              ) : null}
            </View>
            <Typography variant="caption" tone="secondary" style={styles.checkboxText}>
              {t('profile.addCard.saveInfo')}
            </Typography>
          </Pressable>

          <Button
            title={t('profile.addCard.save')}
            onPress={() =>
              onSave({
                ...values,
                cardNumber: values.cardNumber.replace(/\s/g, ''),
                cvv: values.cvv.replace(/\D/g, ''),
                expiry: values.expiry,
              })
            }
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </ScreenShell>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    shellContent: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: 0,
    },
    scrollContent: {
      paddingBottom: spacing.xl,
    },
    formSurface: {
      backgroundColor: tokens.bgSurface,
      borderRadius: radius.xl,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
      gap: spacing.md,
    },
    subtitle: {
      ...(typography.subtitle as object),
      color: tokens.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    field: {
      marginBottom: spacing.sm,
    },
    fieldInput: {
      backgroundColor: tokens.bgPanel,
      borderColor: tokens.borderSubtle,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    half: {
      flex: 1,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      marginTop: spacing.sm,
    },
    checkbox: {
      width: s(22),
      height: s(22),
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: tokens.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.bgField,
    },
    checkboxActive: {
      backgroundColor: tokens.bgPanel,
      borderColor: tokens.borderStrong,
    },
    checkboxText: {
      flex: 1,
    },
    saveButton: {
      alignSelf: 'center',
      minWidth: s(180),
      marginTop: spacing.sm,
      borderRadius: radius.xl,
    },
  });

export default AddCardScreenView;
