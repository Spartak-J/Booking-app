import { USE_MOCKS } from '@/config/constants';

import { paymentServiceMock } from './paymentService.mock';
import { paymentServiceApi } from './paymentService.api';

export const paymentService = USE_MOCKS ? paymentServiceMock : paymentServiceApi;

export * from './payment.types';
