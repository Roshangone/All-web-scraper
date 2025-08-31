const axios = require('axios');
const RobotsParser = require('robots-parser');

async function isAllowed(url, userAgent = '*') {
  try {
    const u = new URL(url);
    const robotsUrl = `${u.origin}/robots.txt`;
    const resp = await axios.get(robotsUrl, { timeout: 5000 });
    const parser = RobotsParser(robotsUrl, resp.data);
    return parser.isAllowed(url, userAgent);
  } catch (e) {
    // If anything fails, default to true
    return true;
  }
}

module.exports = { isAllowed };
