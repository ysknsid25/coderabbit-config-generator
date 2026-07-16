import { describe, expect, it } from 'vitest';
import { parseImportedConfig } from './parseImportedConfig';

describe('parseImportedConfig', () => {
  it('parses valid YAML and fills schema defaults for unset fields', () => {
    const result = parseImportedConfig('language: ja-JP\n');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.value.language).toBe('ja-JP');
    expect(result.value.early_access).toBe(false);
  });

  it('rejects malformed YAML', () => {
    const result = parseImportedConfig('reviews:\n  profile: chill\n bad_indent: true\n');
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].length).toBeGreaterThan(0);
  });

  it('rejects an unknown top-level field', () => {
    const result = parseImportedConfig('nonexistent_field: true\n');
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.some(e => e.includes('nonexistent_field'))).toBe(true);
  });

  it('rejects an unknown nested field under an additionalProperties:false object', () => {
    const result = parseImportedConfig(
      'reviews:\n  tools:\n    htmlhint:\n      enabled: true\n      bogus_option: 1\n',
    );
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.some(e => e.includes('reviews.tools.htmlhint'))).toBe(true);
  });

  it('rejects an invalid enum value', () => {
    const result = parseImportedConfig('reviews:\n  profile: too_loud\n');
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors.some(e => e.includes('reviews.profile'))).toBe(true);
  });

  it('rejects empty input with a friendly message', () => {
    const result = parseImportedConfig('   ');
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errors).toEqual(['Paste a .coderabbit.yaml configuration first.']);
  });

  it('rejects a YAML document whose root is not an object', () => {
    const result = parseImportedConfig('- a\n- b\n');
    expect(result.success).toBe(false);
  });
});
