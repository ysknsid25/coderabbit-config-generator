import { stringify } from 'yaml';
import { buildZip } from './zip';

// Modeline understood by the "YAML Language Support by Red Hat" VS Code
// extension; it points the editor at the CodeRabbit schema for validation.
export const SCHEMA_MODELINE
  = '# yaml-language-server: $schema=https://www.coderabbit.ai/integrations/schema.v2.json';

export function withSchemaModeline(body: string): string {
  return `${SCHEMA_MODELINE}\n${body}`;
}

export function toYaml(config: unknown): string {
  if (
    config === undefined
    || (config
      && typeof config === 'object'
      && !Array.isArray(config)
      && Object.keys(config).length === 0)
  ) {
    return '';
  }
  return stringify(config, { indent: 2, lineWidth: 0 });
}

// Browsers strip the leading dot from download filenames (both <a download>
// and the File System Access picker sanitize suggested names), so a dotfile
// cannot be saved directly. Ship a ZIP whose entry keeps the exact name.
export function downloadYaml(
  text: string,
  entryName = '.coderabbit.yaml',
  zipName = 'coderabbit-config.zip',
) {
  const bytes = buildZip(entryName, text);
  const blob = new Blob([bytes as BlobPart], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = zipName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
