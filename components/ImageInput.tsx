
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ImageInputProps {
  onImageSelect: (file: File) => void;
  disabled: boolean;
}

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


export const ImageInput: React.FC<ImageInputProps> = ({ onImageSelect, disabled }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
  };

  const startCamera = useCallback(async () => {
    setCameraError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOpen(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError("Could not access camera. Please check permissions and try again.");
        setIsCameraOpen(false);
      }
    } else {
        setCameraError("Camera not supported on this device/browser.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
            onImageSelect(file);
            stopCamera();
          }
        }, 'image/png');
      }
    }
  };
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold font-teko tracking-wider text-orange-400 mb-3">1. CHOOSE YOUR IMAGE</h2>
      {!isCameraOpen ? (
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex-1 cursor-pointer">
            <div className="flex items-center justify-center w-full px-4 py-3 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors">
                <UploadIcon />
                <span>Upload a Photo</span>
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={disabled} />
          </label>
          <button onClick={startCamera} className="flex-1 flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors" disabled={disabled}>
             <CameraIcon/>
            <span>Use Camera</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg border-2 border-indigo-500"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="flex gap-4">
                <button onClick={handleCapture} className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-500">Capture</button>
                <button onClick={stopCamera} className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-500">Close Camera</button>
            </div>
        </div>
      )}
      {cameraError && <p className="text-red-400 text-sm mt-2">{cameraError}</p>}
    </div>
  );
};
