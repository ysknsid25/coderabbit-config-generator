import {
  Field,
  FieldArray,
  insert,
  move,
  remove,
  type FieldElementProps,
  type FormStore,
} from '@formisch/react';
import type { ReactElement } from 'react';

export type PathSegments = (string | number)[];

// The form is driven by a schema built at runtime, so the precise generic
// parameters are unavailable. These loose aliases expose Formisch's runtime
// behaviour without fighting its path-precise types in every widget.
export type AnyForm = FormStore;

export interface LooseField {
  input: unknown;
  errors: [string, ...string[]] | null;
  isTouched: boolean;
  isDirty: boolean;
  onChange: (value: unknown) => void;
  props: FieldElementProps;
}

export interface LooseFieldArray {
  items: string[];
  errors: [string, ...string[]] | null;
}

export const AnyField = Field as unknown as (props: {
  of: AnyForm;
  path: PathSegments;
  children: (field: LooseField) => ReactElement;
}) => ReactElement;

export const AnyFieldArray = FieldArray as unknown as (props: {
  of: AnyForm;
  path: PathSegments;
  children: (store: LooseFieldArray) => ReactElement;
}) => ReactElement;

export const arrayInsert = insert as unknown as (
  form: AnyForm,
  config: { path: PathSegments; at?: number; initialInput?: unknown },
) => void;

export const arrayRemove = remove as unknown as (
  form: AnyForm,
  config: { path: PathSegments; at: number },
) => void;

export const arrayMove = move as unknown as (
  form: AnyForm,
  config: { path: PathSegments; from: number; to: number },
) => void;
