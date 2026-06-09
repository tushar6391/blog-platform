import { getAvatarGradient, getInitials } from '../utils/avatar';

function Avatar({ username, size = 'md' }) {
  const [color1, color2] = getAvatarGradient(username);
  const initials = getInitials(username);

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
      style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
      title={username}
    >
      {initials}
    </div>
  );
}

export default Avatar;