import { MessagesService } from './message.types';

// TODO: replace with real API client when backend is ready
export const messageServiceApi: MessagesService = {
  async getMessages() {
    throw new Error('not implemented');
  },
  async addMessage() {
    throw new Error('not implemented');
  },
  async markRead() {
    throw new Error('not implemented');
  },
  async unreadCount() {
    throw new Error('not implemented');
  },
};
