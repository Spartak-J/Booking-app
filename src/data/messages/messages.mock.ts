import { MessageItem } from '@/services/messages/message.types';

export const MESSAGES: MessageItem[] = [
  {
    id: 'm1',
    userId: 'user-1',
    title: 'Бронювання підтверджено',
    body: 'Ваше бронювання прийнято власником.',
    status: 'unread',
    tone: 'success',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm2',
    userId: 'user-1',
    title: 'Нове повідомлення',
    body: 'Власник надіслав уточнення.',
    status: 'read',
    tone: 'info',
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
  },
];
