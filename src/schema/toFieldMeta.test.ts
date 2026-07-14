import { describe, expect, it } from 'vitest';
import { buildDefault, toFieldMeta } from './toFieldMeta';
import type { JSONSchema } from './types';

function kindOf(node: JSONSchema, key = 'field', path = [key]) {
  return toFieldMeta(node, key, path).kind;
}

describe('widget kind selection', () => {
  it('maps primitives', () => {
    expect(kindOf({ type: 'boolean' })).toBe('boolean');
    expect(kindOf({ type: 'number' })).toBe('number');
    expect(kindOf({ type: 'integer' })).toBe('number');
    expect(kindOf({ type: 'string' })).toBe('text');
  });

  it('uses a textarea for long or instruction-like strings', () => {
    expect(kindOf({ type: 'string', maxLength: 20000 })).toBe('textarea');
    expect(kindOf({ type: 'string' }, 'path_instructions')).toBe('textarea');
  });

  it('picks the right enum widget by option count', () => {
    expect(kindOf({ enum: ['off', 'warning', 'error'] })).toBe('enum-radio');
    expect(kindOf({ enum: ['a', 'b', 'c', 'd', 'e'] })).toBe('enum-select');
    const langNames = Array.from({ length: 30 }, (_, i) => `Lang ${i}`);
    const langVals = Array.from({ length: 30 }, (_, i) => `l${i}`);
    expect(
      kindOf({ enum: langVals, enumNames: langNames }),
    ).toBe('enum-combobox');
  });

  it('distinguishes array item shape', () => {
    expect(kindOf({ type: 'array', items: { type: 'string' } })).toBe(
      'string-array',
    );
    expect(
      kindOf({
        type: 'array',
        items: { type: 'object', properties: { path: { type: 'string' } } },
      }),
    ).toBe('object-array');
  });

  it('detects records and groups', () => {
    expect(
      kindOf({
        type: 'object',
        additionalProperties: { type: 'array', items: { type: 'string' } },
      }),
    ).toBe('key-value');
    expect(
      kindOf({ type: 'object', properties: { a: { type: 'boolean' } } }),
    ).toBe('group');
  });
});

describe('field metadata', () => {
  it('splits description fragments and extracts a version', () => {
    const meta = toFieldMeta(
      {
        type: 'object',
        description:
          'Enable Ruff | Ruff is a Python linter and code formatter. | v0.15.21',
        properties: { enabled: { type: 'boolean' } },
      },
      'ruff',
      ['reviews', 'tools', 'ruff'],
    );
    expect(meta.description).toBe(
      'Ruff is a Python linter and code formatter.',
    );
    expect(meta.version).toBe('v0.15.21');
  });

  it('keeps the raw key as the title for tool entries', () => {
    const meta = toFieldMeta({ type: 'object' }, 'golangci-lint', [
      'reviews',
      'tools',
      'golangci-lint',
    ]);
    expect(meta.title).toBe('golangci-lint');
  });

  it('prettifies non-tool keys', () => {
    const meta = toFieldMeta({ type: 'boolean' }, 'high_level_summary', [
      'high_level_summary',
    ]);
    expect(meta.title).toBe('High Level Summary');
  });

  it('carries enum labels from enumNames', () => {
    const meta = toFieldMeta(
      { enum: ['de', 'en'], enumNames: ['German', 'English'] },
      'language',
      ['language'],
    );
    expect(meta.options).toEqual([
      { value: 'de', label: 'German' },
      { value: 'en', label: 'English' },
    ]);
  });

  it('provides item metadata and an initial value for object arrays', () => {
    const meta = toFieldMeta(
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', default: '' },
            mode: { enum: ['off', 'warning'], default: 'warning' },
          },
        },
      },
      'custom_checks',
      ['reviews', 'pre_merge_checks', 'custom_checks'],
    );
    expect(meta.item?.children?.map(c => c.key)).toEqual(['name', 'mode']);
    expect(meta.itemInitial).toEqual({ name: '', mode: 'warning' });
  });
});

describe('buildDefault', () => {
  it('clones an explicit default', () => {
    expect(buildDefault({ type: 'array', default: ['a'] })).toEqual(['a']);
  });

  it('derives empties by type', () => {
    expect(buildDefault({ type: 'string' })).toBe('');
    expect(buildDefault({ type: 'boolean' })).toBe(false);
    expect(buildDefault({ type: 'array' })).toEqual([]);
    expect(
      buildDefault({
        type: 'object',
        properties: { a: { type: 'string' }, b: { type: 'boolean' } },
      }),
    ).toEqual({ a: '', b: false });
  });
});
