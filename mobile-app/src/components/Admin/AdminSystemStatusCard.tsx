import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { AdminHealthResponse, AdminServiceStatus } from '@/services/admin';
import { useTranslation } from '@/i18n';
import { spacing, useTheme } from '@/theme';
import { Card, Loader, Typography } from '@/ui';

type Props = {
  data?: AdminHealthResponse | null;
  loading?: boolean;
};

const statusLabel = (status: AdminServiceStatus['status']) => {
  if (status === 'ok') return 'OK';
  if (status === 'degraded') return 'Degraded';
  if (status === 'down') return 'Down';
  return 'Unknown';
};

export const AdminSystemStatusCard: React.FC<Props> = ({ data, loading }) => {
  const { tokens } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  return (
    <Card variant="outlined" padding="lg" style={styles.card}>
      <View style={styles.header}>
        <Typography variant="h2">{t('admin.system.title')}</Typography>
        {loading ? <Loader /> : null}
      </View>
      <Typography variant="caption" tone="secondary" style={styles.subtitle}>
        {t('admin.system.subtitle')}
      </Typography>

      <View style={styles.list}>
        {(data?.services ?? []).map((service) => (
          <View key={service.id} style={styles.row}>
            <View
              style={[
                styles.dot,
                service.status === 'ok'
                  ? styles.dotSuccess
                  : service.status === 'degraded'
                    ? styles.dotWarning
                    : styles.dotError,
              ]}
            />
            <View style={styles.rowBody}>
              <Typography variant="body">{service.name}</Typography>
              <Typography variant="caption" tone="secondary">
                {statusLabel(service.status)}
                {service.latencyMs != null ? ` · ${service.latencyMs} ms` : ''}
              </Typography>
            </View>
          </View>
        ))}

        {!loading && (data?.services?.length ?? 0) === 0 ? (
          <Typography variant="caption" tone="secondary">
            {t('admin.system.empty')}
          </Typography>
        ) : null}
      </View>
    </Card>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    card: {
      backgroundColor: tokens.bgSurface,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    subtitle: {
      marginTop: spacing.xs,
    },
    list: {
      marginTop: spacing.md,
      gap: spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    rowBody: {
      flex: 1,
    },
    dot: {
      width: spacing.sm,
      height: spacing.sm,
      borderRadius: spacing.sm,
      backgroundColor: tokens.border,
    },
    dotSuccess: {
      backgroundColor: tokens.success,
    },
    dotWarning: {
      backgroundColor: tokens.warning,
    },
    dotError: {
      backgroundColor: tokens.error,
    },
  });

export default AdminSystemStatusCard;
