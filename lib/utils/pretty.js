module.exports = {
  prettyMs(ms) {
    const h = Math.floor(ms / 3600000) % 24;
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    ms %= 1000;

    return `${h ? (`${h}h `) : ''}${m ? (`${m}m `) : ''}${s ? (`${s}s `) : ''}${ms ? (`${ms}ms`) : ''}`;
  },

  // 1KB  = 1000B
  // 1Kib = 1024B
  prettyBytes(bytes) {
    const UNITS = [
      'B',
      'KB',
      'MB',
    ];
    const formatBytes = bytes.toLocaleString().split(',');
    const { length } = formatBytes;

    if (length === 1) {
      return `${bytes}B`;
    }
    return (+formatBytes[0] + +(formatBytes[1] / 1000)).toFixed(2) + UNITS[length - 1];
  },
};
