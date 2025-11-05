import { User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const TOKEN_KEY = 'event_diary_auth_token';
const USER_KEY = 'event_diary_current_user';

// --- Token Management ---
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// --- User Management ---
const saveUser = (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const removeUser = () => {
    localStorage.removeItem(USER_KEY);
};

// --- API Request Helper ---
async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  requiresAuth: boolean = true // Assume auth is required by default
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// --- Auth Service Functions ---
interface AuthResponse {
    token: string;
    user: User;
}

export const register = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User | null> => {
  try {
    // Registration itself doesn't require auth token
    const response = await apiRequest<AuthResponse>('/api/auth/register', 'POST', {
      email,
      password,
      displayName: displayName || email.split('@')[0],
    }, false); // Set requiresAuth to false

    // After successful registration, log the user in by saving token and user data
    saveToken(response.token);
    saveUser(response.user);
    return response.user;
  } catch (error) {
    console.error('Registration failed:', error);
    alert(error instanceof Error ? error.message : 'Registration failed');
    return null;
  }
};

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    // Login itself doesn't require auth token
    const response = await apiRequest<AuthResponse>('/api/auth/login', 'POST', {
      email,
      password,
    }, false); // Set requiresAuth to false

    saveToken(response.token);
    saveUser(response.user);
    return response.user;
  } catch (error) {
    console.error('Login failed:', error);
    alert(error instanceof Error ? error.message : 'Invalid email or password');
    return null;
  }
};

export const logout = () => {
  removeToken();
  removeUser();
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Make apiRequest available to other services
export { apiRequest };