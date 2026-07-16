interface Props {
  errors: string[];
}

export function ImportErrorList({ errors }: Props) {
  if (errors.length === 0) return null;

  return (
    <ul className="mb-3 space-y-1 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
      {errors.map(error => <li key={error}>{error}</li>)}
    </ul>
  );
}
