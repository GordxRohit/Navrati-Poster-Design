import React from 'react';

export interface CustomizationState {
  top: string;
  bottom: string;
  shoes: string;
  headwear: string;
  eyewear: string;
  background: string;
  aspectRatio: '16:9' | '1:1' | '9:16';
}

interface CustomizationPanelProps {
  customizations: CustomizationState;
  onCustomizationChange: (field: keyof CustomizationState, value: string) => void;
  disabled: boolean;
}

const CustomInput: React.FC<{
  id: keyof CustomizationState;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}> = ({ id, label, placeholder, value, onChange, disabled }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
      {label}
    </label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full p-2 bg-slate-900/70 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-slate-800 disabled:text-slate-500"
    />
  </div>
);

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customizations,
  onCustomizationChange,
  disabled
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onCustomizationChange(name as keyof CustomizationState, value);
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <h2 className="text-xl font-bold font-teko tracking-wider text-orange-400 mb-1">2. CUSTOMIZE YOUR POSTER</h2>
        <p className="text-sm text-slate-400">Your photo is used for the face. Describe the outfit and scene below.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Aspect Ratio
        </label>
        <div className="flex gap-2 sm:gap-4">
          {(['16:9', '1:1', '9:16'] as const).map((ratio) => {
            const labels: Record<string, string> = {
              '16:9': 'Landscape',
              '1:1': 'Square',
              '9:16': 'Portrait',
            };
            return (
              <button
                key={ratio}
                onClick={() => onCustomizationChange('aspectRatio', ratio)}
                disabled={disabled}
                className={`flex-1 p-2 rounded-lg text-sm transition-colors border-2 ${
                  customizations.aspectRatio === ratio
                    ? 'bg-orange-600 border-orange-500 font-bold'
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                } disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed`}
                aria-pressed={customizations.aspectRatio === ratio}
              >
                {labels[ratio]} ({ratio})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomInput id="top" label="Top / Shirt" placeholder="e.g., a red silk kurta" value={customizations.top} onChange={handleChange} disabled={disabled} />
        <CustomInput id="bottom" label="Bottoms / Pants" placeholder="e.g., white dhoti pants" value={customizations.bottom} onChange={handleChange} disabled={disabled} />
        <CustomInput id="shoes" label="Shoes" placeholder="e.g., traditional jutti" value={customizations.shoes} onChange={handleChange} disabled={disabled} />
        <CustomInput id="headwear" label="Headwear" placeholder="e.g., a festive turban" value={customizations.headwear} onChange={handleChange} disabled={disabled} />
        <CustomInput id="eyewear" label="Eyewear" placeholder="e.g., classic sunglasses" value={customizations.eyewear} onChange={handleChange} disabled={disabled} />
      </div>

      <div>
        <label htmlFor="background" className="block text-sm font-medium text-slate-300 mb-1">
          Background / Scene
        </label>
        <textarea
          id="background"
          name="background"
          value={customizations.background}
          onChange={handleChange}
          disabled={disabled}
          rows={4}
          placeholder="e.g., a temple courtyard at night with glowing diyas and floral decorations..."
          className="w-full p-2 bg-slate-900/70 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-slate-800 disabled:text-slate-500"
          aria-label="Background and scene description for AI poster generation"
        />
      </div>
    </div>
  );
};