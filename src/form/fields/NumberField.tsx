import type { FieldMeta } from '../../schema';
import { AnyField, type AnyForm, type PathSegments } from '../formisch';
import { FieldShell } from './FieldShell';
import { inputClass } from './styles';

interface Props {
  form: AnyForm;
  meta: FieldMeta;
  path: PathSegments;
}

export function NumberField({ form, meta, path }: Props) {
  const id = path.join('.');

  return (
    <AnyField of={form} path={path}>
      {(field) => {
        const value = typeof field.input === 'number' ? String(field.input) : '';
        return (
          <FieldShell
            title={meta.title}
            description={meta.description}
            error={field.errors?.[0] ?? null}
            htmlFor={id}
          >
            <input
              id={id}
              type="number"
              className={inputClass}
              value={value}
              min={meta.minimum}
              max={meta.maximum}
              step={meta.integer ? 1 : 'any'}
              onChange={e =>
                field.onChange(
                  e.target.value === '' ? undefined : Number(e.target.value),
                )}
              onBlur={field.props.onBlur}
            />
          </FieldShell>
        );
      }}
    </AnyField>
  );
}
