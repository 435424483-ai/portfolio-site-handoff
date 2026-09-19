// Generate with `node optimize-images.cjs --generate` (requires sharp).
// Build uses the saved manifest without requiring an image encoder.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = __dirname;
const pages = ['index.html', '陈悦作品集.html', ...['ai-education', 'mazoo', 'museum', 'cichutingchao'].map(id => `work/${id}/index.html`)];
const manifestPath = path.join(root, 'image-previews.json');
const readManifest = () => fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
function apply() {
  const manifest = readManifest();
  for (const page of pages) {
    const file = path.join(root, page);
    const html = fs.readFileSync(file, 'utf8').replace(/<img\b[^>]*>/g, tag => {
      const match = tag.match(/\bsrc="([^"]+)"/);
      if (!match || /^(?:https?:|data:)/.test(match[1])) return tag;
      const source = path.relative(root, path.resolve(path.dirname(file), match[1])).replaceAll('\\', '/');
      const preview = manifest[source];
      if (!preview) return tag;
      const url = path.relative(path.dirname(file), path.join(root, preview.file)).replaceAll('\\', '/');
      let result = tag.replace(`src="${match[1]}"`, `src="${url}"`);
      if (!/\bdecoding=/.test(result)) result = result.replace('<img', '<img decoding="async"');
      return result;
    });
    fs.writeFileSync(file, html);
  }
}
async function generate() {
  const sharp = require('sharp');
  const manifest = readManifest();
  const sources = new Set(Object.keys(manifest));
  for (const page of pages) {
    for (const match of fs.readFileSync(path.join(root, page), 'utf8').matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
      const file = path.relative(root, path.resolve(root, path.dirname(page), match[1])).replaceAll('\\', '/');
      if (file.startsWith('assets/') && !file.startsWith('assets/previews/') && /\.(png|jpe?g)$/i.test(file)) sources.add(file);
    }
  }
  fs.mkdirSync(path.join(root, 'assets/previews'), { recursive: true });
  const queue = [...sources];
  let before = 0, after = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const source = queue.shift();
      const bytes = fs.readFileSync(path.join(root, source));
      const hash = crypto.createHash('sha256').update(bytes).update('preview-1400x2000-q82').digest('hex').slice(0, 20);
      const file = `assets/previews/${hash}.webp`;
      if (!fs.existsSync(path.join(root, file))) await sharp(bytes).rotate().resize({ width: 1400, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toFile(path.join(root, file));
      const size = fs.statSync(path.join(root, file)).size;
      manifest[source] = { file, originalBytes: bytes.length, previewBytes: size };
      before += bytes.length; after += size;
    }
  }));
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  apply();
  console.log(JSON.stringify({ images: sources.size, originalMB: before / 1048576, previewMB: after / 1048576 }));
}
module.exports = { apply };
if (require.main === module) {
  if (process.argv.includes('--generate')) generate().catch(error => { console.error(error); process.exitCode = 1; });
  else apply();
}
