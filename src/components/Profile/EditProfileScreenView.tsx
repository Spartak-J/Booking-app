// Component: EditProfileScreenView. Used in: EditProfileScreen.
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button, HeaderBar, Input } from '@/ui';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';
import { useTranslation } from '@/i18n';
import KeysBackground from '@/components/layout/KeysBackground';
import FooterNavOverlay from '@/components/layout/FooterNavOverlay';
import { s } from '@/utils/scale';

type EditProfileValues = {
  name: string;
  birthDate: string;
  email: string;
  phone: string;
  country: string;
};

type EditProfileScreenViewProps = {
  initialValues: EditProfileValues;
  onBack: () => void;
  onSubmit: (values: EditProfileValues) => void;
};

export const EditProfileScreenView: React.FC<EditProfileScreenViewProps> = ({
  initialValues,
  onBack,
  onSubmit,
}) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const { t } = useTranslation();

  const [values, setValues] = useState<EditProfileValues>(initialValues);

  return (
    <View style={styles.root}>
      <HeaderBar title={t('profile.account.title')} onBack={onBack} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Input
            label={t('profile.account.field.name')}
            placeholder={t('profile.account.sample.name')}
            value={values.name}
            onChangeText={(text) => setValues((prev) => ({ ...prev, name: text }))}
          />
          <Input
            label={t('profile.account.field.birthDate')}
            placeholder={t('profile.account.sample.birthDate')}
            value={values.birthDate}
            onChangeText={(text) => setValues((prev) => ({ ...prev, birthDate: text }))}
          />
          <Input
            label={t('profile.account.field.email')}
            placeholder={t('profile.account.sample.email')}
            value={values.email}
            onChangeText={(text) => setValues((prev) => ({ ...prev, email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label={t('profile.account.field.phone')}
            placeholder={t('profile.account.sample.phone')}
            value={values.phone}
            onChangeText={(text) => setValues((prev) => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
          />
          <Input
            label={t('profile.account.field.country')}
            placeholder={t('profile.account.sample.country')}
            value={values.country}
            onChangeText={(text) => setValues((prev) => ({ ...prev, country: text }))}
          />
        </View>

        <Button
          title={t('profile.account.submit')}
          onPress={() => onSubmit(values)}
          style={styles.submit}
        />
      </ScrollView>

      <KeysBackground />
      <FooterNavOverlay activeId="profile" />
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: tokens.bgScreen,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: s(140),
      gap: spacing.lg,
    },
    form: {
      gap: spacing.md,
    },
    submit: {
      alignSelf: 'center',
      minWidth: s(180),
    },
  });

export default EditProfileScreenView;
