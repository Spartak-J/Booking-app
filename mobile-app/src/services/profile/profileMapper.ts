import { User } from '@/types';
import { ProfileFormValues } from '@/types/profile';

const normalizeBirthDateForApi = (birthDate?: string): string | undefined => {
  if (!birthDate) return undefined;
  const trimmed = birthDate.trim();
  if (!trimmed) return undefined;
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed;

  const dotMatch = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dotMatch) {
    const [, dd, mm, yyyy] = dotMatch;
    return `${yyyy}-${mm}-${dd}T00:00:00Z`;
  }

  const slashMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashMatch) {
    const [, dd, mm, yyyy] = slashMatch;
    return `${yyyy}-${mm}-${dd}T00:00:00Z`;
  }

  return trimmed;
};

export const mapUserToProfileForm = (user?: User | null): ProfileFormValues => ({
  name: user?.name ?? '',
  birthDate: user?.birthDate ?? '',
  email: user?.email ?? '',
  phone: user?.phone ?? '',
  country: user?.country ?? '',
  ownerDescription: user?.ownerDescription ?? '',
  avatarUrl: user?.avatarUrl ?? '',
});

export const mapProfileFormToUserPatch = (form: ProfileFormValues): Partial<User> => ({
  name: form.name,
  birthDate: form.birthDate,
  email: form.email,
  phone: form.phone,
  country: form.country,
  ownerDescription: form.ownerDescription,
  avatarUrl: form.avatarUrl,
});

export const mapUserPatchToApiUpdateRequest = (
  id: string,
  payload: Partial<User>,
  currentUser?: User | null,
) => {
  const countryFromText =
    typeof payload.country === 'string' && /^\d+$/.test(payload.country.trim())
      ? Number(payload.country.trim())
      : undefined;
  const resolvedCountryId = payload.countryId ?? countryFromText ?? currentUser?.countryId ?? 1;
  const resolvedDiscount = payload.discount ?? currentUser?.discount ?? 0;
  const resolvedRole = payload.role ?? currentUser?.role ?? 'user';

  return {
    id: Number(id),
    lastname: payload.name ?? currentUser?.name,
    email: payload.email ?? currentUser?.email,
    phoneNumber: payload.phone ?? currentUser?.phone,
    birthDate: normalizeBirthDateForApi(payload.birthDate ?? currentUser?.birthDate),
    countryId: resolvedCountryId,
    discount: resolvedDiscount,
    roleName: resolvedRole === 'owner' ? 'Owner' : resolvedRole === 'admin' ? 'Admin' : 'Client',
  };
};
