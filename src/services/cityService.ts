import { USE_MOCKS } from '@/config/constants';
import { City } from '@/types';

const mockCities: City[] = [
  { id: 'city-1', name: 'Одесса', country: 'Украина' },
  { id: 'city-2', name: 'Батуми', country: 'Грузия' },
  { id: 'city-3', name: 'Киев', country: 'Украина' },
];

export const cityService = {
  getAll: async () => {
    if (USE_MOCKS) return Promise.resolve(mockCities);
    return [];
  },
};
