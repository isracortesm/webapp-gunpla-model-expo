import { MediaRepository } from '@/domain/repositories/media/media-repository';
import { HttpService } from '@/data/services/http-client';
import { ImageEntity } from '@/domain/entities/models/model-entity';

export class MediaRepositoryImpl implements MediaRepository {
  private http: HttpService;

  constructor(http: HttpService) {
    this.http = http;
  }

  async uploadMedia(file: File, token?: string): Promise<ImageEntity[]> {
    const formData = new FormData();
    formData.append('files', file);

    // Since the current HttpService only supports JSON, we use fetch directly
    // for multipart/form-data to ensure correct boundary handling.
    const url = `${process.env.NEXT_PUBLIC_HOST_URI || ''}/api/upload`;
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload media: ${response.statusText}`);
    }

    const data = await response.json();
    return data as ImageEntity[];
  }

  async deleteMedia(id: string, token?: string): Promise<void> {
    const url = `${process.env.NEXT_PUBLIC_HOST_URI || ''}/api/upload/files/${id}`;
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete media: ${response.statusText}`);
    }
  }
}