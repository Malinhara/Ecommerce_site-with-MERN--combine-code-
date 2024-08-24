module.exports = function getUserIp(req) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split(',')[0]; // To handle multiple IP addresses in 'x-forwarded-for'
    ip = ip.includes('::') ? 'localhost' : ip; // Handling IPv6 localhost
    return ip;
  };
  