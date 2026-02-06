// Component: ReviewModal. Used in: (no direct imports found).
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';
import { useTranslation } from '@/i18n';
import { Button, Input, Modal, Typography } from '@/ui';

type Props = {
  visible: boolean;
  rating: string;
  comment: string;
  onChangeRating: (next: string) => void;
  onChangeComment: (next: string) => void;
  onSave: () => void;
  onClose: () => void;
  onDelete?: () => void;
};

export const ReviewModal: React.FC<Props> = ({
  visible,
  rating,
  comment,
  onChangeRating,
  onChangeComment,
  onSave,
  onClose,
  onDelete,
}) => {
  const styles = getStyles();
  const { t } = useTranslation();

  return (
    <Modal visible={visible} onClose={onClose} variant="sheet" contentStyle={styles.sheet}>
      <Typography variant="h2" tone="primary">
        {t('reviewModal.title')}
      </Typography>
      <Typography variant="caption" tone="secondary" style={styles.label}>
        {t('reviewModal.rating')}
      </Typography>
      <Input
        keyboardType="decimal-pad"
        value={rating}
        onChangeText={onChangeRating}
        placeholder="5"
      />
      <Typography variant="caption" tone="secondary" style={styles.label}>
        {t('reviewModal.comment')}
      </Typography>
      <Input
        value={comment}
        onChangeText={onChangeComment}
        placeholder={t('reviewModal.commentPlaceholder')}
        multiline
        numberOfLines={4}
        inputStyle={styles.textArea}
      />
      <View style={styles.actions}>
        {onDelete && (
          <Button title={t('reviewModal.delete')} variant="secondary" onPress={onDelete} />
        )}
        <Button title={t('reviewModal.cancel')} variant="ghost" onPress={onClose} />
        <Button title={t('reviewModal.save')} onPress={onSave} />
      </View>
    </Modal>
  );
};

const getStyles = () =>
  StyleSheet.create({
    sheet: {
      gap: spacing.sm,
    },
    label: {
      marginTop: spacing.sm,
    },
    textArea: {
      minHeight: 100,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.sm,
      flexWrap: 'wrap',
    },
  });
