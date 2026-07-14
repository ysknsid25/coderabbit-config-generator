import { useForm } from '@formisch/react';
import { render } from '@testing-library/react';
import { FieldRenderer } from '../form/FieldRenderer';
import type { AnyForm } from '../form/formisch';
import { buildRootSchema } from '../schema/jsonSchemaToValibot';
import { toFieldMeta } from '../schema/toFieldMeta';
import type { JSONSchema } from '../schema/types';

// Mounts a single field on a real Formisch form built from a one-property
// schema, so widgets exercise the same store wiring as the app.
export function renderField(node: JSONSchema, key = 'field') {
  const schema = buildRootSchema({
    type: 'object',
    properties: { [key]: node },
  });
  const meta = toFieldMeta(node, key, [key]);

  function Harness() {
    const form = useForm({ schema }) as AnyForm;
    return <FieldRenderer form={form} meta={meta} path={[key]} />;
  }

  return render(<Harness />);
}
