import { AuthRepository } from '../../../domain/repositories/auth/auth-repository';
import { UserEntity, AuthResponseEntity, ResetPasswordRequestEntity, UpdateUserParams } from '../../../domain/entities/auth/entity';
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

  async changePassword(currentPassword: string, password: string, passwordConfirmation: string): Promise<AuthResponseEntity> {
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

    const authHttpService = new HttpService(this.http['baseUrl'], token);
    return authHttpService.post('/api/auth/change-password', {
      currentPassword,
      password,
      passwordConfirmation,
    });
  }

  async updateUser(userId: number, params: UpdateUserParams, token?: string): Promise<UserEntity> {
    const authHttpService = new HttpService(this.http['baseUrl'], token);
    return authHttpService.put(`/api/users/${userId}`, {
      username: params.username,
      aboutMe: params.aboutMe,
      socialNetworks: params.socialNetworks,
      profileImage: params.profileImage,
    });
  }

  async getCurrentUser(): Promise<UserEntity> {
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
    
    return await authHttpService.get('/api/users/me', {
      populate: ['profileImage', 'socialNetworks'],
    });;
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