import { useState, useSyncExternalStore } from 'react';
import type { ChangeSignal } from '../form/useChangeSignal';
import type { AnyForm } from '../form/formisch';
import { buildConfig } from '../output/buildConfig';
import { downloadYaml, toYaml, withSchemaModeline } from '../output/toYaml';
import { InfoTip } from './InfoTip';

interface Props {
  form: AnyForm;
  signal: ChangeSignal;
}

const REDHAT_YAML_EXTENSION
  = 'https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml';

export function YamlPreview({ form, signal }: Props) {
  useSyncExternalStore(signal.subscribe, signal.getSnapshot);
  const [includeDefaults, setIncludeDefaults] = useState(false);
  const [schemaModeline, setSchemaModeline] = useState(true);
  const [copied, setCopied] = useState(false);

  const body = toYaml(buildConfig(form, includeDefaults));
  const output = schemaModeline ? withSchemaModeline(body) : body;
  const isEmpty = output.trim() === '';
  const showPlaceholder = body.trim() === '' && !schemaModeline;

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-2.5">
        <span className="font-mono text-xs font-medium text-stone-500">
          .coderabbit.yaml
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            disabled={isEmpty}
            className="rounded-md border border-stone-300 px-2.5 py-1 text-xs text-stone-700 hover:bg-stone-50 disabled:opacity-50"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={() => downloadYaml(output)}
            disabled={isEmpty}
            title="Downloads coderabbit-config.zip containing .coderabbit.yaml — browsers cannot save dotfiles directly"
            className="rounded-md bg-brand-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            Download
          </button>
        </div>
      </div>

      <div className="space-y-1.5 border-b border-stone-100 px-4 py-2.5 text-xs text-stone-600">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-brand-600"
            checked={includeDefaults}
            onChange={e => setIncludeDefaults(e.target.checked)}
          />
          Include default values
        </label>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-brand-600"
              checked={schemaModeline}
              onChange={e => setSchemaModeline(e.target.checked)}
            />
            Enable YAML Language Support by Red Hat
          </label>
          <InfoTip label="About YAML Language Support">
            Adds a
            {' '}
            <code className="font-mono text-[11px] text-stone-800">
              # yaml-language-server
            </code>
            {' '}
            modeline so the
            {' '}
            <a
              href={REDHAT_YAML_EXTENSION}
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 underline"
            >
              YAML Language Support by Red Hat
            </a>
            {' '}
            extension validates this file against the CodeRabbit schema in your
            editor.
          </InfoTip>
        </div>
      </div>

      <pre className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-stone-800">
        {showPlaceholder
          ? (
              <span className="text-stone-400">
                No overrides yet — change a setting to build your config.
              </span>
            )
          : output}
      </pre>
    </div>
  );
}
