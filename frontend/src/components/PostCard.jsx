import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { getCategory, DEFAULT_COVER } from '../data/categories';

function PostCard({ post }) {
  const category = getCategory(post.category);
  const cover = post.cover_image_url || DEFAULT_COVER;
  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      to={`/posts/${post.id}`}
      className="group bg-white border border-stone-200 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col"
    >
      <div
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${cover})` }}
      >
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-stone-900">
          {category.emoji} {category.label}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Avatar username={post.author} size="sm" />
          <span className="text-sm font-medium text-stone-800">{post.author}</span>
          <span className="text-xs text-stone-400">· {date}</span>
        </div>

        <h3 className="font-serif text-xl font-bold text-stone-900 leading-tight mb-2 group-hover:text-amber-800 transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-4 flex-1">
          {post.content}
        </p>

        <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100">
          <div className="flex items-center gap-3">
            <span className={post.is_liked ? 'text-amber-700' : ''}>
              ♥ {post.like_count}
            </span>
            <span>💬 0</span>
          </div>
          <span className={post.is_bookmarked ? 'text-amber-700' : 'text-stone-400'}>
            {post.is_bookmarked ? '●' : '⊕'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;