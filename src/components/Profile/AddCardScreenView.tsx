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

const formatHolderName = (value: string) =>
  value
    .replace(/[^A-Za-z ]/g, '')
    .replace(/\s{2,}/g, ' ')
    .slice(0, 64);

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const formatCvv = (value: string) => value.replace(/\D/g, '').slice(0, 3);

export const AddCardScreenView: React.FC<AddCardScreenViewProps> = ({ onBack, onSave }) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const { t } = useTranslation();
  const contentStyle = useMemo(() => [styles.content], [styles.content]);

  const [values, setValues] = useState<AddCardValues>({
    holderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    saveCard: true,
  });

  const holderNameValid = useMemo(() => {
    const normalized = values.holderName.trim();
    return /^[A-Za-z]{2,}(?: [A-Za-z]{2,})+$/.test(normalized);
  }, [values.holderName]);

  const cardNumberValid = useMemo(
    () => values.cardNumber.replace(/\D/g, '').length === 16,
    [values.cardNumber],
  );

  const expiryValid = useMemo(() => {
    const match = values.expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!match) return false;
    const month = Number(match[1]);
    const year = Number(match[2]);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
  }, [values.expiry]);

  const cvvValid = useMemo(() => /^\d{3}$/.test(values.cvv), [values.cvv]);

  const canSave = holderNameValid && cardNumberValid && expiryValid && cvvValid;

  return (
    <ScreenShell
      title={t('profile.addCard.title')}
      onBack={onBack}
      showKeys
      contentStyle={styles.content}
    >
      <ScrollView contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
        <Typography variant="subtitle" tone="primary" style={styles.subtitle}>
          {t('profile.addCard.subtitle')}
        </Typography>

        <Input
          label={t('profile.addCard.field.holderName')}
          placeholder="John Smith"
          value={values.holderName}
          onChangeText={(text) =>
            setValues((prev) => ({ ...prev, holderName: formatHolderName(text) }))
          }
          autoCapitalize="words"
          helperText={
            values.holderName.length > 0 && !holderNameValid
              ? 'Use English first and last name.'
              : undefined
          }
        />

        <Input
          label={t('profile.addCard.field.cardNumber')}
          placeholder={t('profile.addCard.placeholder.cardNumber')}
          value={values.cardNumber}
          onChangeText={(text) =>
            setValues((prev) => ({ ...prev, cardNumber: formatCardNumber(text) }))
          }
          keyboardType="number-pad"
          maxLength={19}
          helperText={
            values.cardNumber.length > 0 && !cardNumberValid
              ? 'Card number must be 16 digits.'
              : undefined
          }
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Input
              label={t('profile.addCard.field.cvv')}
              placeholder={t('profile.addCard.placeholder.cvv')}
              value={values.cvv}
              onChangeText={(text) => setValues((prev) => ({ ...prev, cvv: formatCvv(text) }))}
              keyboardType="number-pad"
              maxLength={3}
              secureTextEntry
              helperText={values.cvv.length > 0 && !cvvValid ? 'CVV must be 3 digits.' : undefined}
            />
          </View>
          <View style={styles.half}>
            <Input
              label={t('profile.addCard.field.expiry')}
              placeholder="MM/YY"
              value={values.expiry}
              onChangeText={(text) =>
                setValues((prev) => ({ ...prev, expiry: formatExpiry(text) }))
              }
              keyboardType="number-pad"
              maxLength={5}
              helperText={
                values.expiry.length > 0 && !expiryValid
                  ? 'Use MM/YY and a valid future date.'
                  : undefined
              }
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
          onPress={() => {
            if (!canSave) return;
            onSave(values);
          }}
          disabled={!canSave}
          style={styles.saveButton}
        />
      </ScrollView>
    </ScreenShell>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.lg,
      gap: spacing.md,
    },
    subtitle: {
      ...(typography.subtitle as object),
      color: tokens.textPrimary,
      marginBottom: spacing.xs,
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
      paddingVertical: spacing.xs,
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
    },
  });

export default AddCardScreenView;
