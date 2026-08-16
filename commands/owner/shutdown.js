'use strict';
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid, isOwner }) => {
  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Owner only.' }, { quoted: msg });
  }

  await antiban.sendHuman(sock, jid, { text: '🔌 *Shutting down...*' }, { quoted: msg });

  // Give the message a moment to actually flush over the socket before exiting.
  setTimeout(() => process.exit(0), 1500);
};
