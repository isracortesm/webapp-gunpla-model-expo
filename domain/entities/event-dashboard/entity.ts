export interface MediaEntity {
  id: number;
  name: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

export interface CategoryEntity {
  id: number;
  name: string;
  description: string;
  type?: 'competition' | 'workshop' | 'seminar';
}

export interface EventEntity {
  id: number;
  eventId: string;
  name: string;
  shortDescription: string;
  description: string;
  costType: 'free' | 'paid';
  cost: number | null;
  startDate: string;
  endDate: string;
  image?: MediaEntity;
  category?: CategoryEntity;
  socialNetworks?: SocialNetworkItem[];
}

export interface NewsEntity {
  id: number;
  documentId: string;
  title: string;
  subtitle: string;
  content: string;
  order: number;
  publishedAt: string;
  thumbnail?: MediaEntity;
  user?: unknown;
}

export interface ActivityEntity {
  id: number;
  documentId: string;
  name: string;
  shortDescription: string;
  description?: string;
  costType: 'free' | 'paid';
  cost: number | null;
  startDate: string;
  endDate: string;
  capacity?: number;
  image?: MediaEntity;
  category?: CategoryEntity;
  collaborators?: CollaboratorEntity[];
}

export interface CollaboratorEntity {
  id: number;
  documentId?: string;
  role: string;
  description?: string;
  user?: unknown;
}

export interface SocialNetworkItem {
  id: number;
  documentId?: string;
  type: string;
  name: string;
  url: string;
}

export interface ActivityParticipantEntity {
  id: string;
  documentId: string;
  statusName: string;
  checkIn: boolean;
  user: string;
}