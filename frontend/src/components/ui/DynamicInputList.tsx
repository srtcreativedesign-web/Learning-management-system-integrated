import React from 'react';
import { Check, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface OptionItem {
  text: string;
  is_correct: boolean;
}

interface DynamicInputListProps {
  value: OptionItem[];
  onChange: (items: OptionItem[]) => void;
  type?: 'MULTIPLE_CHOICE' | 'MULTIPLE_ANSWER' | 'TRUE_FALSE';
}

export const DynamicInputList: React.FC<DynamicInputListProps> = ({
  value,
  onChange,
  type = 'MULTIPLE_CHOICE',
}) => {
  const markCorrect = (index: number) => {
    const updated = [...value];
    if (type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') {
      updated.forEach((opt, i) => {
        opt.is_correct = i === index;
      });
    } else {
      updated[index].is_correct = !updated[index].is_correct;
    }
    onChange(updated);
  };

  const removeOption = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const addOption = () => {
    onChange([...value, { text: '', is_correct: false }]);
  };

  const updateText = (index: number, text: string) => {
    const updated = [...value];
    updated[index].text = text;
    onChange(updated);
  };

  return (
    <div className="space-y-2.5">
      {value.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200"
        >
          {/* Indicator */}
          <button
            type="button"
            onClick={() => markCorrect(index)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
              item.is_correct
                ? 'border-[#419CC3] bg-[#419CC3] text-white shadow-xs'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
          >
            {item.is_correct && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Input text */}
          <Input
            value={item.text}
            onChange={(e) => updateText(index, e.target.value)}
            placeholder={`Opsi ${String.fromCharCode(65 + index)}`}
            className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-sm h-8 p-0"
          />

          {/* Remove Button */}
          {value.length > 2 && (
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}

      {type !== 'TRUE_FALSE' && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addOption}
          className="text-xs font-bold text-[#419CC3] hover:text-[#3484a6] hover:bg-[#419CC3]/5 p-0 h-auto flex items-center gap-1 mt-2"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Opsi
        </Button>
      )}
    </div>
  );
};
