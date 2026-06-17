export interface MediaDto {
  id: number;
  attributes: {
    name: string;
    url: string;
    thumbnailUrl?: string;
    width?: number;
    height?: number;
    formats?: {
      thumbnail?: {
        url: string;
        width?: number;
        height?: number;
      };
    };
  };
}

export interface CategoryDto {
  id: number;
  attributes: {
    name: string;
    description: string;
  };
}

export interface EventDto {
  id: number;
  attributes: {
    eventId: string;
    name: string;
    shortDescription: string;
    description: string;
    costType: 'free' | 'paid';
    cost: number | null;
    startDate: string;
    endDate: string;
    image?: MediaDto;
    category?: CategoryDto;
  };
}

export interface NewsDto {
  id: number;
  attributes: {
    title: string;
    subtitle: string;
    content: string;
    order: number;
    publishedAt: string;
    thumbnail?: MediaDto;
  };
}

export interface ActivityDto {
  id: number;
  attributes: {
    name: string;
    shortDescription: string;
    description: string;
    costType: 'free' | 'paid';
    cost: number | null;
    startDate: string;
    endDate: string;
    image?: MediaDto;
    category?: CategoryDto;
  };
}

export interface ApiResponse<T> {
  data: T[];
}
