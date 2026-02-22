import { User } from '@/types';
import { ProfileFormValues } from '@/types/profile';

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

export const mapUserPatchToApiUpdateRequest = (id: string, payload: Partial<User>) => ({
  id: Number(id),
  username: payload.email ?? payload.name,
  email: payload.email,
  phoneNumber: payload.phone,
  countryId: 1,
  discount: 0,
  roleName: payload.role === 'owner' ? 'Owner' : payload.role === 'admin' ? 'Admin' : 'Client',
});

