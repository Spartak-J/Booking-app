import React, { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import type { AdminHealthResponse, AdminServiceStatus } from '@/services/admin';
import { useTranslation } from '@/i18n';
import { spacing, useTheme } from '@/theme';
import { Button, Card, Loader, Typography } from '@/ui';
import { s } from '@/utils/scale';

type Props = {
  data?: AdminHealthResponse | null;
  loading?: boolean;
  onRefreshCurrency?: () => void;
  currencyRefreshing?: boolean;
  currencyRefreshInfo?: string;
  currencyUpdatedAtLabel?: string;
};

type SectionId = 'db' | 'bff' | 'rabbit' | 'payments' | 'logs';

type Section = {
  id: SectionId;
  title: string;
  services: AdminServiceStatus[];
};

const statusLabel = (status: AdminServiceStatus['status']) => {
  if (status === 'ok') return 'OK';
  if (status === 'degraded') return 'Degraded';
  if (status === 'down') return 'Down';
  return 'Unknown';
};

const resolveGroup = (services: AdminServiceStatus[], ids: string[]) => {
  const normalized = ids.map((item) => item.toLowerCase());
  return services.filter((service) => {
    const target = service.id.toLowerCase();
    return normalized.some((id) => target === id || target.includes(id));
  });
};

const resolveSectionServices = (services: AdminServiceStatus[], sectionId: SectionId) => {
  const byCategory = services.filter((service) => service.category === sectionId);
  if (byCategory.length > 0) {
    return byCategory;
  }

  if (sectionId === 'db') return resolveGroup(services, ['db', 'postgres']);
  if (sectionId === 'rabbit') return resolveGroup(services, ['rabbit', 'rabbitmq']);
  if (sectionId === 'payments') return resolveGroup(services, ['paypal', 'liqpay', 'payment']);
  if (sectionId === 'logs') return resolveGroup(services, ['log', 'logger']);

  return resolveGroup(services, [
    'gateway',
    'user',
    'offer',
    'location',
    'order',
    'review',
    'attraction',
    'translation',
    'statistic',
  ]);
};

export const AdminToolsStatusPanel: React.FC<Props> = ({
  data,
  loading,
  onRefreshCurrency,
  currencyRefreshing,
  currencyRefreshInfo,
  currencyUpdatedAtLabel,
}) => {
  const { tokens } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const [expandedIds, setExpandedIds] = useState<SectionId[]>(['db', 'bff']);

  const sections = useMemo<Section[]>(() => {
    const services = data?.services ?? [];

    return [
      {
        id: 'db',
        title: t('admin.tools.section.db'),
        services: resolveSectionServices(services, 'db'),
      },
      {
        id: 'bff',
        title: t('admin.tools.section.bff'),
        services: resolveSectionServices(services, 'bff'),
      },
      {
        id: 'rabbit',
        title: t('admin.tools.section.rabbit'),
        services: resolveSectionServices(services, 'rabbit'),
      },
      {
        id: 'payments',
        title: t('admin.tools.section.payments'),
        services: resolveSectionServices(services, 'payments'),
      },
      {
        id: 'logs',
        title: t('admin.tools.section.logs'),
        services: resolveSectionServices(services, 'logs'),
      },
    ];
  }, [data?.services, t]);

  const toggle = (id: SectionId) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Typography variant="h2">{t('admin.tools.title')}</Typography>
        <Button
          title={t('admin.tools.refreshCurrency')}
          variant="secondary"
          size="small"
          isLoading={Boolean(currencyRefreshing)}
          disabled={Boolean(currencyRefreshing)}
          onPress={() => {
            onRefreshCurrency?.();
          }}
        />
        {currencyUpdatedAtLabel ? (
          <View style={styles.updatedAtChip}>
            <MaterialCommunityIcons name="clock-outline" size={s(14)} color={tokens.textSecondary} />
            <Typography variant="caption" tone="secondary">
              {currencyUpdatedAtLabel}
            </Typography>
          </View>
        ) : null}
        {currencyRefreshInfo ? (
          <Typography variant="caption" tone="secondary">
            {currencyRefreshInfo}
          </Typography>
        ) : null}
      </View>

      <View style={styles.sections}>
        {sections.map((section) => {
          const expanded = expandedIds.includes(section.id);
          return (
            <Card
              key={section.id}
              variant="outlined"
              padding="md"
              style={styles.sectionCard}
              onPress={() => toggle(section.id)}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Typography variant="subtitle">{section.title}</Typography>
                  {loading ? <Loader /> : null}
                </View>
                <MaterialCommunityIcons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={s(18)}
                  color={tokens.textPrimary}
                />
              </View>

              {expanded ? (
                <View style={styles.sectionBody}>
                  {section.services.length > 0 ? (
                    section.services.map((service) => (
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
                    ))
                  ) : (
                    <Typography variant="caption" tone="secondary">
                      {t('admin.tools.section.empty')}
                    </Typography>
                  )}
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>
    </View>
  );
};

const getStyles = (tokens: Record<string, string>) =>
  StyleSheet.create({
    container: {
      gap: spacing.md,
    },
    headerBlock: {
      gap: spacing.sm,
    },
    sections: {
      gap: spacing.md,
    },
    updatedAtChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: tokens.bgCard,
      borderColor: tokens.border,
      borderWidth: 1,
      borderRadius: spacing.md,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    sectionCard: {
      backgroundColor: tokens.bgSurface,
      gap: spacing.sm,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    sectionHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    sectionBody: {
      gap: spacing.md,
      paddingTop: spacing.xs,
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

export default AdminToolsStatusPanel;
