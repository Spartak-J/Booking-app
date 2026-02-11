import { USE_MOCKS } from '@/config/constants';
import { messageServiceMock } from './messageService.mock';
import { messageServiceApi } from './messageService.api';

export const messageService = USE_MOCKS ? messageServiceMock : messageServiceApi;

export default messageService;
