// Browsers sanitize download filenames and strip leading dots, so a dotfile
// like `.coderabbit.yaml` cannot be saved directly. A ZIP archive keeps entry
// names untouched, letting users extract the correctly named dotfile. This is
// a minimal single-entry, uncompressed (stored) ZIP writer.

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (const byte of data) {
    crc = CRC_TABLE[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

export function buildZip(entryName: string, content: string): Uint8Array {
  const encoder = new TextEncoder();
  const name = encoder.encode(entryName);
  const data = encoder.encode(content);
  const crc = crc32(data);

  const local = new DataView(new ArrayBuffer(30));
  local.setUint32(0, 0x04034B50, true);
  local.setUint16(4, 20, true); // version needed
  local.setUint16(6, 0x0800, true); // UTF-8 names
  local.setUint16(8, 0, true); // stored (no compression)
  local.setUint32(14, crc, true);
  local.setUint32(18, data.length, true); // compressed size
  local.setUint32(22, data.length, true); // uncompressed size
  local.setUint16(26, name.length, true);

  const central = new DataView(new ArrayBuffer(46));
  central.setUint32(0, 0x02014B50, true);
  central.setUint16(4, 20, true); // version made by
  central.setUint16(6, 20, true); // version needed
  central.setUint16(8, 0x0800, true);
  central.setUint16(10, 0, true);
  central.setUint32(16, crc, true);
  central.setUint32(20, data.length, true);
  central.setUint32(24, data.length, true);
  central.setUint16(28, name.length, true);
  central.setUint32(42, 0, true); // local header offset

  const centralOffset = 30 + name.length + data.length;
  const centralSize = 46 + name.length;

  const eocd = new DataView(new ArrayBuffer(22));
  eocd.setUint32(0, 0x06054B50, true);
  eocd.setUint16(8, 1, true); // entries on this disk
  eocd.setUint16(10, 1, true); // total entries
  eocd.setUint32(12, centralSize, true);
  eocd.setUint32(16, centralOffset, true);

  const out = new Uint8Array(centralOffset + centralSize + 22);
  let offset = 0;
  for (const part of [
    new Uint8Array(local.buffer),
    name,
    data,
    new Uint8Array(central.buffer),
    name,
    new Uint8Array(eocd.buffer),
  ]) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}
