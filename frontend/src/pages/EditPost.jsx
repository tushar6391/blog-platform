import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, COVER_GALLERY } from '../data/categories';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('reflective');
  const [coverImage, setCoverImage] = useState('');
  const [originalStatus, setOriginalStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // 'draft' | 'publish' | null
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');

  // Fetch the existing post
  useEffect(() => {
    apiClient
      .get(`/posts/${id}/`)
      .then((res) => {
        const post = res.data;

        // Make sure the current user is the author
        if (user && post.author !== user.username) {
          setLoadError("You can only edit your own stories.");
          setLoading(false);
          return;
        }

        setTitle(post.title || '');
        setContent(post.content || '');
        setCategory(post.category || 'reflective');
        setCoverImage(post.cover_image_url || '');
        setOriginalStatus(post.status || 'draft');
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setLoadError("This story doesn't exist or was removed.");
        } else {
          setLoadError("Couldn't load this story.");
        }
        setLoading(false);
      });
  }, [id, user]);

  const coversForCategory = COVER_GALLERY[category] || [];
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  function canPublish() {
    return title.trim() && content.trim() && category && coverImage;
  }

  async function handleSave(status) {
    setError('');

    if (!title.trim()) {
      setError('Please add a title before saving.');
      return;
    }

    if (status === 'published' && !canPublish()) {
      setError('To publish, you need a title, content, category, and cover image.');
      return;
    }

    setSaving(status === 'published' ? 'publish' : 'draft');

    try {
      await apiClient.patch(`/posts/${id}/`, {
        title: title.trim(),
        content: content.trim(),
        category,
        cover_image_url: coverImage || COVER_GALLERY[category][0],
        status,
      });

      if (status === 'published') {
        navigate(`/posts/${id}`);
      } else {
        navigate('/drafts');
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.title) setError(`Title: ${data.title[0]}`);
      else if (data?.content) setError(`Content: ${data.content[0]}`);
      else if (data?.detail) setError(data.detail);
      else setError('Something went wrong. Please try again.');
      setSaving(null);
    }
  }

  function handleCategoryChange(newCat) {
    setCategory(newCat);
    // Only reset cover if current cover isn't in the new category
    if (!COVER_GALLERY[newCat].includes(coverImage)) {
      setCoverImage('');
    }
  }

  // Loading state
  if (loading) {
    return (
      <p className="text-center text-stone-500 py-20 italic font-serif">
        Loading your story...
      </p>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="font-serif text-3xl italic text-stone-700 mb-3">
          {loadError}
        </p>
        <Link to="/drafts" className="text-amber-700 hover:underline">
          ← Back to drafts
        </Link>
      </div>
    );
  }

  const isDraft = originalStatus === 'draft';

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <Link
          to={isDraft ? '/drafts' : `/posts/${id}`}
          className="text-sm text-stone-500 hover:text-amber-700 inline-flex items-center gap-1"
        >
          <span>←</span>
          <span>Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving !== null}
            className="text-sm font-medium text-stone-700 px-5 py-2 rounded-full border border-stone-200 bg-white hover:border-stone-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving === 'draft' ? 'Saving...' : 'Save draft'}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving !== null || !canPublish()}
            className="text-sm font-medium bg-amber-700 hover:bg-amber-800 text-white px-5 py-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-1.5"
          >
            {saving === 'publish'
              ? 'Publishing...'
              : isDraft
              ? 'Publish →'
              : 'Update →'}
          </button>
        </div>
      </div>

      {/* Status indicator */}
      <div className="mb-6">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            isDraft
              ? 'bg-stone-100 text-stone-700 border border-stone-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {isDraft ? 'Editing draft' : 'Editing published story'}
        </span>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-2xl p-8 md:p-10 space-y-10 shadow-sm">
        {/* Title */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-500 mb-3">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your story title..."
            className="w-full font-serif text-3xl md:text-4xl font-bold text-stone-900 placeholder-stone-300 bg-transparent border-none focus:outline-none focus:border-b-2 focus:border-stone-200 pb-2 transition"
            maxLength={200}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-500 mb-3">
            Story
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your story..."
            rows={12}
            className="w-full font-serif text-lg text-stone-800 placeholder-stone-300 bg-transparent border-none focus:outline-none resize-y leading-relaxed"
          />
          <div className="text-xs text-stone-400 mt-2">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-500 mb-3">
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-3 py-3 rounded-xl text-sm font-medium border transition-all ${
                  category === cat.value
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                <span className="block text-xl mb-1">{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cover image gallery */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-stone-500 mb-3">
            Cover image
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {coversForCategory.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => setCoverImage(url)}
                className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-cover bg-center transition-transform hover:scale-105 ${
                  coverImage === url
                    ? 'ring-[3px] ring-amber-700 ring-offset-2'
                    : 'ring-1 ring-stone-200'
                }`}
                style={{ backgroundImage: `url(${url})` }}
                aria-label="Choose this cover"
              >
                {coverImage === url && (
                  <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPost;