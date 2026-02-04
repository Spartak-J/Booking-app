import { User } from '../types';

export const USERS: User[] = [
  {
    id: 'user-1',
    email: 'demo@oselya.app',
    name: 'Demo User',
    role: 'user',
    phone: '+380501111111',
  },
  {
    id: 'user-2',
    email: 'demo2@oselya.app',
    name: 'Олександра Іваненко',
    role: 'user',
    phone: '+380661112222',
  },
  {
    id: 'owner-1',
    email: 'owner@oselya.app',
    name: 'Owner One',
    role: 'owner',
    phone: '+380631112233',
  },
  {
    id: 'admin-1',
    email: 'admin@oselya.app',
    name: 'Super Admin',
    role: 'admin',
    phone: '+380931114444',
  },
];
