
import React from 'react';

export interface TextStyle {
  id: string;
  name: string;
  fontClass: string;
  fontFamily: string;
  fillStyle: string;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowBlur?: number;
  strokeStyle?: string;
  lineWidth?: number;
}

export const TEXT_STYLES: TextStyle[] = [
  {
    id: 'golden-script',
    name: 'Golden Script',
    fontClass: 'font-lobster',
    fontFamily: "'Lobster', cursive",
    fillStyle: '#FFD700',
    shadowColor: 'rgba(0, 0, 0, 0.7)',
    shadowOffsetX: 3,
    shadowOffsetY: 3,
    shadowBlur: 6,
  },
  {
    id: 'regal-white',
    name: 'Regal White',
    fontClass: 'font-cinzel-decorative',
    fontFamily: "'Cinzel Decorative', serif",
    fillStyle: '#FFFFFF',
    shadowColor: 'rgba(106, 2, 2, 0.8)', // Dark red shadow
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    shadowBlur: 5,
  },
  {
    id: 'vibrant-brush',
    name: 'Vibrant Brush',
    fontClass: 'font-kaushan-script',
    fontFamily: "'Kaushan Script', cursive",
    fillStyle: '#FF4500', // OrangeRed
    strokeStyle: '#FFFFFF',
    lineWidth: 3,
  },
  {
    id: 'bold-impact',
    name: 'Bold Impact',
    fontClass: 'font-teko',
    fontFamily: "'Teko', sans-serif",
    fillStyle: '#FCEE21', // Bright Yellow
    strokeStyle: '#4A0404', // Dark Brown/Red
    lineWidth: 5,
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    fontClass: 'font-orbitron',
    fontFamily: "'Orbitron', sans-serif",
    fillStyle: '#FF1493', // DeepPink
    shadowColor: '#FF1493',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 15,
  },
  {
    id: 'classic-calligraphy',
    name: 'Classic Calligraphy',
    fontClass: 'font-great-vibes',
    fontFamily: "'Great Vibes', cursive",
    fillStyle: '#800000', // Maroon
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffsetX: 1,
    shadowOffsetY: 1,
    shadowBlur: 3,
  },
  {
    id: 'clean-simple',
    name: 'Clean & Simple',
    fontClass: 'font-poppins',
    fontFamily: "'Poppins', sans-serif",
    fillStyle: '#F0F0F0', // Off-white
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    shadowBlur: 8,
  }
];

/**
 * A shared utility function to generate CSS properties for a given text style.
 * It consistently handles color, shadows, and strokes for previews.
 * @param style The TextStyle object.
 * @returns A React.CSSProperties object for styling.
 */
export const getPreviewStyle = (style: TextStyle | undefined): React.CSSProperties => {
    if (!style) return {};

    const cssProperties: React.CSSProperties = {
        color: style.fillStyle,
    };

    if (style.shadowColor) {
        cssProperties.textShadow = `${style.shadowOffsetX || 0}px ${style.shadowOffsetY || 0}px ${style.shadowBlur || 0}px ${style.shadowColor}`;
    }

    if (style.strokeStyle && style.lineWidth) {
        // Use a consistent pixel-based calculation for the preview stroke.
        // This is a robust approximation for CSS from the canvas line width.
        const previewStrokeWidth = style.lineWidth / 2;
        cssProperties.WebkitTextStroke = `${previewStrokeWidth}px ${style.strokeStyle}`;
    }

    return cssProperties;
};

interface TextStyleSelectorProps {
  selectedStyleId: string;
  onSelectStyle: (id: string) => void;
}

export const TextStyleSelector: React.FC<TextStyleSelectorProps> = ({ selectedStyleId, onSelectStyle }) => {
  return (
    <div className="w-full">
      <h3 className="text-xl font-bold font-teko tracking-wider text-orange-400 mb-2">3. CUSTOMIZE TEXT STYLE</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TEXT_STYLES.map((style) => {
          const isSelected = selectedStyleId === style.id;
          return (
            <button
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                isSelected ? 'border-orange-500 ring-2 ring-orange-500' : 'border-slate-600 hover:border-slate-400'
              } bg-slate-800/50`}
              aria-pressed={isSelected}
              aria-label={`Select ${style.name} text style`}
            >
              <span
                className={`${style.fontClass} text-2xl truncate`}
                style={getPreviewStyle(style)}
              >
                Navratri
              </span>
              <span className="block text-xs text-slate-400 mt-1">{style.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};