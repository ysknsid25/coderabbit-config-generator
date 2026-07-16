import { parse, YAMLParseError } from 'yaml';
import * as v from 'valibot';
import { strictConfigSchema } from '../schema';

export type ImportResult
  = | { success: true; value: Record<string, unknown> }
    | { success: false; errors: string[] };

export function parseImportedConfig(text: string): ImportResult {
  if (text.trim() === '') {
    return { success: false, errors: ['Paste a .coderabbit.yaml configuration first.'] };
  }

  let parsed: unknown;
  try {
    parsed = parse(text);
  }
  catch (err) {
    if (err instanceof YAMLParseError) {
      return { success: false, errors: [err.message] };
    }
    throw err;
  }

  const result = v.safeParse(strictConfigSchema, parsed ?? {});
  if (result.success) {
    return { success: true, value: result.output };
  }

  const errors = result.issues.map((issue) => {
    const path = v.getDotPath(issue);
    return path ? `${path}: ${issue.message}` : issue.message;
  });
  return { success: false, errors };
}
