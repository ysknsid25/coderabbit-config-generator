import type { FieldMeta } from '../../schema';
import { AnyField, type AnyForm, type PathSegments } from '../formisch';

interface Props {
  form: AnyForm;
  meta: FieldMeta;
  path: PathSegments;
}

export function BooleanField({ form, meta, path }: Props) {
  return (
    <AnyField of={form} path={path}>
      {(field) => {
        const checked = field.input === true;
        return (
          <div className="flex items-start justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium text-stone-800">{meta.title}</p>
              {meta.description && (
                <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
                  {meta.description}
                </p>
              )}
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              aria-label={meta.title}
              onClick={() => field.onChange(!checked)}
              className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors ${
                checked ? 'bg-brand-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                  checked ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </div>
        );
      }}
    </AnyField>
  );
}
