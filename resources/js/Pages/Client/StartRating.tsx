import { Star } from 'lucide-react';

const StarRating = ({ averageRating } : {averageRating: number}) => {
  const renderStars = () => {
    return [...Array(5)].map((_, i) => {
      const ratingValue = i + 1;
      const decimalPart = Number(averageRating) - Math.floor(Number(averageRating));

      // Determine fill percentage based on decimal part
      let fillPercentage = 0;
      if (ratingValue <= Math.floor(Number(averageRating))) {
        fillPercentage = 100;
      } else if (ratingValue === Math.ceil(Number(averageRating))) {
        // Calculate precise fill percentage for the last star
        if (decimalPart > 0 && decimalPart <= 0.25) {
          fillPercentage = 25;
        } else if (decimalPart > 0.25 && decimalPart <= 0.5) {
          fillPercentage = 50;
        } else if (decimalPart > 0.5 && decimalPart <= 0.75) {
          fillPercentage = 75;
        } else if (decimalPart > 0.75) {
          fillPercentage = 100;
        }
      }

      return (
        <span key={i} className="relative">
          {/* Background star (empty) */}
          <Star
            className="h-4 w-4 fill-muted text-muted dark:fill-slate-600 dark:text-slate-600"
          />

          {/* Overlay star (filled) */}
          <span
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${fillPercentage}%` }}
          >
            {fillPercentage > 0 && (
              <Star
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            )}
          </span>
        </span>
      );
    });
  };

  return (
    <div className="flex gap-0.5 mb-1">
      {renderStars()}
    </div>
  );
};

export default StarRating;
