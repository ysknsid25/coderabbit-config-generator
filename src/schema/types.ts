// Subset of JSON Schema (draft 2020-12) actually used by schema.v2.json.
export interface JSONSchema {
  type?: string;
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema;
  enum?: (string | number | boolean)[];
  enumNames?: string[];
  default?: unknown;
  description?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  pattern?: string;
  required?: string[];
  additionalProperties?: boolean | JSONSchema;
  propertyNames?: JSONSchema;
  anyOf?: JSONSchema[];
}

export type WidgetKind
  = | 'boolean'
    | 'enum-radio'
    | 'enum-select'
    | 'enum-combobox'
    | 'text'
    | 'textarea'
    | 'number'
    | 'string-array'
    | 'object-array'
    | 'key-value'
    | 'group';

export interface EnumOption {
  value: string;
  label: string;
}

export interface FieldMeta {
  key: string;
  path: (string | number)[];
  title: string;
  description?: string;
  version?: string;
  kind: WidgetKind;
  default?: unknown;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  maxItems?: number;
  pattern?: string;
  integer?: boolean;
  options?: EnumOption[];
  children?: FieldMeta[];
  item?: FieldMeta;
  itemInitial?: unknown;
}
