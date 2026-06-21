import { ImageEntity } from '@/domain/entities/models/model-entity';

export interface MediaRepository {
  uploadMedia(file: File, token?: string): Promise<ImageEntity[]>;
  deleteMedia(id: string, token?: string): Promise<void>;
}