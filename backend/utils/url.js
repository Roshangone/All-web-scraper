const { URL } = require('url');
function normalize(href, base) {
  try { return new URL(href, base).toString(); } catch (e) { return null; }
}
module.exports = { normalize };
