import React from 'react';
import { LikertOption } from '../data/assessmentQuestions';

interface StarLikertButtonProps {
  questionId: number | string;
  option: LikertOption;
  isSelected: boolean;
  onSelect?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

// Chubby, rounded, plump 5-pointed star matching reference design
// Each tip is a smooth rounded dome, with a wide body and cute proportions
export const CHUBBY_ROUNDED_STAR_PATH = 
  'M 34.72 30.97 L 40.22 9.93 A 13 13 0 0 1 59.78 9.93 L 65.28 30.97 ' +
  'L 86.99 29.7 A 13 13 0 0 1 93.03 48.3 L 74.73 60.03 ' +
  'L 82.64 80.29 A 13 13 0 0 1 66.82 91.78 L 50 78 ' +
  'L 33.18 91.78 A 13 13 0 0 1 17.36 80.29 L 25.27 60.03 ' +
  'L 6.97 48.3 A 13 13 0 0 1 13.01 29.7 L 34.72 30.97 Z';

export const StarLikertButton: React.FC<StarLikertButtonProps> = ({
  questionId,
  option,
  isSelected,
  onSelect,
  size = 'md',
  interactive = true,
}) => {
  const handleClick = () => {
    if (interactive && onSelect) {
      onSelect(option.value);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!interactive}
      aria-label={`ระดับ ${option.value}: ${option.label}`}
      className={`group relative flex items-center justify-center transition-all duration-200 transform select-none focus:outline-none w-full ${
        interactive ? 'cursor-pointer active:scale-95' : 'cursor-default'
      } ${
        isSelected
          ? 'scale-110 sm:scale-115 -translate-y-1 z-10'
          : interactive
          ? 'hover:scale-105 hover:-translate-y-0.5'
          : ''
      }`}
      style={{
        aspectRatio: '1 / 1',
        maxWidth: size === 'sm' ? '56px' : size === 'lg' ? '88px' : '74px',
        minWidth: size === 'sm' ? '36px' : '42px',
      }}
    >
      {/* SVG Chubby Rounded Star: Black color outline, White fill when unselected, Black fill when selected */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transition-all duration-200 overflow-visible"
        style={{
          filter: isSelected
            ? 'drop-shadow(0 6px 14px rgba(0,0,0,0.28)) drop-shadow(0 2px 4px rgba(0,0,0,0.12))'
            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))'
        }}
      >
        {/* Outer soft glow ring when selected */}
        {isSelected && (
          <path
            d={CHUBBY_ROUNDED_STAR_PATH}
            fill="none"
            stroke="#000000"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.15"
          />
        )}

        {/* Chubby Star: Black stroke, White fill when unselected / Black fill when selected */}
        <path
          d={CHUBBY_ROUNDED_STAR_PATH}
          fill={isSelected ? '#000000' : '#ffffff'}
          stroke="#000000"
          strokeWidth={isSelected ? '3.5' : '2.8'}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-200"
        />
      </svg>

      {/* Content inside the star: Number ONLY, centered in the chubby belly */}
      <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none pb-0.5">
        <span
          className={`font-black leading-none transition-all duration-200 tracking-tight ${
            isSelected
              ? 'text-white text-base sm:text-xl md:text-2xl drop-shadow-xs'
              : 'text-black text-sm sm:text-lg md:text-xl group-hover:scale-110'
          }`}
        >
          {option.value}
        </span>
      </div>
    </button>
  );
};

