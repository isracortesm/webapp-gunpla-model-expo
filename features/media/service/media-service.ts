import { UploadMediaUseCase } from '@/domain/usecases/media/upload-media-usecase';
import { DeleteMediaUseCase } from '@/domain/usecases/media/delete-media-usecase';
import { MediaRepositoryImpl } from '@/data/repositories/media/media-repository-impl';
import { HttpService } from '@/data/services/http-client';

const httpService = new HttpService();
const repository = new MediaRepositoryImpl(httpService);
const uploadMediaUseCase = new UploadMediaUseCase(repository);
const deleteMediaUseCase = new DeleteMediaUseCase(repository);

export async function uploadMedia(file: File, token?: string) {
  return uploadMediaUseCase.execute(file, token);
}

export async function deleteMedia(id: number, token?: string) {
  await deleteMediaUseCase.execute(id, token);
}