import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import AdminUsersScreenView, { type AdminUserCardItem } from '@/components/Admin/AdminUsersScreenView';
import { useTranslation } from '@/i18n';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { Routes } from '@/navigation/routes';
import { usersAdminService } from '@/services/admin';
import type { User } from '@/types';

const PAGE_SIZE = 8;
type UsersSortOrder = 'asc' | 'desc';
type UsersFilterMode = 'all' | 'blocked' | 'active';

const normalizePhone = (value?: string) => (value ?? '').replace(/[^\d+]/g, '').toLowerCase();

const matchesUserQuery = (user: User, query: string) => {
  if (!query) return true;

  const normalizedQuery = query.trim().toLowerCase();
  const phoneQuery = query.trim().replace(/[^\d+]/g, '').toLowerCase();
  const nameParts = user.name.toLowerCase().split(/\s+/);

  return (
    user.name.toLowerCase().includes(normalizedQuery) ||
    nameParts.some((part) => part.includes(normalizedQuery)) ||
    user.email.toLowerCase().includes(normalizedQuery) ||
    normalizePhone(user.phone).includes(phoneQuery) ||
    (user.phone ?? '').toLowerCase().includes(normalizedQuery)
  );
};

const uniqueUsers = (users: User[]) => {
  const map = new Map<string, User>();
  users.forEach((user) => {
    const key = `${(user.email ?? '').toLowerCase()}|${normalizePhone(user.phone)}|${(user.name ?? '').toLowerCase()}`;
    if (!map.has(key)) {
      map.set(key, user);
    }
  });
  return Array.from(map.values());
};

const mapToCardItem = (user: User): AdminUserCardItem => ({
  id: user.id,
  name: user.name,
  phone: user.phone,
  email: user.email,
  city: user.city ?? '-',
  rating: typeof user.rating === 'number' ? user.rating.toFixed(1) : '-',
  isBlocked: Boolean(user.isBlocked),
});

const AdminUsersScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [sortOrder, setSortOrder] = useState<UsersSortOrder>('asc');
  const [filterMode, setFilterMode] = useState<UsersFilterMode>('all');
  const [searchOptionsVisible, setSearchOptionsVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      const items = await usersAdminService.getUsers();
      if (isMounted) {
        setUsers(uniqueUsers(items.filter((item) => item.role !== 'admin')));
      }
    };
    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let list = users.filter((item) => matchesUserQuery(item, normalizedQuery));
    if (filterMode === 'blocked') {
      list = list.filter((item) => Boolean(item.isBlocked));
    } else if (filterMode === 'active') {
      list = list.filter((item) => !item.isBlocked);
    }

    return [...list].sort((lhs, rhs) => {
      const left = lhs.name.toLowerCase();
      const right = rhs.name.toLowerCase();
      return sortOrder === 'asc' ? left.localeCompare(right, 'uk') : right.localeCompare(left, 'uk');
    });
  }, [filterMode, query, sortOrder, users]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)), [filtered.length]);
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(mapToCardItem),
    [currentPage, filtered],
  );

  const handleWrite = useCallback(
    (userId: string) => {
      void userId;
      navigation.navigate(Routes.Main, {
        screen: Routes.Notifications,
      });
    },
    [navigation],
  );

  const handleBlock = useCallback(async (userId: string) => {
    setUsers((prev) =>
      prev.map((item) => (item.id === userId ? { ...item, isBlocked: !item.isBlocked } : item)),
    );
    try {
      const updated = await usersAdminService.toggleUserBlocked(userId);
      if (!updated) return;
      setUsers((prev) =>
        prev.map((item) => (item.id === userId ? { ...item, isBlocked: Boolean(updated.isBlocked) } : item)),
      );
    } catch {
      // keep optimistic state for admin panel UX
    }
  }, []);

  return (
    <AppLayout variant="stack" header={false} edges={['top', 'left', 'right']}>
      <AdminUsersScreenView
        title={t('admin.users.title')}
        query={query}
        users={pageItems}
        page={currentPage}
        totalPages={totalPages}
        onQueryChange={setQuery}
        sortOrder={sortOrder}
        filterMode={filterMode}
        searchOptionsVisible={searchOptionsVisible}
        onBack={() => navigation.goBack()}
        onMenu={() => navigation.navigate(Routes.AdminMenu)}
        onToggleSearchOptions={() => setSearchOptionsVisible((prev) => !prev)}
        onSetSortOrder={(nextOrder) => {
          setSortOrder(nextOrder);
          setPage(1);
        }}
        onSetFilterMode={(nextFilter) => {
          setFilterMode(nextFilter);
          setPage(1);
        }}
        onSetPage={(nextPage) => setPage(Math.max(1, Math.min(totalPages, nextPage)))}
        onWrite={handleWrite}
        onBlock={handleBlock}
      />
    </AppLayout>
  );
};

export default AdminUsersScreen;
