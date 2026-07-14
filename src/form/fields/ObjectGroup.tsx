import type { FieldMeta } from '../../schema';
import { FieldRenderer } from '../FieldRenderer';
import type { AnyForm, PathSegments } from '../formisch';
import { Accordion } from './Accordion';

interface Props {
  form: AnyForm;
  meta: FieldMeta;
  path: PathSegments;
  depth?: number;
  defaultOpen?: boolean;
}

export function ObjectGroup({
  form,
  meta,
  path,
  depth = 0,
  defaultOpen = false,
}: Props) {
  const children = meta.children ?? [];

  return (
    <Accordion
      title={meta.title}
      description={meta.description}
      depth={depth}
      defaultOpen={defaultOpen}
    >
      <div className="divide-y divide-stone-100">
        {children.map(child => (
          <FieldRenderer
            key={child.key}
            form={form}
            meta={child}
            path={[...path, child.key]}
            depth={depth + 1}
          />
        ))}
      </div>
    </Accordion>
  );
}
