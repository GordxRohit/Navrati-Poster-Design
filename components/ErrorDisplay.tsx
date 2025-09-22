
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="bg-red-900/50 border-2 border-red-500 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
    <strong className="font-bold block">Oops! Something went wrong.</strong>
    <span className="block sm:inline">{message}</span>
  </div>
);
