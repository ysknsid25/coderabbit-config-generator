import * as v from 'valibot';
import { describe, expect, it } from 'vitest';
import { buildRootSchema, toEntry, toValibot } from './jsonSchemaToValibot';
import type { JSONSchema } from './types';
import rawSchema from './schema.v2.json';

describe('toValibot', () => {
  it('accepts an enum value and rejects others', () => {
    const s = toValibot({ enum: ['quiet', 'chill', 'assertive'] });
    expect(v.safeParse(s, 'chill').success).toBe(true);
    expect(v.safeParse(s, 'loud').success).toBe(false);
  });

  it('enforces integer bounds', () => {
    const s = toValibot({ type: 'integer', minimum: 0, maximum: 30 });
    expect(v.safeParse(s, 5).success).toBe(true);
    expect(v.safeParse(s, 5.5).success).toBe(false);
    expect(v.safeParse(s, 31).success).toBe(false);
    expect(v.safeParse(s, -1).success).toBe(false);
  });

  it('enforces string maxLength', () => {
    const s = toValibot({ type: 'string', maxLength: 3 });
    expect(v.safeParse(s, 'abc').success).toBe(true);
    expect(v.safeParse(s, 'abcd').success).toBe(false);
  });

  it('enforces a string pattern', () => {
    const s = toValibot({ type: 'string', pattern: '^[a-z]+/[a-z]+$' });
    expect(v.safeParse(s, 'owner/repo').success).toBe(true);
    expect(v.safeParse(s, 'nope').success).toBe(false);
  });

  it('holds a free-form record as an opaque leaf', () => {
    // Formisch cannot traverse a `record` schema, so additionalProperties
    // collapses to a permissive leaf whose shape the widget owns.
    const node: JSONSchema = {
      type: 'object',
      propertyNames: { type: 'string', minLength: 1 },
      additionalProperties: { type: 'array', items: { type: 'string' } },
    };
    const s = toValibot(node);
    expect(v.safeParse(s, { risk: ['high', 'low'] }).success).toBe(true);
    expect(s.type).toBe('any');
  });

  it('builds a union from anyOf', () => {
    const node: JSONSchema = {
      anyOf: [
        { type: 'string' },
        { type: 'object', properties: { files: { type: 'string' } } },
      ],
    };
    const s = toValibot(node);
    expect(v.safeParse(s, '**/*.ts').success).toBe(true);
    expect(v.safeParse(s, { files: '**/*.ts' }).success).toBe(true);
    expect(v.safeParse(s, 42).success).toBe(false);
  });

  it('caps an array by maxItems', () => {
    const s = toValibot({
      type: 'array',
      items: { type: 'string' },
      maxItems: 2,
    });
    expect(v.safeParse(s, ['a', 'b']).success).toBe(true);
    expect(v.safeParse(s, ['a', 'b', 'c']).success).toBe(false);
  });
});

describe('toEntry', () => {
  it('supplies the schema default when input is undefined', () => {
    const s = toEntry({ type: 'string', default: 'en-US' });
    expect(v.parse(s, undefined)).toBe('en-US');
  });

  it('stays optional without a default', () => {
    const s = toEntry({ type: 'string' });
    expect(v.parse(s, undefined)).toBeUndefined();
  });
});

describe('buildRootSchema', () => {
  it('parses an empty object into top-level defaults', () => {
    const schema = buildRootSchema(rawSchema as JSONSchema);
    const out = v.parse(schema, {}) as Record<string, unknown>;
    expect(out.language).toBe('en-US');
    expect(out.early_access).toBe(false);
    expect(out.enable_free_tier).toBe(true);
  });

  it('rejects an out-of-enum language', () => {
    const schema = buildRootSchema(rawSchema as JSONSchema);
    expect(v.safeParse(schema, { language: 'xx-YY' }).success).toBe(false);
  });
});

describe('strict mode', () => {
  it('rejects an unknown key when additionalProperties is false and strict is true', () => {
    const node: JSONSchema = {
      type: 'object',
      properties: { name: { type: 'string' } },
      additionalProperties: false,
    };
    expect(v.safeParse(toValibot(node), { name: 'a', extra: 1 }).success).toBe(true);
    expect(v.safeParse(toValibot(node, true), { name: 'a', extra: 1 }).success).toBe(false);
  });

  it('still allows unknown keys in strict mode when additionalProperties is not false', () => {
    const node: JSONSchema = {
      type: 'object',
      properties: { name: { type: 'string' } },
    };
    expect(v.safeParse(toValibot(node, true), { name: 'a', extra: 1 }).success).toBe(true);
  });

  it('rejects a bogus top-level key in the real schema', () => {
    const lenient = buildRootSchema(rawSchema as JSONSchema);
    const strict = buildRootSchema(rawSchema as JSONSchema, true);
    expect(v.safeParse(lenient, { not_a_real_field: true }).success).toBe(true);
    expect(v.safeParse(strict, { not_a_real_field: true }).success).toBe(false);
  });
});
