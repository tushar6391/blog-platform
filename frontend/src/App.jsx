import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import NewPost from './pages/NewPost';
import Drafts from './pages/Drafts';
import Bookmarks from './pages/Bookmarks';
import { useAuth } from './context/AuthContext';
import Avatar from './components/Avatar';
import ProtectedRoute from './components/ProtectedRoute';
import EditPost from './pages/EditPost';

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
          : 'bg-white/85 backdrop-blur-md'
      } border-b border-stone-200`}
    >
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-stone-900">
          Post<span className="text-amber-700">Craft</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/posts/new')}
              className="text-sm font-medium bg-amber-700 hover:bg-amber-800 text-white px-5 py-2 rounded-full hover:-translate-y-0.5 transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>✎</span>
              <span>Write</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="block rounded-full ring-2 ring-white shadow hover:ring-amber-200 transition"
                aria-label="Account menu"
              >
                <Avatar username={user.username} size="md" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-stone-100">
                      <div className="text-xs text-stone-500">Signed in as</div>
                      <div className="font-medium text-stone-900">{user.username}</div>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); navigate('/drafts'); }}
                      className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      My drafts
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); navigate('/bookmarks'); }}
                      className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      Bookmarks
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-stone-100"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 px-4 py-2 rounded-full transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-stone-900 text-white px-5 py-2 rounded-full hover:bg-stone-800 hover:-translate-y-0.5 transition-all shadow-sm"
            >
              Get started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative z-[2]">
        <NavBar />

        <main className="max-w-5xl mx-auto py-16 px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/posts/new"
              element={
                <ProtectedRoute>
                  <NewPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drafts"
              element={
                <ProtectedRoute>
                  <Drafts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <footer className="border-t border-stone-200 py-10 mt-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="font-serif italic text-stone-500 text-sm">
              PostCraft — a space for thoughtful writing.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;