import { MessageItem, MessagesService } from './message.types';
import { MESSAGES } from '@/data/messages/messages.mock';

// Simple in-memory mock. Resets on reload.
let store: MessageItem[] = [...MESSAGES];

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

export const messageServiceMock: MessagesService = {
  async getMessages() {
    await delay();
    return [...store].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },
  async addMessage(message) {
    await delay();
    const item: MessageItem = {
      id: `m-${Date.now()}`,
      userId: message.userId,
      title: message.title,
      body: message.body,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    store = [item, ...store];
    return item;
  },
  async markRead(id: string) {
    await delay();
    store = store.map((m) => (m.id === id ? { ...m, status: 'read' } : m));
  },
  async unreadCount() {
    await delay(50);
    return store.filter((m) => m.status === 'unread').length;
  },
};
