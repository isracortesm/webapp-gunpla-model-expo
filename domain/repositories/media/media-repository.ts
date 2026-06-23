import { ImageEntity } from '@/domain/entities/models/model-entity';

export interface MediaRepository {
  uploadMedia(file: File, token?: string): Promise<ImageEntity[]>;
  deleteMedia(id: number, token?: string): Promise<void>;
}