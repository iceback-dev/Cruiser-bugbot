'use strict';
const antiban = require('../../utils/antiban');
const config  = require('../../config');

function resolveTarget(msg, args) {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  if (mentioned.length) return mentioned[0];
  const quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;
  if (quotedParticipant) return quotedParticipant;
  const raw = (args[0] || '').replace(/[^0-9]/g, '');
  return raw ? `${raw}@s.whatsapp.net` : null;
}

module.exports = async (sock, msg, args, { jid, isOwner, db }) => {
  if (!isOwner) {
    return antiban.sendHuman(sock, jid, { text: '❌ Owner only.' }, { quoted: msg });
  }

  const rawText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
  const cmd = rawText.trim().split(/\s+/)[0]?.slice(1).toLowerCase() || 'ban';

  const target = resolveTarget(msg, args);
  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `🚫 *Usage:* ${config.prefix}${cmd} @user  (or reply to their message, or ${config.prefix}${cmd} <number>)`,
    }, { quoted: msg });
  }

  if (cmd === 'unban') {
    db.unban(target);
    await antiban.sendHuman(sock, jid, { text: `✅ Unbanned @${target.split('@')[0]}`, mentions: [target] }, { quoted: msg });
  } else {
    db.ban(target);
    await antiban.sendHuman(sock, jid, { text: `🚫 Banned @${target.split('@')[0]}`, mentions: [target] }, { quoted: msg });
  }
};
