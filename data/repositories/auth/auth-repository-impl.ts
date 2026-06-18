import { AuthRepository } from '../../../domain/repositories/auth/auth-repository';
import { AuthResponseEntity } from '../../../domain/entities/auth/entity';
import { HttpService } from '../../services/http-client';

export class AuthRepositoryImpl implements AuthRepository {
  private http: HttpService;

  constructor(http: HttpService) {
    this.http = http;
  }

  async register(username: string, email: string, password: string): Promise<AuthResponseEntity> {
    console.log('AuthRepositoryImpl.register');
    return this.http.post('/api/auth/local/register', {
      username,
      email,
      password,
    });
  }

  async login(identifier: string, password: string): Promise<AuthResponseEntity> {
    console.log('AuthRepositoryImpl.login');
    return this.http.post('/api/auth/local', {
      identifier,
      password,
    });
  }
}