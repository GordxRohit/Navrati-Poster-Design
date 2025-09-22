
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageInput } from './components/ImageInput';
import { ImagePreview } from './components/ImagePreview';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { generatePoster } from './services/geminiService';
import { CustomizationPanel, CustomizationState } from './components/CustomizationPanel';
import { TextStyleSelector, TEXT_STYLES, getPreviewStyle } from './components/TextStyleSelector';
import { TextPosition, TextPositionSelector } from './components/TextPositionSelector';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUsedPrompt, setLastUsedPrompt] = useState<string | null>(null);
  const [selectedTextStyleId, setSelectedTextStyleId] = useState<string>(TEXT_STYLES[0].id);
  const [textPosition, setTextPosition] = useState<TextPosition>('bottom');
  const [customizations, setCustomizations] = useState<CustomizationState>({
    top: '',
    bottom: '',
    shoes: '',
    headwear: '',
    eyewear: '',
    background: '',
    aspectRatio: '1:1',
  });

  const handleImageSelect = useCallback((file: File) => {
    setOriginalImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setOriginalImagePreview(previewUrl);
    setGeneratedImage(null);
    setGeneratedText(null);
    setError(null);
    setLastUsedPrompt(null);
  }, []);

  const handleCustomizationChange = useCallback((field: keyof CustomizationState, value: string) => {
    setCustomizations(prev => ({ ...prev, [field]: value }));
  }, []);

  const constructPrompt = (): string => {
    const clothingItems = [
      customizations.top,
      customizations.bottom,
      customizations.shoes,
      customizations.headwear,
      customizations.eyewear,
    ].filter(Boolean); // Filters out any empty strings

    let clothingDescription = 'The person is dressed in a beautiful, traditional Navratri outfit.';
    if (clothingItems.length > 0) {
      // Joins the clothing items into a natural-sounding list
      const naturalJoin = (arr: string[]) => {
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
        return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`;
      };
      clothingDescription = `The person is wearing ${naturalJoin(clothingItems)}.`;
    }

    const backgroundDescription = customizations.background
      ? `The scene is set in ${customizations.background}.`
      : 'The scene is set during a vibrant and divine Navratri celebration.';

    const aspectRatioInstruction = `The image must have a ${customizations.aspectRatio} aspect ratio.`;

    return `
      Generate a photorealistic, high-quality 8k Navratri and Durga Puja special poster without any text or words.
      The poster should feature a person whose face is inspired by the provided image.
      Integrate the face seamlessly and naturally into the new scene, ensuring it looks realistic and not like a disconnected edit.
      ${clothingDescription}
      ${backgroundDescription}
      The overall mood must be divine, celebratory, and vibrant, with rich colors and festive lighting.
      The composition should be artistic, allowing space for text to be overlaid later.
      ${aspectRatioInstruction}
    `.trim().replace(/\s+/g, ' ');
  };


  const handleGenerate = useCallback(async () => {
    if (!originalImageFile) {
      setError("Please select an image first.");
      return;
    }

    const finalPrompt = constructPrompt();
    setLastUsedPrompt(finalPrompt);

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText(null);

    try {
      const result = await generatePoster(originalImageFile, finalPrompt);
      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
      }
      if (result.text) {
        setGeneratedText(result.text);
      }
      if (!result.imageUrl && !result.text) {
        setError("The AI could not generate an image from the provided input. Please try a different image or description.");
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, customizations]);
  
  const handleDownload = useCallback(async () => {
    if (!generatedImage) return;

    const selectedStyle = TEXT_STYLES.find(s => s.id === selectedTextStyleId);
    if (!selectedStyle) {
        setError("Selected text style not found.");
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        setError("Could not create a canvas to prepare the download.");
        return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous'; 

    img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const text = 'Happy Navratri';
        const fontSize = Math.floor(canvas.width / 12);
        ctx.font = `${fontSize}px ${selectedStyle.fontFamily}`;
        ctx.textAlign = 'center';

        // Reset effects
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'transparent';
        ctx.lineWidth = 1;

        // Apply styles from the selected style object
        ctx.fillStyle = selectedStyle.fillStyle;

        if (selectedStyle.shadowColor) {
            ctx.shadowColor = selectedStyle.shadowColor;
            ctx.shadowOffsetX = selectedStyle.shadowOffsetX || 0;
            ctx.shadowOffsetY = selectedStyle.shadowOffsetY || 0;
            ctx.shadowBlur = selectedStyle.shadowBlur || 0;
        }
        
        const x = canvas.width / 2;
        const y = (() => {
          switch (textPosition) {
            case 'top':
              ctx.textBaseline = 'top';
              return fontSize * 0.5; // Padding from top
            case 'middle':
              ctx.textBaseline = 'middle';
              return canvas.height / 2;
            case 'bottom':
            default:
              ctx.textBaseline = 'bottom';
              return canvas.height - (fontSize * 0.5); // Padding from bottom
          }
        })();


        // Apply stroke if it exists
        if (selectedStyle.strokeStyle && selectedStyle.lineWidth) {
            ctx.strokeStyle = selectedStyle.strokeStyle;
            ctx.lineWidth = selectedStyle.lineWidth;
            ctx.strokeText(text, x, y);
        }

        ctx.fillText(text, x, y);
        
        const link = document.createElement('a');
        link.download = 'navratri-poster.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    img.onerror = () => {
        setError("Failed to load the generated image for download. Please try again.");
    };

    img.src = generatedImage;
  }, [generatedImage, selectedTextStyleId, textPosition]);

  const selectedStyle = TEXT_STYLES.find(s => s.id === selectedTextStyleId);

  const getPositionClasses = (position: TextPosition) => {
    switch (position) {
      case 'top':
        return 'top-2 md:top-4';
      case 'middle':
        return 'top-1/2 -translate-y-1/2';
      case 'bottom':
      default:
        return 'bottom-2 md:bottom-4';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <Header />

        <main className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm">
            <ImageInput onImageSelect={handleImageSelect} disabled={isLoading} />
            
            {originalImagePreview && (
              <>
                <ImagePreview label="Your Image (Face Reference)" imageUrl={originalImagePreview} />
                <CustomizationPanel
                  customizations={customizations}
                  onCustomizationChange={handleCustomizationChange}
                  disabled={isLoading}
                />
              </>
            )}

            <button
              onClick={handleGenerate}
              disabled={!originalImageFile || isLoading}
              className="w-full font-teko text-2xl tracking-wider bg-orange-600 hover:bg-orange-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-400/50 shadow-lg"
              aria-label="Generate AI Poster"
            >
              {isLoading ? 'Generating...' : '✨ Generate Poster'}
            </button>
          </div>

          <div className="flex flex-col gap-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm min-h-[400px] justify-center">
            {isLoading && <Loader />}
            {error && !isLoading && <ErrorDisplay message={error} />}
            {!isLoading && !error && generatedImage && (
              <>
                <div className="relative">
                  <ImagePreview label="AI Generated Poster" imageUrl={generatedImage} />
                  <div className={`absolute w-full text-center pointer-events-none ${getPositionClasses(textPosition)}`}>
                      <h2 
                          className={`${selectedStyle?.fontClass} text-5xl sm:text-6xl md:text-7xl tracking-wide`}
                          style={getPreviewStyle(selectedStyle)}
                          aria-hidden="true"
                      >
                          Happy Navratri
                      </h2>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <TextStyleSelector
                    selectedStyleId={selectedTextStyleId}
                    onSelectStyle={setSelectedTextStyleId}
                  />
                  <TextPositionSelector
                    selectedPosition={textPosition}
                    onSelectPosition={setTextPosition}
                  />
                </div>
                
                {lastUsedPrompt && (
                  <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700">
                    <p className="text-sm font-semibold text-orange-400 mb-1">Generated with Prompt:</p>
                    <p className="text-xs text-slate-400 italic">"{lastUsedPrompt}"</p>
                  </div>
                )}

                 <button
                    onClick={handleDownload}
                    className="mt-4 text-center font-teko text-xl tracking-wider bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    Download Poster
                  </button>
              </>
            )}
            {!isLoading && !error && !generatedImage && (
              <div className="text-center text-slate-400">
                <p className="text-2xl font-teko tracking-wider">Your masterpiece awaits...</p>
                <p>Upload a photo and describe your vision to begin.</p>
              </div>
            )}
          </div>
        </main>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p> Designed by ❤️ GordXRohit.  Instantly create your divine Navratri visuals.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;