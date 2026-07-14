import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadYaml } from './toYaml';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('downloadYaml', () => {
  it('saves via the File System Access API with the dotfile name', async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    const close = vi.fn().mockResolvedValue(undefined);
    const createWritable = vi.fn().mockResolvedValue({ write, close });
    const showSaveFilePicker = vi.fn().mockResolvedValue({ createWritable });
    vi.stubGlobal('showSaveFilePicker', showSaveFilePicker);

    await downloadYaml('early_access: true\n');

    expect(showSaveFilePicker).toHaveBeenCalledWith(
      expect.objectContaining({ suggestedName: '.coderabbit.yaml' }),
    );
    expect(write).toHaveBeenCalledWith('early_access: true\n');
    expect(close).toHaveBeenCalled();
  });

  it('falls back to an anchor that keeps the leading dot', async () => {
    const anchors: HTMLAnchorElement[] = [];
    const realCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = realCreate(tag);
      if (tag === 'a') {
        el.click = vi.fn();
        anchors.push(el as HTMLAnchorElement);
      }
      return el;
    });
    vi.stubGlobal('URL', {
      createObjectURL: () => 'blob:x',
      revokeObjectURL: () => {},
    });

    await downloadYaml('early_access: true\n');

    expect(anchors).toHaveLength(1);
    expect(anchors[0].download).toBe('.coderabbit.yaml');
    expect(anchors[0].click).toHaveBeenCalled();
  });
});
