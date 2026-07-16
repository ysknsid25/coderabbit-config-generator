import {
  chipButtonClass,
  chipIdleClass,
  chipSelectedClass,
} from '../form/fields/styles';
import { InfoTip } from '../ui/InfoTip';

export type ImportMode = 'paste' | 'example';

interface Props {
  mode: ImportMode;
  onChange: (mode: ImportMode) => void;
}

const options: { value: ImportMode; label: string }[] = [
  { value: 'paste', label: 'Paste YAML' },
  { value: 'example', label: 'Use an official example' },
];

const AWESOME_CODERABBIT_CONFIGS_URL
  = 'https://github.com/coderabbitai/awesome-coderabbit/tree/main/configs';

export function ExampleSourceToggle({ mode, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            aria-pressed={mode === option.value}
            onClick={() => onChange(option.value)}
            className={`${chipButtonClass} ${
              mode === option.value
                ? chipSelectedClass
                : chipIdleClass
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-stone-500 dark:text-stone-400">
          What's an official example?
        </span>
        <InfoTip label="What's an official example?">
          A collection of configuration templates officially
          maintained by CodeRabbit in
          {' '}
          <a
            href={AWESOME_CODERABBIT_CONFIGS_URL}
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 underline dark:text-brand-400"
          >
            awesome-coderabbit
          </a>
          .
        </InfoTip>
      </div>
    </div>
  );
}
