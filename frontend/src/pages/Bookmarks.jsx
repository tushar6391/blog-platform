import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import PostCard from '../components/PostCard';

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get('/bookmarks/')
      .then((res) => {
        setBookmarks(res.data.results);
        setLoading(false);
      })
      .catch(() => {
        setError("Couldn't load your bookmarks.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in">
      <Link to="/" className="text-sm text-stone-500 hover:text-amber-700 mb-6 inline-block">
        ← Back
      </Link>
      <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2">
        Bookmarks
      </h1>
      <p className="text-stone-600 mb-8">
        Stories you've saved to read later.
      </p>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-stone-500 py-12 italic font-serif">
          Loading bookmarks...
        </p>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-sm">
          <p className="font-serif text-2xl italic text-stone-700 mb-3">
            Nothing saved yet.
          </p>
          <p className="text-stone-500 text-sm mb-6">
            When you find a story you'd like to revisit, tap the bookmark icon and it'll appear here.
          </p>
          <Link
            to="/"
            className="inline-block bg-stone-900 hover:bg-stone-800 text-white font-medium px-5 py-2.5 rounded-full text-sm transition shadow-sm"
          >
            Browse stories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarks.map((post, idx) => (
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

export default Bookmarks;