import { UserEntity, UpdateUserParams } from '@/domain/entities/auth/entity';
import { AuthRepository } from '@/domain/repositories/auth/auth-repository';

export class UpdateUserUseCase {
  private repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(userId: number, params: UpdateUserParams): Promise<UserEntity> {
    return this.repository.updateUser(userId, params);
  }
}
