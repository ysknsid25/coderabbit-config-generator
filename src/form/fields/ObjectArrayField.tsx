import type { FieldMeta } from '../../schema';
import { FieldRenderer } from '../FieldRenderer';
import {
  AnyFieldArray,
  arrayInsert,
  arrayRemove,
  type AnyForm,
  type PathSegments,
} from '../formisch';
import { ArrayShell } from './ArrayShell';
import { removeButtonClass } from './styles';

interface Props {
  form: AnyForm;
  meta: FieldMeta;
  path: PathSegments;
}

export function ObjectArrayField({ form, meta, path }: Props) {
  const children = meta.item?.children ?? [];

  return (
    <AnyFieldArray of={form} path={path}>
      {store => (
        <ArrayShell
          meta={meta}
          count={store.items.length}
          onAdd={() =>
            arrayInsert(form, { path, initialInput: meta.itemInitial })}
        >
          {store.items.map((id, index) => (
            <div
              key={id}
              className="rounded-md border border-stone-200 bg-stone-50/50 p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-stone-400">
                  #
                  {index + 1}
                </span>
                <button
                  type="button"
                  aria-label="Remove"
                  className={removeButtonClass}
                  onClick={() => arrayRemove(form, { path, at: index })}
                >
                  ×
                </button>
              </div>
              <div className="divide-y divide-stone-100">
                {children.map(child => (
                  <FieldRenderer
                    key={child.key}
                    form={form}
                    meta={child}
                    path={[...path, index, child.key]}
                  />
                ))}
              </div>
            </div>
          ))}
        </ArrayShell>
      )}
    </AnyFieldArray>
  );
}
