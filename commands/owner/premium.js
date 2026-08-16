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
  const cmd = rawText.trim().split(/\s+/)[0]?.slice(1).toLowerCase() || 'addpremium';

  const target = resolveTarget(msg, args);
  if (!target) {
    return antiban.sendHuman(sock, jid, {
      text: `💎 *Usage:* ${config.prefix}${cmd} @user  (or reply to their message, or ${config.prefix}${cmd} <number>)`,
    }, { quoted: msg });
  }

  if (cmd === 'rmpremium') {
    db.removePremium(target);
    await antiban.sendHuman(sock, jid, { text: `✅ Removed premium from @${target.split('@')[0]}`, mentions: [target] }, { quoted: msg });
  } else {
    // Optional trailing arg for custom day count: .addpremium @user 60
    const daysArg = parseInt(args.find(a => /^\d+$/.test(a)), 10);
    const days = Number.isFinite(daysArg) ? daysArg : 30;
    db.addPremium(target, days);
    await antiban.sendHuman(sock, jid, { text: `💎 Granted premium to @${target.split('@')[0]} for ${days} day(s)`, mentions: [target] }, { quoted: msg });
  }
};
