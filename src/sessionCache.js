import NodeCache from "node-cache";
// session cache
// For more robust caching consider products like Redis
// and storage provided by cloud providers
const sessionCache = new NodeCache({ stdTTL: 6*60, checkperiod: 2*60});
module.exports = sessionCache;