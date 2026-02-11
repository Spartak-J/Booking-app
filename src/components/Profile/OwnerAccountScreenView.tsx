import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Button, Card, Input, ScreenShell, Typography } from '@/ui';
import { radius, spacing, typography } from '@/theme';
import { useTheme } from '@/theme';
import { useTranslation } from '@/i18n';
import { s } from '@/utils/scale';
import { ProfileFormValues } from '@/types/profile';
import ProfileAccountBaseFields from './ProfileAccountBaseFields';

type OwnerAccountScreenViewProps = {
  initialValues: ProfileFormValues;
  onBack: () => void;
  onPickAvatar?: () => Promise<string | undefined>;
  onSubmit: (values: ProfileFormValues) => void;
};

const OwnerAccountScreenView: React.FC<OwnerAccountScreenViewProps> = ({
  initialValues,
  onBack,
  onPickAvatar,
  onSubmit,
}) => {
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const { t } = useTranslation();
  const [values, setValues] = useState<ProfileFormValues>(initialValues);

  return (
    <ScreenShell
      title={t('profile.account.title')}
      onBack={onBack}
      showKeys
      keysBottomOffset={s(20)}
      contentStyle={styles.shellContent}
      rightSlot={<MaterialCommunityIcons name="magnify" size={s(22)} color={tokens.textPrimary} />}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabPill}>
          <Typography variant="caption" style={styles.tabPillText}>
            {t('profile.account.tab.personal')}
          </Typography>
        </View>

        <Card variant="filled" style={styles.formCard}>
          <ProfileAccountBaseFields values={values} onChange={setValues} />

          <View style={styles.ownerBlocks}>
            <View style={styles.ownerBlock}>
              <Typography variant="caption" style={styles.ownerBlockLabel}>
                {t('profile.account.photo')}
              </Typography>
              <Card variant="outlined" padding="sm" style={styles.photoCard}>
                {values.avatarUrl ? <Image source={{ uri: values.avatarUrl }} style={styles.photoPreview} /> : null}
                <Button
                  title={t('profile.account.upload')}
                  variant="secondary"
                  size="small"
                  onPress={async () => {
                    if (!onPickAvatar) return;
                    const nextAvatar = await onPickAvatar();
                    if (nextAvatar) {
                      setValues((prev) => ({ ...prev, avatarUrl: nextAvatar }));
                    }
                  }}
                  style={styles.uploadButton}
                />
              </Card>
            </View>

            <View style={styles.ownerBlock}>
              <Typography variant="caption" style={styles.ownerBlockLabel}>
                {t('profile.account.ownerDescription')}
              </Typography>
              <Input
                placeholder={t('profile.account.ownerDescription')}
                value={values.ownerDescription}
                onChangeText={(text) => setValues((prev) => ({ ...prev, ownerDescription: text }))}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                containerStyle={styles.descriptionInput}
                inputStyle={styles.descriptionInputField}
              />
            </View>
          </View>
        </Card>

        <Button title={t('profile.account.submit')} onPress={() => onSubmit(values)} style={styles.submit} />
      </ScrollView>
    </ScreenShell>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    shellContent: {
      paddingHorizontal: spacing.sm,
      paddingTop: spacing.md,
      paddingBottom: 0,
    },
    content: {
      paddingHorizontal: spacing.sm,
      paddingTop: 0,
      paddingBottom: spacing.sm,
      gap: spacing.lg,
    },
    tabPill: {
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: tokens.accent,
      borderRadius: radius.round,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      marginBottom: spacing.sm,
    },
    tabPillText: {
      ...(typography.caption as object),
      color: tokens.accent,
    },
    formCard: {
      borderRadius: radius.lg,
      padding: spacing.md,
      gap: spacing.md,
    },
    ownerBlocks: {
      marginTop: spacing.sm,
      flexDirection: 'row',
      gap: spacing.sm,
      alignItems: 'stretch',
    },
    ownerBlock: {
      flex: 1,
      gap: spacing.xs,
    },
    ownerBlockLabel: {
      ...(typography.caption as object),
      color: tokens.textPrimary,
    },
    photoCard: {
      height: s(150),
      justifyContent: 'flex-end',
      borderRadius: radius.md,
      overflow: 'hidden',
      padding: spacing.xs,
    },
    photoPreview: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
      borderRadius: radius.md,
    },
    uploadButton: {
      alignSelf: 'center',
      marginBottom: spacing.xs,
    },
    descriptionInput: {
      height: s(150),
    },
    descriptionInputField: {
      height: s(150),
      textAlignVertical: 'top',
    },
    submit: {
      alignSelf: 'center',
      minWidth: s(180),
    },
  });

export default OwnerAccountScreenView;
