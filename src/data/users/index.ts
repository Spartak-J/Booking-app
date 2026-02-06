import { User } from '../types';
import { USERS } from './users.mock';

// Mock repository. Replace with API calls later without changing UI consumers.
export const UserRepository = {
  async getAll(): Promise<User[]> {
    return Promise.resolve(USERS);
  },

  async getById(id: string): Promise<User | undefined> {
    return Promise.resolve(USERS.find((user) => user.id === id));
  },
};
