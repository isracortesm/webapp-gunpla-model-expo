'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/features/auth/service/auth-service';
import { useAuthWithStorage } from '@/features/auth/context/auth-provider';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthWithStorage();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await registerUser(username, email, password);
      login(response.user);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-xl text-black-site">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        {error && (
          <div className="p-3 mb-4 bg-red-500 text-white rounded-md" role="alert">
            {error}
          </div>
        )}

        <label htmlFor="username" className="block font-semibold mb-2">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Enter username"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-blue-500 mb-4"
        />

        <label htmlFor="email" className="block font-semibold mb-2">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter email"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-blue-500 mb-4"
        />

        <label htmlFor="password" className="block font-semibold mb-2">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter password"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-blue-500 mb-6"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors duration-200">
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <a href="/login" className="underline hover:text-blue-600 transition-colors duration-200">Login</a>
        </p>
      </form>
    </div>
  );
}