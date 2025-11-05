import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let user;
      if (isLogin) {
        user = await login(email, password);
      } else {
        user = await register(email, password);
      }

      if (user) {
        navigate('/dashboard');
      } else {
        setError(isLogin ? 'Login failed. Please check your credentials.' : 'Registration failed. The email might already be in use.');
      }
    } catch (err) {
        setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-surface rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2">{isLogin ? 'Welcome Back!' : 'Create an Account'}</h2>
        <p className="text-center text-on-surface-secondary mb-8">{isLogin ? 'Log in to manage your events.' : 'Sign up to start creating events.'}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-on-surface-secondary mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-on-surface focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-on-surface-secondary mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-on-surface focus:ring-primary focus:border-primary"
            />
             {isLogin && (
                <div className="text-right text-sm mt-2">
                    <button 
                        type="button" 
                        onClick={() => alert('パスワードリセット機能はこのデモでは実装されていません。実際のアプリケーションでは、ここにリセット用のメールを送信するロジックが入ります。')} 
                        className="font-medium text-primary hover:text-indigo-400"
                    >
                    パスワードをお忘れですか？
                    </button>
                </div>
             )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-on-surface-secondary hover:text-primary underline"
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
