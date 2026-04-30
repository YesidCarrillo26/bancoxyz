import { BuildingLibraryIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface FieldErrors {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({ email: '', password: '' });
  const [apiError, setApiError] = useState('');

  const validate = (): boolean => {
    const errors: FieldErrors = { email: '', password: '' };
    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    try {
      await login(email, password);
      navigate('/home');
    } catch {
      setApiError('Invalid email or password.');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 flex items-center justify-center px-5'>
      <div className='bg-white rounded-2xl w-full max-w-md p-8'>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
            <BuildingLibraryIcon className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">BancoXYZ</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className='block text-sm font-semibold text-gray-700 mb-1' htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`input-field transition-colors duration-200 ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })); }}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className='block text-sm font-semibold text-gray-700 mb-1' htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="•••••••"
              className={`input-field transition-colors duration-200 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: '' })); }}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {apiError && (
            <p className="text-red-500 text-sm mb-3">{apiError}</p>
          )}

          <button
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
