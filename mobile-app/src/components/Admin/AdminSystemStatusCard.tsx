import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { radius, spacing, useTheme } from '@/theme';
import { Card, Typography } from '@/ui';
import type { SystemStatusItem, SystemStatusLevel } from '@/services/admin';
import { s } from '@/utils/scale';

type Props = {
  title: string;
  checkedAtLabel: string;
  checkedAtValue: string;
  items: SystemStatusItem[];
};

const statusToneMap: Record<SystemStatusLevel, 'success' | 'warning' | 'error' | 'muted'> = {
  ok: 'success',
  warning: 'warning',
  degraded: 'warning',
  down: 'error',
  unknown: 'muted',
};

const statusLabelMap: Record<SystemStatusLevel, string> = {
  ok: 'OK',
  warning: 'WARN',
  degraded: 'DEGRADED',
  down: 'DOWN',
  unknown: 'N/A',
};

export const AdminSystemStatusCard: React.FC<Props> = ({
  title,
  checkedAtLabel,
  checkedAtValue,
  items,
}) => {
  const { tokens } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(tokens), [tokens]);

  return (
    <Card variant="filled" style={styles.card}>
      <View style={styles.header}>
        <Typography variant="h4" tone="primary">
          {title}
        </Typography>
        <Typography variant="caption" tone="secondary">
          {checkedAtLabel}: {checkedAtValue}
        </Typography>
      </View>

      <View style={styles.list}>
        {items.map((item) => {
          const tone = statusToneMap[item.status];
          const label = statusLabelMap[item.status];
          return (
            <View key={item.id} style={styles.row}>
              <View style={styles.rowLeft}>
                <Typography variant="body" tone="primary">
                  {item.name}
                </Typography>
                {item.message ? (
                  <Typography variant="caption" tone="secondary">
                    {item.message}
                  </Typography>
                ) : null}
              </View>

              <View style={styles.rowRight}>
                {item.latencyMs !== undefined ? (
                  <Typography variant="caption" tone="secondary" style={styles.latency}>
                    {t('admin.systemStatus.latency', { ms: item.latencyMs })}
                  </Typography>
                ) : null}
                <View style={styles.statusPill}>
                  <View style={styles.dot(tone)} />
                  <Typography variant="caption" tone={tone}>
                    {label}
                  </Typography>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    card: {
      padding: spacing.lg,
      gap: spacing.md,
      borderRadius: radius.lg,
    },
    header: {
      gap: spacing.xs,
    },
    list: {
      gap: spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    rowLeft: {
      flex: 1,
      gap: spacing.xs,
    },
    rowRight: {
      alignItems: 'flex-end',
      gap: spacing.xs,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: tokens.bgSurfaceAlt,
      borderWidth: 1,
      borderColor: tokens.borderSubtle,
    },
    dot: (tone: 'success' | 'warning' | 'error' | 'muted') => ({
      width: s(8),
      height: s(8),
      borderRadius: s(8),
      backgroundColor:
        tone === 'success'
          ? tokens.success
          : tone === 'warning'
            ? tokens.warning
            : tone === 'error'
              ? tokens.error
              : tokens.borderSubtle,
    }),
    latency: {
      textAlign: 'right',
    },
  });

export default AdminSystemStatusCard;
