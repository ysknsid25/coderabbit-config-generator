import { setInput, useForm } from '@formisch/react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AnyForm, PathSegments } from '../form/formisch';
import { buildRootSchema } from '../schema/jsonSchemaToValibot';
import type { JSONSchema } from '../schema/types';
import { buildConfig } from './buildConfig';

const schema = buildRootSchema({
  type: 'object',
  properties: {
    early_access: { type: 'boolean', default: false },
    language: { enum: ['en-US', 'ja-JP'], default: 'en-US' },
    reviews: {
      type: 'object',
      default: {},
      properties: {
        profile: { enum: ['quiet', 'chill'], default: 'chill' },
      },
    },
  },
} as JSONSchema);

function setup() {
  const { result } = renderHook(() => useForm({ schema }));
  const form = result.current as AnyForm;
  const set = (path: PathSegments, input: unknown) =>
    act(() =>
      (setInput as unknown as (f: AnyForm, c: unknown) => void)(form, {
        path,
        input,
      }));
  return { form, set };
}

describe('buildConfig', () => {
  it('is empty when nothing differs from the defaults', () => {
    const { form } = setup();
    expect(buildConfig(form, false)).toEqual({});
  });

  it('includes only values changed from their default', () => {
    const { form, set } = setup();
    set(['early_access'], true);
    expect(buildConfig(form, false)).toEqual({ early_access: true });
  });

  it('nests changed values under their parent object', () => {
    const { form, set } = setup();
    set(['reviews', 'profile'], 'quiet');
    expect(buildConfig(form, false)).toEqual({
      reviews: { profile: 'quiet' },
    });
  });

  it('emits the full config with defaults when requested', () => {
    const { form } = setup();
    expect(buildConfig(form, true)).toEqual({
      early_access: false,
      language: 'en-US',
      reviews: { profile: 'chill' },
    });
  });
});
