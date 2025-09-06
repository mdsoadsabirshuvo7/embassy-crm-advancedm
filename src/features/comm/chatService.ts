import { v4 as uuid } from 'uuid';

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  createdAt: string;
  orgId?: string;
  attachments?: { id: string; name: string; url?: string; }[];
}

interface ChatState { messages: ChatMessage[]; }
const state: Record<string, ChatState> = {};
function ensure(orgId: string): ChatState { return state[orgId] ||= { messages: [] }; }

export const ChatService = {
  send(orgId: string, threadId: string, senderId: string, body: string): ChatMessage {
    const msg: ChatMessage = { id: uuid(), threadId, senderId, body, createdAt: new Date().toISOString(), orgId };
    ensure(orgId).messages.push(msg);
    return msg;
  },
  list(orgId: string, threadId: string): ChatMessage[] { return ensure(orgId).messages.filter(m => m.threadId === threadId); }
};
