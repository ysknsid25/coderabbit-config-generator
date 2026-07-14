import type { FieldMeta } from '../../schema';
import { AnyField, type AnyForm, type PathSegments } from '../formisch';
import { FieldShell } from './FieldShell';
import { inputClass } from './styles';

interface Props {
  form: AnyForm;
  meta: FieldMeta;
  path: PathSegments;
}

export function TextField({ form, meta, path }: Props) {
  const multiline = meta.kind === 'textarea';
  const id = path.join('.');

  return (
    <AnyField of={form} path={path}>
      {(field) => {
        const value = typeof field.input === 'string' ? field.input : '';
        return (
          <FieldShell
            title={meta.title}
            description={meta.description}
            version={meta.version}
            error={field.errors?.[0] ?? null}
            htmlFor={id}
          >
            {multiline
              ? (
                  <textarea
                    id={id}
                    className={`${inputClass} min-h-20 resize-y`}
                    value={value}
                    maxLength={meta.maxLength}
                    onChange={e => field.onChange(e.target.value)}
                    onBlur={field.props.onBlur}
                  />
                )
              : (
                  <input
                    id={id}
                    className={inputClass}
                    value={value}
                    maxLength={meta.maxLength}
                    onChange={e => field.onChange(e.target.value)}
                    onBlur={field.props.onBlur}
                  />
                )}
            {meta.maxLength && (
              <p className="mt-1 text-right text-[10px] text-stone-400">
                {value.length}
                /
                {meta.maxLength}
              </p>
            )}
          </FieldShell>
        );
      }}
    </AnyField>
  );
}
