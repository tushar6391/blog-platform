import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If the user was redirected here from a protected route, send them back after login
  const redirectTo = location.state?.from || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Wrong username or password.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Something went wrong. Please try again.');
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-8 animate-fade-in">
      <div className="text-center mb-10">
        <Link to="/" className="font-serif text-4xl font-bold tracking-tight inline-block mb-3">
          Post<span className="text-amber-700">Craft</span>
        </Link>
        <p className="text-stone-600">Welcome back, writer.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-1">Sign in</h2>
        <p className="text-sm text-stone-500 mb-6">Pick up where you left off.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
              required
              autoFocus
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-700/10 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-700/10 transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-600 mt-6">
          New to PostCraft?{' '}
          <Link to="/register" className="text-amber-700 font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;