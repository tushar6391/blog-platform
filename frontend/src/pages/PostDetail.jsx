import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import Comments from '../components/Comments';
import { getCategory, DEFAULT_COVER } from '../data/categories';
import { formatDate, getReadingTime } from '../utils/avatar';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionPending, setActionPending] = useState(false);

  // Fetch post
  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/posts/${id}/`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError("This story doesn't exist or was removed.");
        } else {
          setError("Couldn't load the story.");
        }
        setLoading(false);
      });
  }, [id]);

  async function handleLike() {
    if (!user) {
      navigate('/login', { state: { from: `/posts/${id}` } });
      return;
    }
    setActionPending(true);
    try {
      const res = await apiClient.post(`/posts/${id}/like/`);
      setPost({ ...post, is_liked: res.data.liked, like_count: res.data.like_count });
    } catch {
      // Silent fail — could add a toast later
    } finally {
      setActionPending(false);
    }
  }

  async function handleBookmark() {
    if (!user) {
      navigate('/login', { state: { from: `/posts/${id}` } });
      return;
    }
    setActionPending(true);
    try {
      const res = await apiClient.post(`/posts/${id}/bookmark/`);
      setPost({
        ...post,
        is_bookmarked: res.data.bookmarked,
        bookmark_count: res.data.bookmark_count,
      });
    } catch {
      // Silent fail
    } finally {
      setActionPending(false);
    }
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      prompt('Copy this link:', url);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this story permanently? This cannot be undone.')) return;
    setActionPending(true);
    try {
      await apiClient.delete(`/posts/${id}/`);
      navigate('/');
    } catch {
      setError("Couldn't delete the story.");
      setActionPending(false);
    }
  }

  if (loading) {
    return (
      <p className="text-center text-stone-500 py-20 italic font-serif">
        Loading the story...
      </p>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="font-serif text-3xl italic text-stone-700 mb-3">
          {error || 'Story not found.'}
        </p>
        <Link to="/" className="text-amber-700 hover:underline">
          ← Back to stories
        </Link>
      </div>
    );
  }

  const category = getCategory(post.category);
  const isAuthor = user && user.username === post.author;

  return (
    <article className="max-w-3xl mx-auto animate-fade-in">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center text-sm text-stone-500 hover:text-amber-700 mb-8 group transition-colors"
      >
        <span className="mr-1 group-hover:-translate-x-0.5 transition-transform">←</span>
        Back to stories
      </Link>

      {/* Cover image */}
      {post.cover_image_url && (
        <div
          className="w-full h-64 sm:h-80 md:h-96 bg-cover bg-center rounded-2xl mb-10 shadow-md"
          style={{ backgroundImage: `url(${post.cover_image_url || DEFAULT_COVER})` }}
        ></div>
      )}

      {/* Category pill */}
      <div className="mb-5">
        <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          {category.emoji} {category.label}
        </span>
        {post.status === 'draft' && (
          <span className="ml-2 inline-block bg-stone-100 text-stone-700 border border-stone-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Draft
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-[1.1] tracking-tight mb-8">
        {post.title}
      </h1>

      {/* Author row + actions */}
      <div className="flex items-center gap-3 pb-6 mb-10 border-b border-stone-200">
        <Avatar username={post.author} size="lg" />
        <div className="flex-1">
          <div className="font-semibold text-stone-900">{post.author}</div>
          <div className="text-sm text-stone-500">
            {formatDate(post.created_at)} · {getReadingTime(post.content)}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            disabled={actionPending}
            title={post.is_liked ? 'Unlike' : 'Like'}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:-translate-y-0.5 disabled:opacity-50 ${
              post.is_liked
                ? 'border-amber-700 bg-amber-50 text-amber-700'
                : 'border-stone-200 bg-white text-stone-500 hover:border-stone-900'
            }`}
          >
            {post.is_liked ? '♥' : '♡'}
          </button>
          <span className="text-sm text-stone-600 min-w-[1.5rem] text-center">
            {post.like_count}
          </span>

          <button
            onClick={handleBookmark}
            disabled={actionPending}
            title={post.is_bookmarked ? 'Remove bookmark' : 'Bookmark'}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:-translate-y-0.5 disabled:opacity-50 ml-2 ${
              post.is_bookmarked
                ? 'border-amber-700 bg-amber-50 text-amber-700'
                : 'border-stone-200 bg-white text-stone-500 hover:border-stone-900'
            }`}
          >
            {post.is_bookmarked ? '●' : '⊕'}
          </button>

          <button
            onClick={handleShare}
            title="Copy link"
            className="w-10 h-10 rounded-full border border-stone-200 bg-white text-stone-500 hover:border-stone-900 hover:-translate-y-0.5 transition-all flex items-center justify-center ml-2"
          >
            ↗
          </button>
        </div>
      </div>

      {/* Author-only edit/delete */}
{isAuthor && (
  <div className="mb-8 flex gap-2 text-sm">
    <button
      onClick={() => navigate(`/posts/${id}/edit`)}
      disabled={actionPending}
      className="text-stone-700 hover:text-stone-900 font-medium px-3 py-1.5 rounded-md hover:bg-stone-100 transition disabled:opacity-50 flex items-center gap-1.5"
    >
      <span>✎</span>
      <span>Edit story</span>
    </button>
    <button
      onClick={handleDelete}
      disabled={actionPending}
      className="text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition disabled:opacity-50"
    >
      Delete story
    </button>
  </div>
)}

      {/* Content */}
      <div className="font-serif text-lg sm:text-xl text-stone-800 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Comments */}
      <Comments postId={id} />
    </article>
  );
}

export default PostDetail;