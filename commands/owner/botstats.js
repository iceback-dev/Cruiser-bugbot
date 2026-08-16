'use strict';
const antiban = require('../../utils/antiban');

module.exports = async (sock, msg, args, { jid, isOwner, config, db }) => {
  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Owner only.' }, { quoted: msg });
  }

  // Required lazily to avoid a require cycle at module-load time
  // (sessionManager -> handler -> this file, if required eagerly).
  const sessionManager = require('../../sessionManager');

  const stats     = db.getStats();
  const bots      = sessionManager.getAllBots();
  const connected = bots.filter(b => b.connected).length;
  const uptimeSec = Math.floor((Date.now() - (stats.startTime || Date.now())) / 1000);
  const h = Math.floor(uptimeSec / 3600);
  const m = Math.floor((uptimeSec % 3600) / 60);

  const text = [
    `📊 *${config.botName} — Stats*`,
    '',
    `👥 Bots: ${bots.length} (${connected} online)`,
    `⚡ Commands run: ${stats.totalCommands || 0}`,
    `🐛 Bugs triggered: ${stats.totalBugs || 0}`,
    `⏱️ Uptime: ${h}h ${m}m`,
  ].join('\n');

  await antiban.sendHuman(sock, jid, { text }, { quoted: msg });
};
