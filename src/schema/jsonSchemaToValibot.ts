import * as v from 'valibot';
import type { JSONSchema } from './types';

// valibot's `pipe` is typed per-arity, so a variadic call breaks inference.
// Confined to this helper as a deliberate escape hatch.
function pipe(base: v.GenericSchema, actions: unknown[]): v.GenericSchema {
  if (actions.length === 0) return base;
  return (v.pipe as unknown as (...args: unknown[]) => v.GenericSchema)(
    base,
    ...actions,
  );
}

export function toValibot(node: JSONSchema): v.GenericSchema {
  if (node.anyOf && node.anyOf.length > 0) {
    const members = node.anyOf.map(toValibot);
    return v.union(members) as v.GenericSchema;
  }

  if (node.enum && node.enum.length > 0) {
    return v.picklist(node.enum.map(String));
  }

  switch (node.type) {
    case 'boolean':
      return v.boolean();

    case 'integer':
    case 'number': {
      const actions: unknown[] = [];
      if (node.type === 'integer') actions.push(v.integer());
      if (typeof node.minimum === 'number')
        actions.push(v.minValue(node.minimum));
      if (typeof node.maximum === 'number')
        actions.push(v.maxValue(node.maximum));
      return pipe(v.number(), actions);
    }

    case 'string': {
      const actions: unknown[] = [];
      if (typeof node.minLength === 'number')
        actions.push(v.minLength(node.minLength));
      if (typeof node.maxLength === 'number')
        actions.push(v.maxLength(node.maxLength));
      if (node.pattern) actions.push(v.regex(new RegExp(node.pattern)));
      return pipe(v.string(), actions);
    }

    case 'array': {
      const item = node.items ? toValibot(node.items) : v.unknown();
      const actions: unknown[] = [];
      if (typeof node.minItems === 'number')
        actions.push(v.minLength(node.minItems));
      if (typeof node.maxItems === 'number')
        actions.push(v.maxLength(node.maxItems));
      return pipe(v.array(item), actions);
    }

    case 'object':
    default: {
      // Free-form record (e.g. reviews.mutually_exclusive_groups). Formisch
      // cannot traverse a `record` schema, so hold it as an opaque leaf and
      // let KeyValueField own its shape.
      if (
        node.additionalProperties
        && typeof node.additionalProperties === 'object'
      ) {
        return v.any();
      }
      const entries: Record<string, v.GenericSchema> = {};
      for (const [key, child] of Object.entries(node.properties ?? {})) {
        entries[key] = toEntry(child);
      }
      return v.object(entries as v.ObjectEntries);
    }
  }
}

// Every property is optional so the generated config stays a partial.
// A schema default seeds Formisch's initial value for that field.
export function toEntry(node: JSONSchema): v.GenericSchema {
  const inner = toValibot(node);
  if (node.default !== undefined) {
    return v.optional(inner, node.default as never) as v.GenericSchema;
  }
  return v.optional(inner) as v.GenericSchema;
}

export function buildRootSchema(
  root: JSONSchema,
): v.GenericSchema<Record<string, unknown>> {
  const entries: Record<string, v.GenericSchema> = {};
  for (const [key, child] of Object.entries(root.properties ?? {})) {
    entries[key] = toEntry(child);
  }
  return v.object(entries as v.ObjectEntries) as v.GenericSchema<
    Record<string, unknown>
  >;
}
