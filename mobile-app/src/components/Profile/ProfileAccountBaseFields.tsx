import React from 'react';

import { Input } from '@/ui';
import { useTranslation } from '@/i18n';
import { ProfileFormValues } from '@/types/profile';

type ProfileAccountBaseFieldsProps = {
  values: ProfileFormValues;
  onChange: (next: ProfileFormValues) => void;
  showBirthDate?: boolean;
};

const ProfileAccountBaseFields: React.FC<ProfileAccountBaseFieldsProps> = ({
  values,
  onChange,
  showBirthDate = true,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Input
        label={t('profile.account.field.name')}
        placeholder={t('profile.account.sample.name')}
        value={values.name}
        onChangeText={(text) => onChange({ ...values, name: text })}
      />
      {showBirthDate ? (
        <Input
          label={t('profile.account.field.birthDate')}
          placeholder={t('profile.account.sample.birthDate')}
          value={values.birthDate}
          onChangeText={(text) => onChange({ ...values, birthDate: text })}
        />
      ) : null}
      <Input
        label={t('profile.account.field.email')}
        placeholder={t('profile.account.sample.email')}
        value={values.email}
        onChangeText={(text) => onChange({ ...values, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label={t('profile.account.field.phone')}
        placeholder={t('profile.account.sample.phone')}
        value={values.phone}
        onChangeText={(text) => onChange({ ...values, phone: text })}
        keyboardType="phone-pad"
      />
      <Input
        label={t('profile.account.field.country')}
        placeholder={t('profile.account.sample.country')}
        value={values.country}
        onChangeText={(text) => onChange({ ...values, country: text })}
      />
    </>
  );
};

export default ProfileAccountBaseFields;
