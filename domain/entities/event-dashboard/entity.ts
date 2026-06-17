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
}

export interface NewsEntity {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  order: number;
  publishedAt: string;
  thumbnail?: MediaEntity;
}

export interface ActivityEntity {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  costType: 'free' | 'paid';
  cost: number | null;
  startDate: string;
  endDate: string;
  image?: MediaEntity;
  category?: CategoryEntity;
}
