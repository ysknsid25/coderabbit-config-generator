import { describe, expect, it } from 'vitest';
import { buildZip, crc32 } from './zip';

describe('crc32', () => {
  it('matches the well-known checksum of "123456789"', () => {
    const data = new TextEncoder().encode('123456789');
    expect(crc32(data)).toBe(0xCBF43926);
  });
});

// Reads back the single entry's name and content from a ZIP produced by
// buildZip, so tests assert on round-tripped values instead of poking at
// implementation-defined byte offsets.
function readSingleEntry(bytes: Uint8Array): { name: string; content: string } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const nameLength = view.getUint16(26, true);
  const dataLength = view.getUint32(22, true);
  const nameStart = 30;
  const dataStart = nameStart + nameLength;
  const decoder = new TextDecoder();
  return {
    name: decoder.decode(bytes.slice(nameStart, dataStart)),
    content: decoder.decode(bytes.slice(dataStart, dataStart + dataLength)),
  };
}

describe('buildZip', () => {
  it('round-trips the dotfile name and content', () => {
    const content = '# yaml-language-server: $schema=...\nearly_access: true\n';
    const bytes = buildZip('.coderabbit.yaml', content);
    expect(readSingleEntry(bytes)).toEqual({
      name: '.coderabbit.yaml',
      content,
    });
  });

  it('produces a valid local-header and end-of-central-directory signature', () => {
    const bytes = buildZip('.coderabbit.yaml', 'x');
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    expect(view.getUint32(0, true)).toBe(0x04034B50);
    expect(view.getUint32(bytes.length - 22, true)).toBe(0x06054B50);
  });
});
