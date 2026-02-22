import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Button, Card, ScreenShell } from '@/ui';
import { spacing } from '@/theme';
import { useTranslation } from '@/i18n';
import { ProfileFormValues } from '@/types/profile';
import { s } from '@/utils/scale';
import ProfileAccountBaseFields from './ProfileAccountBaseFields';

type AdminAccountScreenViewProps = {
  initialValues: ProfileFormValues;
  onBack: () => void;
  onSubmit: (values: ProfileFormValues) => void;
};

const AdminAccountScreenView: React.FC<AdminAccountScreenViewProps> = ({
  initialValues,
  onBack,
  onSubmit,
}) => {
  const styles = useMemo(() => getStyles(), []);
  const { t } = useTranslation();
  const [values, setValues] = useState<ProfileFormValues>(initialValues);

  return (
    <ScreenShell
      title={t('profile.account.title')}
      onBack={onBack}
      showKeys
      contentStyle={styles.shellContent}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="filled" style={styles.formCard}>
          <ProfileAccountBaseFields values={values} onChange={setValues} showBirthDate={false} />
        </Card>

        <Button
          title={t('profile.account.submit')}
          onPress={() => onSubmit(values)}
          style={styles.submit}
        />
      </ScrollView>
    </ScreenShell>
  );
};

const getStyles = () =>
  StyleSheet.create({
    shellContent: {
      paddingHorizontal: spacing.sm,
      paddingTop: spacing.sm,
      paddingBottom: 0,
    },
    content: {
      paddingHorizontal: 0,
      paddingTop: 0,
      paddingBottom: spacing.lg,
      gap: spacing.lg,
    },
    formCard: {
      padding: spacing.md,
      gap: spacing.md,
    },
    submit: {
      alignSelf: 'center',
      minWidth: s(180),
    },
  });

export default AdminAccountScreenView;
