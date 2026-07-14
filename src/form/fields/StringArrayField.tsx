import type { FieldMeta } from '../../schema';
import {
  AnyField,
  AnyFieldArray,
  arrayInsert,
  arrayRemove,
  type AnyForm,
  type PathSegments,
} from '../formisch';
import { ArrayShell } from './ArrayShell';
import { inputClass, removeButtonClass } from './styles';

interface Props {
  form: AnyForm;
  meta: FieldMeta;
  path: PathSegments;
}

export function StringArrayField({ form, meta, path }: Props) {
  return (
    <AnyFieldArray of={form} path={path}>
      {store => (
        <ArrayShell
          meta={meta}
          count={store.items.length}
          onAdd={() =>
            arrayInsert(form, {
              path,
              initialInput: meta.itemInitial ?? '',
            })}
        >
          {store.items.map((id, index) => (
            <div key={id} className="flex items-center gap-2">
              <AnyField of={form} path={[...path, index]}>
                {field => (
                  <input
                    className={inputClass}
                    value={typeof field.input === 'string' ? field.input : ''}
                    onChange={e => field.onChange(e.target.value)}
                    onBlur={field.props.onBlur}
                  />
                )}
              </AnyField>
              <button
                type="button"
                aria-label="Remove"
                className={removeButtonClass}
                onClick={() => arrayRemove(form, { path, at: index })}
              >
                ×
              </button>
            </div>
          ))}
        </ArrayShell>
      )}
    </AnyFieldArray>
  );
}
