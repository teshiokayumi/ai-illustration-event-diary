
import { User } from '../types';

// IMPORTANT: This is a mock service for a frontend-only demo.
// In a real application, never store passwords (even "hashes") or user data in localStorage.
// All authentication logic should be handled by a secure backend server.

const USERS_KEY = 'event_diary_users';
const CURRENT_USER_KEY = 'event_diary_current_user';

const getUsers = (): (User & { passwordHash: string })[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: (User & { passwordHash: string })[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const register = async (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getUsers();
      if (users.some(u => u.email === email)) {
        alert('User with this email already exists.');
        resolve(null);
        return;
      }
      
      const newUser: User & { passwordHash: string } = {
        id: `user_${Date.now()}`,
        email,
        passwordHash: password, // In a real app, this would be a secure hash from the backend
      };

      users.push(newUser);
      saveUsers(users);

      const { passwordHash, ...userToReturn } = newUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToReturn));
      resolve(userToReturn);
    }, 500);
  });
};


export const login = async (email: string, password: string): Promise<User | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = getUsers();
            const user = users.find(u => u.email === email && u.passwordHash === password);

            if (user) {
                const { passwordHash, ...userToReturn } = user;
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToReturn));
                resolve(userToReturn);
            } else {
                alert('Invalid email or password.');
                resolve(null);
            }
        }, 500);
    });
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};
