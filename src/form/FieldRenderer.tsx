import type { FieldMeta } from '../schema';
import type { AnyForm, PathSegments } from './formisch';
import { BooleanField } from './fields/BooleanField';
import { EnumField } from './fields/EnumField';
import { KeyValueField } from './fields/KeyValueField';
import { NumberField } from './fields/NumberField';
import { ObjectArrayField } from './fields/ObjectArrayField';
import { ObjectGroup } from './fields/ObjectGroup';
import { StringArrayField } from './fields/StringArrayField';
import { TextField } from './fields/TextField';

interface Props {
  form: AnyForm;
  meta: FieldMeta;
  path: PathSegments;
  depth?: number;
}

export function FieldRenderer({ form, meta, path, depth = 0 }: Props) {
  switch (meta.kind) {
    case 'boolean':
      return <BooleanField form={form} meta={meta} path={path} />;
    case 'enum-radio':
    case 'enum-select':
    case 'enum-combobox':
      return <EnumField form={form} meta={meta} path={path} />;
    case 'text':
    case 'textarea':
      return <TextField form={form} meta={meta} path={path} />;
    case 'number':
      return <NumberField form={form} meta={meta} path={path} />;
    case 'string-array':
      return <StringArrayField form={form} meta={meta} path={path} />;
    case 'object-array':
      return <ObjectArrayField form={form} meta={meta} path={path} />;
    case 'key-value':
      return <KeyValueField form={form} meta={meta} path={path} />;
    case 'group':
      return (
        <div className="my-2">
          <ObjectGroup form={form} meta={meta} path={path} depth={depth} />
        </div>
      );
    default:
      return null;
  }
}
