export type MessageStatus = 'unread' | 'read';

export interface MessageItem {
  id: string;
  userId?: string;
  title: string;
  body: string;
  status: MessageStatus;
  createdAt: string;
  tone?: 'success' | 'error' | 'info';
}

export interface MessagesService {
  getMessages(): Promise<MessageItem[]>;
  addMessage(message: Omit<MessageItem, 'id' | 'status' | 'createdAt'>): Promise<MessageItem>;
  markRead(id: string): Promise<void>;
  unreadCount(): Promise<number>;
}
