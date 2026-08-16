'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');

// Pairing itself happens on the web dashboard (/pair) since it needs a live
// browser round-trip with the phone number. This command just points the
// owner to that page instead of trying to do it inline in chat.
module.exports = async (sock, msg, args, { jid, isOwner }) => {
  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Owner only.' }, { quoted: msg });
  }

  const base = process.env.PUBLIC_URL || `http://localhost:${config.port}`;
  await antiban.sendHuman(sock, jid, {
    text: `🔗 *Pair a new device*\n\nOpen this link and follow the on-screen steps:\n${base}/pair`,
  }, { quoted: msg });
};
