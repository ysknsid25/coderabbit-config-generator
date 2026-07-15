import { Accordion } from './form/fields/Accordion';
import { FieldRenderer } from './form/FieldRenderer';
import type { AnyForm } from './form/formisch';
import { useChangeSignal } from './form/useChangeSignal';
import { useConfigForm } from './form/useConfigForm';
import { rootMeta } from './schema';
import { GithubIcon, HeartIcon } from './ui/icons';
import { YamlPreview } from './ui/YamlPreview';

const REPO_URL = 'https://github.com/ysknsid25/coderabbit-config-generator';
const SPONSOR_URL = 'https://github.com/sponsors/ysknsid25';

export function App() {
  const form = useConfigForm() as AnyForm;
  const signal = useChangeSignal();
  const scalars = rootMeta.filter(m => m.kind !== 'group');
  const groups = rootMeta.filter(m => m.kind === 'group');

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-4">
          <span className="h-5 w-1.5 rounded-full bg-brand-500" />
          <h1 className="text-lg font-semibold text-stone-900">
            CodeRabbit Config Generator
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="text-stone-500 transition-colors hover:text-stone-900"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href={SPONSOR_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Sponsor on GitHub"
              className="text-stone-400 transition-colors hover:text-pink-500"
            >
              <HeartIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <main
          className="space-y-2"
          onInput={signal.emit}
          onClick={signal.emit}
        >
          <Accordion title="General" defaultOpen>
            <div className="divide-y divide-stone-100">
              {scalars.map(meta => (
                <FieldRenderer
                  key={meta.key}
                  form={form}
                  meta={meta}
                  path={meta.path}
                  depth={1}
                />
              ))}
            </div>
          </Accordion>

          {groups.map(meta => (
            <FieldRenderer
              key={meta.key}
              form={form}
              meta={meta}
              path={meta.path}
              depth={0}
            />
          ))}
        </main>

        <aside>
          <div className="h-[28rem] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
            <YamlPreview form={form} signal={signal} />
          </div>
        </aside>
      </div>

      <footer className="border-t border-stone-200 px-6 py-6 text-center text-xs text-stone-400">
        © 2026
        {' '}
        <a
          href="https://github.com/ysknsid25"
          target="_blank"
          rel="noreferrer"
          className="hover:text-stone-600"
        >
          ysknsid25
        </a>
        . Not affiliated with CodeRabbit.
      </footer>
    </div>
  );
}
