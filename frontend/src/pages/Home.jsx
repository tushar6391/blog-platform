import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import PostCard from '../components/PostCard';
import Greeting from '../components/Greeting';
import { CATEGORIES } from '../data/categories';
import { useAuth } from '../context/AuthContext';

const SUBTITLES = [
  'thoughtful writing',
  'honest conversation',
  'ideas that linger',
  'stories worth telling',
  'quiet craftsmanship',
];

function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [typed, setTyped] = useState('');

  // Typewriter for the hero subtitle (only shown when logged out)
  useEffect(() => {
    if (user) return; // skip when logged in — no hero
    let current = SUBTITLES[subtitleIndex];
    let i = 0;
    let deleting = false;
    let timer;

    function tick() {
      if (!deleting) {
        i++;
        setTyped(current.slice(0, i));
        if (i === current.length) {
          deleting = true;
          timer = setTimeout(tick, 2200);
          return;
        }
        timer = setTimeout(tick, 55);
      } else {
        i--;
        setTyped(current.slice(0, i));
        if (i === 0) {
          setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
          return;
        }
        timer = setTimeout(tick, 30);
      }
    }

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, [subtitleIndex, user]);

  // Fetch posts (re-fetches when category changes)
  useEffect(() => {
    setLoading(true);
    const params = activeCategory !== 'all' ? `?category=${activeCategory}` : '';
    apiClient
      .get(`/posts/${params}`)
      .then((res) => {
        setPosts(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [activeCategory]);

  return (
    <div>
      {user ? (
        // Logged-in: personalized greeting
        <Greeting />
      ) : (
        // Logged-out: marketing hero
        <section className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-stone-900 tracking-tight mb-5 leading-[1.05] animate-blur-focus">
            Stories worth<br />
            <em className="text-amber-700">crafting.</em>
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            A quiet corner of the internet for{' '}
            <span className="text-amber-700 font-medium border-r-2 border-amber-700 pr-1">
              {typed}
            </span>
            .
          </p>
        </section>
      )}

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap mb-10 pb-6 border-b border-stone-200">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
            activeCategory === 'all'
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900 hover:text-stone-900'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              activeCategory === cat.value
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900 hover:text-stone-900'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <p className="text-center text-stone-500 py-16 italic font-serif">
          Gathering stories...
        </p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
          <p className="font-semibold">Couldn't load stories</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-20">
          <p className="font-serif text-2xl italic text-stone-700 mb-2">
            No stories yet.
          </p>
          <p className="text-stone-500 text-sm">
            {user ? 'Be the first to write one.' : 'Stories will appear here once writers publish.'}
          </p>
        </div>
      )}

      {/* Post grid */}
      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, idx) => (
            <div
              key={post.id}
              className="animate-fade-up"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;