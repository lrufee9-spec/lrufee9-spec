
export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
  FRIEND = 'friend'
}

export interface Attachment {
  mimeType: string;
  base64: string;
  name?: string;
  isPDF?: boolean;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  groundingUrls?: { title: string; uri: string }[];
  attachments?: Attachment[];
  reactions?: string[];
  isStoryline?: boolean;
}

export interface Email {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: Date;
  attachments?: Attachment[];
  isRead: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  isBlocked: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  type: 'pdf' | 'physical';
  price: number;
  cover: string;
  isPurchased: boolean;
  description: string;
}

export interface NewsPost {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  relays: number;
  pulses: number;
}

export interface FileAsset {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'license' | 'audio';
  category: 'document' | 'photo' | 'video' | 'music';
  url: string;
  timestamp: Date;
  size: string;
  isPrivate: boolean;
}

export interface Track extends FileAsset {
  bpm: number;
  key: string;
  cues: number[];
  beatgridSet: boolean;
  phraseSet: boolean;
  format: 'mp3' | 'wav' | 'avi' | 'mp4';
}

export type AppID = 'home' | 'chat' | 'terminal' | 'maps' | 'files' | 'security' | 'network' | 'profile' | 'content' | 'inbox' | 'video' | 'books' | 'controller' | 'camera' | 'extensions' | 'storage' | 'djmusic';

export interface UserProfile {
  name: string;
  robotName: string;
  isLoggedIn: boolean;
  bioRegistered: boolean;
  credits?: number;
  installedApps?: string[];
}

export interface RobotFriend {
  id: string;
  name: string;
  owner: string;
  status: 'online' | 'offline';
  lastSeen: Date;
}

/**
 * Interface for social media posts used in ContentApp
 */
export interface Post {
  id: string;
  userId: string;
  userName: string;
  type: 'image' | 'video';
  mediaUrl: string;
  caption: string;
  likes: number;
  timestamp: Date;
}

/**
 * Interface for games used in ContentApp
 */
export interface Game {
  id: string;
  title: string;
  genre: string;
  platformSync: string[];
}

/**
 * Interface for video items used in VideoApp
 */
export interface VideoContent {
  id: string;
  title: string;
  creator: string;
  type: 'movie' | 'music' | 'talented';
  thumbnail: string;
  videoUrl: string;
  price: number;
  likes: number;
  isPurchased: boolean;
  description: string;
  isDownloaded?: boolean;
}
