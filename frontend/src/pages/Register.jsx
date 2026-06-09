import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(username, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.username) {
        setError(`Username: ${data.username[0]}`);
      } else if (data?.email) {
        setError(`Email: ${data.email[0]}`);
      } else if (data?.password) {
        setError(`Password: ${data.password[0]}`);
      } else if (data?.detail) {
        setError(data.detail);
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
        <p className="text-stone-600">Begin your writing journey.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-1">Create an account</h2>
        <p className="text-sm text-stone-500 mb-6">Free forever. No credit card needed.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              autoFocus
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-700/10 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-700/10 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
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
            {submitting ? 'Creating account...' : 'Create account →'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;