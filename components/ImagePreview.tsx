import React from 'react';

interface ImagePreviewProps {
  label: string;
  imageUrl: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ label, imageUrl }) => (
  <div className="w-full">
    <h3 className="text-xl font-bold font-teko tracking-wider text-orange-400 mb-2">{label}</h3>
    <div className="aspect-square w-full bg-slate-900/50 rounded-lg overflow-hidden border-2 border-slate-700">
      <img src={imageUrl} alt={label} className="w-full h-full object-contain" />
    </div>
  </div>
);
