export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface MicrosoftTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
}

export interface GoogleEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
}

export interface NotionTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  url: string;  // URL to the Notion page
  lastEdited: Date;
}

export interface NotionDatabase {
  id: string;
  title: string;
  url: string;
}