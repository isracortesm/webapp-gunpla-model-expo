import { AuthResponseEntity } from '../../../domain/entities/auth/entity';
import { AuthRepository } from '../../../domain/repositories/auth/auth-repository';

export class GetCurrentUserServiceCase {
  private repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(): Promise<AuthResponseEntity['user']> {
    return this.repository.getCurrentUser();
  }
}