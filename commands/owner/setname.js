'use strict';
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid, isOwner, config, db }) => {
  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Owner only.' }, { quoted: msg });
  }

  const name = args.join(' ').trim();
  if (!name) {
    return antiban.sendHuman(sock, jid, {
      text: `✏️ *Usage:* ${config.prefix}setname <new name>\n\nCurrent name: *${config.botName}*`,
    }, { quoted: msg });
  }

  // Mutate the shared config object in place so every module that already
  // holds a reference to `config` (menu, dashboard, etc.) sees the update
  // immediately without needing a restart.
  config.botName = name;
  db.setSetting('botName', name);

  await antiban.sendHuman(sock, jid, { text: `✅ Bot name updated to *${name}*` }, { quoted: msg });
};
