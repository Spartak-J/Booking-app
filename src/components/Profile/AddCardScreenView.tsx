// Component: AddCardScreenView. Used in: AddCardScreen.
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button, Card, HeaderBar, Input, Typography } from '@/ui';
import { useTheme } from '@/theme';
import { spacing, radius, typography } from '@/theme';
import { useTranslation } from '@/i18n';
import KeysBackground from '@/components/layout/KeysBackground';
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
  const contentStyle = useMemo(() => [styles.content], [styles.content]);

  const [values, setValues] = useState<AddCardValues>({
    holderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    saveCard: true,
  });

  return (
    <View style={styles.root}>
      <HeaderBar title={t('profile.addCard.title')} onBack={onBack} />

      <ScrollView contentContainerStyle={contentStyle} showsVerticalScrollIndicator={false}>
        <Typography variant="subtitle" tone="primary" style={styles.subtitle}>
          {t('profile.addCard.subtitle')}
        </Typography>

        <Input
          label={t('profile.addCard.field.holderName')}
          placeholder={t('profile.addCard.placeholder.name')}
          value={values.holderName}
          onChangeText={(text) => setValues((prev) => ({ ...prev, holderName: text }))}
        />

        <View style={styles.paymentRow}>
          <Card style={styles.paymentCard}>
            <Typography variant="caption" tone="secondary">
              MasterCard
            </Typography>
          </Card>
          <Card style={styles.paymentCard}>
            <Typography variant="caption" tone="secondary">
              Visa
            </Typography>
          </Card>
          <Card style={styles.paymentCard}>
            <Typography variant="caption" tone="secondary">
              PayPal
            </Typography>
          </Card>
        </View>

        <Input
          label={t('profile.addCard.field.cardNumber')}
          placeholder={t('profile.addCard.placeholder.cardNumber')}
          value={values.cardNumber}
          onChangeText={(text) => setValues((prev) => ({ ...prev, cardNumber: text }))}
          keyboardType="number-pad"
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Input
              label={t('profile.addCard.field.cvv')}
              placeholder={t('profile.addCard.placeholder.cvv')}
              value={values.cvv}
              onChangeText={(text) => setValues((prev) => ({ ...prev, cvv: text }))}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.half}>
            <Input
              label={t('profile.addCard.field.expiry')}
              placeholder={t('profile.addCard.placeholder.expiry')}
              value={values.expiry}
              onChangeText={(text) => setValues((prev) => ({ ...prev, expiry: text }))}
              keyboardType="number-pad"
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
          onPress={() => onSave(values)}
          style={styles.saveButton}
        />
      </ScrollView>

      <KeysBackground variant="yellow" />
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: tokens.bgScreen,
    },
    content: {
      paddingHorizontal: spacing.lg,
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
    paymentRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    paymentCard: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm,
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
