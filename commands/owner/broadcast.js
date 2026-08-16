'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');

module.exports = async (sock, msg, args, { jid, isOwner }) => {
  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Owner only.' }, { quoted: msg });
  }

  const text = args.join(' ').trim();
  if (!text) {
    return antiban.sendHuman(sock, jid, {
      text: `📢 *Usage:* ${config.prefix}broadcast <message>`,
    }, { quoted: msg });
  }

  let groups = {};
  try {
    groups = await sock.groupFetchAllParticipating();
  } catch (e) {
    return antiban.sendHuman(sock, jid, { text: `❌ Could not fetch groups: ${e.message}` }, { quoted: msg });
  }

  const jids = Object.keys(groups);
  let sent = 0;
  let failed = 0;

  for (const gJid of jids) {
    try {
      await antiban.sendHuman(sock, gJid, { text: `📢 *Broadcast*\n\n${text}` });
      sent++;
    } catch {
      failed++;
    }
  }

  await antiban.sendHuman(sock, jid, {
    text: `✅ Broadcast sent to ${sent} group(s).${failed ? ` (${failed} failed)` : ''}`,
  }, { quoted: msg });
};
