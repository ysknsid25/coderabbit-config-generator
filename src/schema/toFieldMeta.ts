import type { EnumOption, FieldMeta, JSONSchema, WidgetKind } from './types';

function prettify(key: string): string {
  return key
    .split(/[_-]/)
    .map(w => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

// Descriptions pack several fragments into one string separated by " | "
// (e.g. "Title | sentence | v1.2.3"). Split out the version and keep the most
// informative fragment as the description.
function pickDescription(desc?: string): { text?: string; version?: string } {
  if (!desc) return {};
  const parts = desc
    .split('|')
    .map(s => s.trim())
    .filter(Boolean);
  let version: string | undefined;
  const rest: string[] = [];
  for (const p of parts) {
    if (/^v\d[\w.-]*$/.test(p)) version = p;
    else rest.push(p);
  }
  if (rest.length === 0) return { version };
  const text = rest.reduce((a, b) => (b.length > a.length ? b : a));
  return { text, version };
}

function isLongText(node: JSONSchema, key: string): boolean {
  if (typeof node.maxLength === 'number' && node.maxLength > 250) return true;
  return /instructions|prompt|requirements/i.test(key);
}

// Prefer the object member of an anyOf so array items render as structured
// groups rather than bare strings (knowledge_base code_guidelines filePatterns).
function resolveItemNode(items?: JSONSchema): JSONSchema {
  if (!items) return { type: 'string' };
  if (items.anyOf && items.anyOf.length > 0) {
    return (
      items.anyOf.find(m => m.type === 'object' || m.properties)
      ?? items.anyOf[0]
    );
  }
  return items;
}

function widgetKind(node: JSONSchema, key: string): WidgetKind {
  if (node.enum && node.enum.length > 0) {
    const n = node.enum.length;
    if (node.enumNames && n > 20) return 'enum-combobox';
    if (n <= 4) return 'enum-radio';
    return 'enum-select';
  }
  switch (node.type) {
    case 'boolean':
      return 'boolean';
    case 'integer':
    case 'number':
      return 'number';
    case 'string':
      return isLongText(node, key) ? 'textarea' : 'text';
    case 'array': {
      const item = resolveItemNode(node.items);
      return item.type === 'object' || item.properties
        ? 'object-array'
        : 'string-array';
    }
    case 'object':
    default:
      if (
        node.additionalProperties
        && typeof node.additionalProperties === 'object'
      )
        return 'key-value';
      return 'group';
  }
}

function enumOptions(node: JSONSchema): EnumOption[] {
  return (node.enum ?? []).map((val, i) => ({
    value: String(val),
    label: node.enumNames?.[i] ?? String(val),
  }));
}

export function buildDefault(node: JSONSchema): unknown {
  if (node.default !== undefined) return structuredClone(node.default);
  if (node.enum && node.enum.length > 0) return undefined;
  switch (node.type) {
    case 'string':
      return '';
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'object': {
      const obj: Record<string, unknown> = {};
      for (const [k, child] of Object.entries(node.properties ?? {})) {
        obj[k] = buildDefault(child);
      }
      return obj;
    }
    default:
      return undefined;
  }
}

// `path` is a build-time stable id only. Actual field paths are rebuilt by the
// renderer from the parent path plus key/index, since array-item templates
// carry a placeholder index and cannot know their real position here.
export function toFieldMeta(
  node: JSONSchema,
  key: string,
  path: (string | number)[],
): FieldMeta {
  const kind = widgetKind(node, key);
  const { text, version } = pickDescription(node.description);
  const isToolEntry = path[1] === 'tools' && path.length === 3;

  const meta: FieldMeta = {
    key,
    path,
    title: isToolEntry ? key : prettify(key),
    description: text,
    version,
    kind,
    default: node.default,
    minLength: node.minLength,
    maxLength: node.maxLength,
    minimum: node.minimum,
    maximum: node.maximum,
    maxItems: node.maxItems,
    pattern: node.pattern,
    integer: node.type === 'integer' || undefined,
  };

  if (
    kind === 'enum-radio'
    || kind === 'enum-select'
    || kind === 'enum-combobox'
  ) {
    meta.options = enumOptions(node);
  }

  if (kind === 'group') {
    meta.children = Object.entries(node.properties ?? {}).map(([k, child]) =>
      toFieldMeta(child, k, [...path, k]),
    );
  }

  if (kind === 'object-array') {
    const itemNode = resolveItemNode(node.items);
    meta.item = toFieldMeta(itemNode, '', [...path, 0]);
    meta.itemInitial = buildDefault(itemNode);
  }

  if (kind === 'string-array') {
    const itemNode = node.items ?? { type: 'string' };
    meta.item = toFieldMeta(itemNode, '', [...path, 0]);
    const init = buildDefault(itemNode);
    meta.itemInitial = init === undefined ? '' : init;
  }

  return meta;
}

export function buildRootMeta(root: JSONSchema): FieldMeta[] {
  return Object.entries(root.properties ?? {}).map(([k, child]) =>
    toFieldMeta(child, k, [k]),
  );
}
