const [, , ...args] = process.argv;
const message = args.join(" ");

if (!message) {
  process.stderr.write("Usage: node notify.mjs <message>\n");
  process.exit(1);
}

await notify(message);

async function notify(text) {
  const providers = [sendTelegramMessage];

  for (const send of providers) {
    const sent = await send(text);
    if (sent) return;
  }
}

async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    },
  );

  const result = await response.json();

  if (!result.ok) {
    process.stderr.write(`Telegram error: ${result.description}\n`);
    process.exit(1);
  }

  return true;
}
