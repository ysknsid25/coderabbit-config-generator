import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { ExampleCategory, ExampleFile } from '../src/examples/types.ts';

const repoRoot = process.cwd();
const configsDir = join(repoRoot, 'vendor/awesome-coderabbit/configs');
const outDir = join(repoRoot, 'src/examples/generated');
const outFile = join(outDir, 'examples.generated.ts');

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function statOrNull(path: string) {
  try {
    return statSync(path);
  }
  catch {
    return null;
  }
}

function collectYamlFiles(dir: string, baseDir: string): ExampleFile[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: ExampleFile[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectYamlFiles(fullPath, baseDir));
      continue;
    }
    if (!/\.ya?ml$/.test(entry.name)) continue;
    const label = relative(baseDir, fullPath);
    files.push({
      key: label,
      label,
      content: readFileSync(fullPath, 'utf-8'),
    });
  }
  return files.sort((a, b) => a.label.localeCompare(b.label));
}

if (!statOrNull(configsDir)?.isDirectory()) {
  fail(
    `vendor/awesome-coderabbit/configs not found.\n`
    + `Run "git submodule update --init --recursive" and try again.`,
  );
}

const categoryDirs = readdirSync(configsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort((a, b) => a.localeCompare(b));

const exampleCategories: ExampleCategory[] = categoryDirs
  .map((categoryName) => {
    const categoryDir = join(configsDir, categoryName);
    return {
      key: categoryName,
      label: categoryName,
      files: collectYamlFiles(categoryDir, categoryDir),
    };
  })
  .filter(category => category.files.length > 0);

mkdirSync(outDir, { recursive: true });
writeFileSync(
  outFile,
  `import type { ExampleCategory } from '../types';\n\n`
  + `export const exampleCategories: ExampleCategory[] = ${JSON.stringify(exampleCategories, null, 2)};\n`,
  'utf-8',
);

const fileCount = exampleCategories.reduce((n, category) => n + category.files.length, 0);
console.log(`Generated ${exampleCategories.length} example categories (${fileCount} files) -> ${relative(repoRoot, outFile)}`);
