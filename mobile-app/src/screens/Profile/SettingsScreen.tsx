import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { AppLayout } from '@/layout/AppLayout';
import { Routes } from '@/navigation/routes';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SettingsScreenView from '@/components/Profile/SettingsScreenView';
import { systemStatusService, type AdminHealthResponse } from '@/services/admin';
import { currencyService } from '@/services/currencyService';
import { useTranslation } from '@/i18n';

export const SettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const isMountedRef = useRef(true);
  const [systemStatus, setSystemStatus] = useState<AdminHealthResponse | null>(null);
  const [systemStatusLoading, setSystemStatusLoading] = useState(false);
  const [currencyRefreshing, setCurrencyRefreshing] = useState(false);
  const [currencyRefreshInfo, setCurrencyRefreshInfo] = useState<string | undefined>();
  const [currencyUpdatedAtLabel, setCurrencyUpdatedAtLabel] = useState<string | undefined>();

  const loadStatus = useCallback(async () => {
    if (!isMountedRef.current) return;
    setSystemStatusLoading(true);
    try {
      const data = await systemStatusService.getStatus();
      if (isMountedRef.current) {
        setSystemStatus(data);
      }
    } catch {
      if (isMountedRef.current) {
        setSystemStatus(null);
      }
    } finally {
      if (isMountedRef.current) {
        setSystemStatusLoading(false);
      }
    }
  }, []);

  const handleRefreshCurrency = useCallback(async () => {
    if (!isMountedRef.current) return;
    setCurrencyRefreshing(true);
    try {
      const data = await currencyService.getRates(true);
      if (data.refreshSucceeded === false) {
        const backendError = data.refreshError?.trim();
        setCurrencyRefreshInfo(
          backendError
            ? `${t('admin.tools.refreshCurrencyFailed')} ${backendError}`
            : t('admin.tools.refreshCurrencyFailed'),
        );
        return;
      }

      const updatedLabel = data.updatedAtUtc
        ? new Date(data.updatedAtUtc).toLocaleString()
        : t('common.unknown');
      if (isMountedRef.current) {
        setCurrencyRefreshInfo(`${t('admin.tools.refreshCurrencyDone')} ${updatedLabel}`);
        setCurrencyUpdatedAtLabel(`${t('admin.tools.lastAutoUpdate')} ${updatedLabel}`);
      }
      await loadStatus();
    } catch {
      if (isMountedRef.current) {
        setCurrencyRefreshInfo(t('admin.tools.refreshCurrencyFailed'));
      }
    } finally {
      if (isMountedRef.current) {
        setCurrencyRefreshing(false);
      }
    }
  }, [loadStatus, t]);

  const loadCurrencyUpdatedAt = useCallback(async () => {
    try {
      const data = await currencyService.getRates(false);
      const updatedLabel = data.updatedAtUtc
        ? new Date(data.updatedAtUtc).toLocaleString()
        : t('common.unknown');
      if (isMountedRef.current) {
        setCurrencyUpdatedAtLabel(`${t('admin.tools.lastAutoUpdate')} ${updatedLabel}`);
      }
    } catch {
      if (isMountedRef.current) {
        setCurrencyUpdatedAtLabel(undefined);
      }
    }
  }, [t]);

  useEffect(() => {
    isMountedRef.current = true;

    const syncStatus = async () => {
      if (!isMountedRef.current) return;
      await loadStatus();
      await loadCurrencyUpdatedAt();
    };

    void syncStatus();
    const timer = setInterval(syncStatus, 30000);
    return () => {
      isMountedRef.current = false;
      clearInterval(timer);
    };
  }, [loadCurrencyUpdatedAt, loadStatus]);

  return (
    <AppLayout variant="stack">
      <SettingsScreenView
        onBack={() => navigation.goBack()}
        onOpenUsers={() => navigation.navigate(Routes.AdminUsers)}
        onOpenOffers={() => navigation.navigate(Routes.AdminOffers)}
        onOpenMessages={() => navigation.navigate(Routes.Main, { screen: Routes.Notifications })}
        systemStatus={systemStatus}
        systemStatusLoading={systemStatusLoading}
        onRefreshCurrency={handleRefreshCurrency}
        currencyRefreshing={currencyRefreshing}
        currencyRefreshInfo={currencyRefreshInfo}
        currencyUpdatedAtLabel={currencyUpdatedAtLabel}
      />
    </AppLayout>
  );
};

export default SettingsScreen;
