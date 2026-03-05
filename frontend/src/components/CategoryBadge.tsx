import Link from 'next/link';

interface CategoryBadgeProps {
  categoryName: string;
  categorySlug: string;
  categoryColor: string;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
}

export function CategoryBadge({ categoryName, categorySlug, categoryColor, size = 'md', clickable = true }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const badgeContent = (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        transition-all duration-200
        ${sizeClasses[size]}
        ${clickable ? 'hover:scale-105 cursor-pointer' : ''}
      `}
      style={{
        backgroundColor: `${categoryColor}20`,
        color: categoryColor,
        border: `1px solid ${categoryColor}40`,
      }}
    >
      {categoryName}
    </span>
  );

  if (clickable) {
    return (
      <Link href={`/?category=${categorySlug}`}>
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
}
