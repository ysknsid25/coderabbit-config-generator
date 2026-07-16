import rawSchema from './schema.v2.json';
import type { FieldMeta, JSONSchema } from './types';
import { buildRootSchema } from './jsonSchemaToValibot';
import { buildRootMeta } from './toFieldMeta';

const root = rawSchema as JSONSchema;

export const configSchema = buildRootSchema(root);

export const strictConfigSchema = buildRootSchema(root, true);

export const rootMeta: FieldMeta[] = buildRootMeta(root);

export const rootMetaByKey: Record<string, FieldMeta> = Object.fromEntries(
  rootMeta.map(m => [m.key, m]),
);

export type { FieldMeta } from './types';
