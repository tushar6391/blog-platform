import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { getCategory } from '../data/categories';
import { formatDate } from '../utils/avatar';

function Drafts() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadDrafts();
  }, []);

  function loadDrafts() {
    setLoading(true);
    apiClient
      .get('/posts/?status=draft')
      .then((res) => {
        setDrafts(res.data.results);
        setLoading(false);
      })
      .catch(() => {
        setError("Couldn't load your drafts.");
        setLoading(false);
      });
  }

  async function handleDelete(id) {
    if (!confirm('Delete this draft permanently? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/posts/${id}/`);
      setDrafts(drafts.filter((d) => d.id !== id));
    } catch {
      setError("Couldn't delete the draft.");
    } finally {
      setDeletingId(null);
    }
  }

  function wordCount(text) {
    return (text || '').trim().split(/\s+/).filter(Boolean).length;
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <Link to="/" className="text-sm text-stone-500 hover:text-amber-700 mb-6 inline-block">
        ← Back
      </Link>
      <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2">
        My drafts
      </h1>
      <p className="text-stone-600 mb-8">
        Stories you've started but haven't published yet.
      </p>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-stone-500 py-12 italic font-serif">
          Loading your drafts...
        </p>
      ) : drafts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-sm">
          <p className="font-serif text-2xl italic text-stone-700 mb-3">
            No drafts yet.
          </p>
          <p className="text-stone-500 text-sm mb-6">
            Start writing — save it as a draft and come back to finish later.
          </p>
          <Link
            to="/posts/new"
            className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-medium px-5 py-2.5 rounded-full text-sm transition shadow-sm"
          >
            ✎ Start writing
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => {
            const cat = getCategory(draft.category);
            const isBusy = deletingId === draft.id;
            return (
              <div
                key={draft.id}
                className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Draft
                    </span>
                    <span className="text-xs text-stone-500">
                      {cat.emoji} {cat.label}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-stone-900 mb-1 truncate">
                    {draft.title || 'Untitled story'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Last edited {formatDate(draft.updated_at)} · {wordCount(draft.content)} words
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDelete(draft.id)}
                    disabled={isBusy}
                    className="text-sm text-stone-600 hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/posts/${draft.id}/edit`)}
                    disabled={isBusy}
                    className="text-sm font-medium bg-amber-700 hover:bg-amber-800 text-white px-4 py-1.5 rounded-full transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <span>✎</span>
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Drafts;