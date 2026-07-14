import { describe, expect, it } from 'vitest';
import { SCHEMA_MODELINE, toYaml, withSchemaModeline } from './toYaml';

describe('toYaml', () => {
  it('serializes a nested object with two-space indent', () => {
    expect(toYaml({ reviews: { profile: 'assertive' } })).toBe(
      'reviews:\n  profile: assertive\n',
    );
  });

  it('serializes arrays', () => {
    expect(toYaml({ base_branches: ['main', 'dev'] })).toBe(
      'base_branches:\n  - main\n  - dev\n',
    );
  });

  it('returns an empty string for an empty object', () => {
    expect(toYaml({})).toBe('');
  });

  it('returns an empty string for undefined', () => {
    expect(toYaml(undefined)).toBe('');
  });
});

describe('withSchemaModeline', () => {
  it('prepends the Red Hat yaml-language-server modeline', () => {
    const body = 'reviews:\n  profile: assertive\n';
    expect(withSchemaModeline(body)).toBe(`${SCHEMA_MODELINE}\n${body}`);
  });

  it('points at the CodeRabbit schema url', () => {
    expect(SCHEMA_MODELINE).toContain(
      '$schema=https://www.coderabbit.ai/integrations/schema.v2.json',
    );
  });
});
