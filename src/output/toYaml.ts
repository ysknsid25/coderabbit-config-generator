import { stringify } from 'yaml';

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

interface SaveFilePicker {
  showSaveFilePicker?: (options: {
    suggestedName?: string;
    types?: { description?: string; accept: Record<string, string[]> }[];
  }) => Promise<{
    createWritable: () => Promise<{
      write: (data: string) => Promise<void>;
      close: () => Promise<void>;
    }>;
  }>;
}

function anchorDownload(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/yaml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Chromium strips the leading dot from an <a download> filename, turning
// `.coderabbit.yaml` into `coderabbit.yaml`. The File System Access API keeps
// dotfile names, so prefer it and fall back to the anchor elsewhere.
export async function downloadYaml(text: string, filename = '.coderabbit.yaml') {
  const picker = window as unknown as SaveFilePicker;
  if (typeof picker.showSaveFilePicker === 'function') {
    try {
      const handle = await picker.showSaveFilePicker({
        suggestedName: filename,
        types: [
          { description: 'YAML', accept: { 'application/yaml': ['.yaml', '.yml'] } },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(text);
      await writable.close();
      return;
    }
    catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      // Any other failure falls back to the anchor download.
    }
  }
  anchorDownload(text, filename);
}
