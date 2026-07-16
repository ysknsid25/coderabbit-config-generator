import type { FieldMeta } from '../../schema';
import { AnyField, type AnyForm, type PathSegments } from '../formisch';
import { FieldShell } from './FieldShell';
import {
  chipButtonClass,
  chipDotIdleClass,
  chipDotSelectedClass,
  chipIdleClass,
  chipSelectedClass,
  inputClass,
} from './styles';

interface Props {
  form: AnyForm;
  meta: FieldMeta;
  path: PathSegments;
}

export function EnumField({ form, meta, path }: Props) {
  const options = meta.options ?? [];
  const id = path.join('.');

  return (
    <AnyField of={form} path={path}>
      {(field) => {
        const value = typeof field.input === 'string' ? field.input : '';
        const error = field.errors?.[0] ?? null;
        // Clearing maps to undefined so an optional enum validates as unset.
        const change = (next: string) =>
          field.onChange(next === '' ? undefined : next);

        if (meta.kind === 'enum-radio') {
          return (
            <FieldShell
              title={meta.title}
              description={meta.description}
              error={error}
            >
              <div className="flex flex-wrap gap-2">
                {options.map(o => (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={value === o.value}
                    onClick={() => field.onChange(o.value)}
                    className={`${chipButtonClass} ${
                      value === o.value ? chipSelectedClass : chipIdleClass
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                        value === o.value
                          ? chipDotSelectedClass
                          : chipDotIdleClass
                      }`}
                    />
                    {o.label}
                  </button>
                ))}
              </div>
            </FieldShell>
          );
        }

        return (
          <FieldShell
            title={meta.title}
            description={meta.description}
            error={error}
            htmlFor={id}
          >
            <select
              id={id}
              className={inputClass}
              value={value}
              onChange={e => change(e.target.value)}
              onBlur={field.props.onBlur}
            >
              <option value="">—</option>
              {options.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FieldShell>
        );
      }}
    </AnyField>
  );
}
