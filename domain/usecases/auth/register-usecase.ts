import { AuthResponseEntity } from '../../../domain/entities/auth/entity';
import { AuthRepository } from '../../../domain/repositories/auth/auth-repository';

export class RegisterUseCase {
  private repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(username: string, email: string, password: string): Promise<AuthResponseEntity> {
    return this.repository.register(username, email, password);
  }
}