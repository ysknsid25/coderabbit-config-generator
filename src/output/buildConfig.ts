import { getDirtyInput, getInput } from '@formisch/react';
import type { AnyForm } from '../form/formisch';

function clean(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(clean);
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      const cleaned = clean(v);
      if (cleaned !== undefined) out[k] = cleaned;
    }
    return out;
  }
  return value;
}

// `getDirtyInput` returns only the fields that differ from their initial value.
// Since Formisch seeds initials from the schema defaults, the dirty input is
// exactly the minimal, non-default config. `getInput` yields the full config.
export function buildConfig(form: AnyForm, includeDefaults: boolean): unknown {
  const raw = includeDefaults ? getInput(form) : getDirtyInput(form);
  return raw === undefined ? {} : clean(raw);
}
