import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export default function StarRating({ rating, onChange, size = 16, readonly = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition-transform ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            size={size}
            className={`transition-colors ${star <= rating ? 'fill-star-filled text-star-filled' : 'text-star-empty'}`}
          />
        </button>
      ))}
    </div>
  );
}
