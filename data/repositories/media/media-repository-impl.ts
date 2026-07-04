import { MediaRepository } from '@/domain/repositories/media/media-repository';
import { HttpService } from '@/data/services/http-client';
import { ImageEntity } from '@/domain/entities/models/model-entity';
import { logHttpRequest, logHttpResponse, logHttpError } from '@/shared/utils/http-debug';

export class MediaRepositoryImpl implements MediaRepository {
  private http: HttpService;

  constructor(http: HttpService) {
    this.http = http;
  }

  async uploadMedia(file: File, token?: string, fileInfo?: { ref?: string; refId?: number; field?: string }): Promise<ImageEntity[]> {
    const formData = new FormData();
    formData.append('files', file);
    if (fileInfo) {
      if (fileInfo.ref) formData.append('ref', fileInfo.ref);
      if (fileInfo.refId) formData.append('refId', String(fileInfo.refId));
      if (fileInfo.field) formData.append('field', fileInfo.field);
    }

    // Since the current HttpService only supports JSON, we use fetch directly
    // for multipart/form-data to ensure correct boundary handling.
    const url = `${process.env.NEXT_PUBLIC_HOST_URI || ''}/api/upload`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    logHttpRequest('POST', url, headers);
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      logHttpError(response.status, `Failed to upload media: ${response.statusText}`);
      throw new Error(`Failed to upload media: ${response.statusText}`);
    }

    const data = await response.json();
    logHttpResponse(response.status, Date.now() - startTime, Object.fromEntries(response.headers.entries()), data);
    return data as ImageEntity[];
  }

  async deleteMedia(id: number, token?: string): Promise<void> {
    const url = `${process.env.NEXT_PUBLIC_HOST_URI || ''}/api/upload/files/${id}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    logHttpRequest('DELETE', url, headers);
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    logHttpResponse(response.status, Date.now() - startTime, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      logHttpError(response.status, `Failed to delete media: ${response.statusText}`);
      throw new Error(`Failed to delete media: ${response.statusText}`);
    }
  }
}