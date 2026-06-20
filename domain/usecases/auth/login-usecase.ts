import { AuthResponseEntity } from '../../../domain/entities/auth/entity';
import { AuthRepository } from '../../../domain/repositories/auth/auth-repository';

export class LoginUseCase {
  private repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(identifier: string, password: string): Promise<AuthResponseEntity> {
    return this.repository.login(identifier, password);
  }
}