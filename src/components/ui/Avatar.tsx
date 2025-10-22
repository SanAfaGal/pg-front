import { ImgHTMLAttributes } from 'react';
import { User } from 'lucide-react';

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg' | '2xl';
  name?: string;
}

export const Avatar = ({ size = 'md', name, src, className = '', ...props }: AvatarProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    '2xl': 'w-24 h-24',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    '2xl': 48,
  };

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (!src && !name) {
    return (
      <div
        className={`${sizes[size]} rounded-full bg-gradient-to-br from-powergym-blue-gray to-powergym-blue-medium flex items-center justify-center ${className}`}
      >
        <User size={iconSizes[size]} className="text-white" />
      </div>
    );
  }

  if (!src && initials) {
    return (
      <div
        className={`${sizes[size]} rounded-full bg-gradient-to-br from-powergym-red to-powergym-blue-medium flex items-center justify-center text-white font-medium text-sm ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || 'Avatar'}
      className={`${sizes[size]} rounded-full object-cover ring-2 ring-white ${className}`}
      {...props}
    />
  );
};
