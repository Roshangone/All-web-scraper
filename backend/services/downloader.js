const archiver = require('archiver');
const axios = require('axios');

const DEFAULT_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT_MS || '20000', 10);
const DEFAULT_MAX_ZIP = parseInt(process.env.MAX_ZIP_BYTES || '52428800', 10); // 50MB

async function streamUrlToArchive(archive, url, name) {
  const resp = await axios.get(url, { responseType: 'stream', timeout: DEFAULT_TIMEOUT, headers: { 'User-Agent': 'web-scrapper/1.0' } });
  archive.append(resp.data, { name });
}

async function zipFiles(urls, res, opts = {}) {
  const maxZipBytes = opts.maxZipBytes || DEFAULT_MAX_ZIP;
  const archive = archiver('zip', { zlib: { level: 6 } });
  archive.on('warning', (err) => console.warn(err));
  archive.on('error', (err) => { throw err; });

  archive.pipe(res);

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const filename = url.split('/').pop().split('?')[0] || `file_${i}`;
    try {
      await streamUrlToArchive(archive, url, filename);
      // Can't easily know final zip size until finalize; the client will receive stream; we rely on server max in env to limit how many we'll add.
    } catch (e) {
      console.warn(`Skipping ${url} due to error: ${e.message}`);
    }
  }

  await archive.finalize();
}

module.exports = { zipFiles };
