import { execSync } from "node:child_process";

const [, , ...args] = process.argv;
const message = args.join(" ");

if (!message) {
  process.stderr.write("Usage: node notify.mjs <message>\n");
  process.exit(1);
}

await notify(message);

async function notify(text) {
  const providers = [sendOsNotification, sendTelegramMessage];

  for (const send of providers) {
    await send(text);
  }
}

function sendOsNotification(text) {
  if (process.platform === "darwin") {
    return sendMacNotification(text);
  }
  if (process.platform === "win32") {
    return sendWindowsNotification(text);
  }
  if (isWsl()) {
    return sendWslNotification(text);
  }
  return false;
}

function isWsl() {
  if (process.platform !== "linux") return false;
  try {
    execSync("test -f /proc/sys/fs/binfmt_misc/WSLInterop", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function sendMacNotification(text) {
  const escaped = text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  try {
    execSync(`osascript -e 'display notification "${escaped}" with title "td-agentcraft-kit" sound name "default"'`, {
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

function buildWindowsToastCommand(text) {
  const escaped = text.replace(/'/g, "''");
  return `
    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null;
    $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText01);
    $template.GetElementsByTagName('text')[0].AppendChild($template.CreateTextNode('${escaped}')) | Out-Null;
    $audio = $template.CreateElement('audio');
    $audio.SetAttribute('src', 'ms-winsoundevent:Notification.Default');
    $template.DocumentElement.AppendChild($audio) | Out-Null;
    $toast = [Windows.UI.Notifications.ToastNotification]::new($template);
    [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('td-agentcraft-kit').Show($toast);
  `.replace(/\n\s*/g, " ").trim();
}

function sendWindowsNotification(text) {
  const psCommand = buildWindowsToastCommand(text);
  try {
    execSync(`powershell -Command "${psCommand.replace(/"/g, '\\"')}"`, {
      stdio: "ignore",
      timeout: 5000,
    });
    return true;
  } catch {
    return false;
  }
}

function sendWslNotification(text) {
  const psCommand = buildWindowsToastCommand(text);
  try {
    execSync(`powershell.exe -Command "${psCommand.replace(/"/g, '\\"')}"`, {
      stdio: "ignore",
      timeout: 5000,
    });
    return true;
  } catch {
    return false;
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
