import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import { formatDate } from '../utils/avatar';

function Comments({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/posts/${postId}/comments/`)
      .then((res) => {
        setComments(res.data.results);
        setLoading(false);
      })
      .catch(() => {
        setError("Couldn't load comments.");
        setLoading(false);
      });
  }, [postId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await apiClient.post(`/posts/${postId}/comments/`, {
        content: newComment.trim(),
      });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId) {
    if (!confirm('Delete this comment?')) return;
    try {
      await apiClient.delete(`/comments/${commentId}/`);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch {
      setError("Couldn't delete comment.");
    }
  }

  return (
    <section className="mt-16 pt-12 border-t border-stone-200">
      <h2 className="font-serif text-2xl font-bold text-stone-900 mb-8">
        Conversation
        {!loading && comments.length > 0 && (
          <span className="text-stone-400 font-normal text-base ml-2">
            ({comments.length})
          </span>
        )}
      </h2>

      {/* Add comment form (or sign-in prompt) */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex gap-3">
            <Avatar username={user.username} size="md" />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-700/10 transition resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="text-sm font-medium bg-stone-900 hover:bg-stone-800 text-white px-5 py-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting...' : 'Post comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-5 bg-stone-50 border border-stone-200 rounded-xl text-center">
          <p className="text-sm text-stone-600">
            <Link to="/login" className="text-amber-700 font-medium hover:underline">
              Sign in
            </Link>{' '}
            to join the conversation.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <p className="text-stone-500 italic font-serif text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-stone-500 italic font-serif text-sm">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar username={c.author} size="md" />
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-medium text-stone-900 text-sm">{c.author}</span>
                  <span className="text-xs text-stone-400">{formatDate(c.created_at)}</span>
                  {user && user.username === c.author && (
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="ml-auto text-xs text-stone-400 hover:text-red-600 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-stone-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {c.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Comments;