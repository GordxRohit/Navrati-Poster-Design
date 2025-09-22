import React from 'react';

export type TextPosition = 'top' | 'middle' | 'bottom';

interface TextPositionSelectorProps {
  selectedPosition: TextPosition;
  onSelectPosition: (position: TextPosition) => void;
}

const PositionButton: React.FC<{
  label: string;
  position: TextPosition;
  isSelected: boolean;
  onClick: (position: TextPosition) => void;
  children: React.ReactNode;
}> = ({ label, position, isSelected, onClick, children }) => (
  <button
    onClick={() => onClick(position)}
    className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 ${
      isSelected ? 'border-orange-500 bg-orange-900/50' : 'border-slate-600 hover:border-slate-400 bg-slate-800/50'
    }`}
    aria-pressed={isSelected}
    aria-label={`Set text position to ${label}`}
  >
    {children}
    <span className="text-sm font-semibold mt-1">{label}</span>
  </button>
);

const IconAlignTop = () => (
  <svg width="24" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
    <path d="M4 4H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 9H16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14H16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconAlignMiddle = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
    <path d="M4 12H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 7H16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 17H16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconAlignBottom = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
    <path d="M4 20H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 10H16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 15H16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TextPositionSelector: React.FC<TextPositionSelectorProps> = ({ selectedPosition, onSelectPosition }) => {
  return (
    <div className="w-full">
      <h3 className="text-xl font-bold font-teko tracking-wider text-orange-400 mb-2">4. TEXT POSITION</h3>
      <div className="flex gap-3">
        <PositionButton label="Top" position="top" isSelected={selectedPosition === 'top'} onClick={onSelectPosition}>
          <IconAlignTop />
        </PositionButton>
        <PositionButton label="Middle" position="middle" isSelected={selectedPosition === 'middle'} onClick={onSelectPosition}>
          <IconAlignMiddle />
        </PositionButton>
        <PositionButton label="Bottom" position="bottom" isSelected={selectedPosition === 'bottom'} onClick={onSelectPosition}>
          <IconAlignBottom />
        </PositionButton>
      </div>
    </div>
  );
};