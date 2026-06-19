import { AuthRepository } from '../../../domain/repositories/auth/auth-repository';
import { AuthResponseEntity, ResetPasswordRequestEntity } from '../../../domain/entities/auth/entity';
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

  async forgotPassword(email: string): Promise<void> {
    console.log('AuthRepositoryImpl.forgotPassword');
    await this.http.post('/api/auth/forgot-password', { email });
  }

  async resetPassword(request: ResetPasswordRequestEntity): Promise<AuthResponseEntity> {
    console.log('AuthRepositoryImpl.resetPassword');
    return this.http.post('/api/auth/reset-password', request as unknown as Record<string, unknown>);
  }

  async getCurrentUser(): Promise<AuthResponseEntity['user']> {
    console.log('AuthRepositoryImpl.getCurrentUser');
    
    // Read stored JWT for authenticated requests (token is now a plain string)
    const AUTH_TOKEN_KEY = 'auth_token';
    let token: string | undefined;
    try {
      const stored = localStorage.getItem(AUTH_TOKEN_KEY);
      if (stored && typeof stored === 'string') {
        token = stored;
      }
    } catch (error) {
      console.error(error);
    }

    // Create authenticated HTTP service with Bearer token
    const authHttpService = new HttpService(this.http['baseUrl'], token);
    
    const response = await authHttpService.get<{ user: AuthResponseEntity['user'] }>('/api/users/me', {
      populate: ['profileImage', 'socialNetworks'],
    });
    return response.user;
  }

  async logout(): Promise<void> {
    console.log('AuthRepositoryImpl.logout');
    
    // Read stored JWT for authenticated requests (token is now a plain string)
    const AUTH_TOKEN_KEY = 'auth_token';
    let token: string | undefined;
    try {
      const stored = localStorage.getItem(AUTH_TOKEN_KEY);
      if (stored && typeof stored === 'string') {
        token = stored;
      }
    } catch (error) {
      console.error(error);
    }

    return;
  }
}