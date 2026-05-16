# Telegram Notifications

Set these environment variables if you want Telegram notifications:

- `TELEGRAM_TOKEN`
- `TELEGRAM_CHAT_ID`

## Current Shell Session

macOS / Linux:

```sh
export TELEGRAM_TOKEN="your-telegram-bot-token"
export TELEGRAM_CHAT_ID="your-chat-id"
```

Windows PowerShell:

```powershell
$env:TELEGRAM_TOKEN="your-telegram-bot-token"
$env:TELEGRAM_CHAT_ID="your-chat-id"
```

## Persist For Future Sessions

macOS / Linux:

```sh
printf '\nexport TELEGRAM_TOKEN="your-telegram-bot-token"\nexport TELEGRAM_CHAT_ID="your-chat-id"\n' >> ~/.zshrc
source ~/.zshrc
```

Windows PowerShell:

```powershell
[Environment]::SetEnvironmentVariable("TELEGRAM_TOKEN", "your-telegram-bot-token", "User")
[Environment]::SetEnvironmentVariable("TELEGRAM_CHAT_ID", "your-chat-id", "User")
```

## macOS GUI Apps

macOS GUI apps started outside the shell may also need these in the current login session:

```sh
launchctl setenv TELEGRAM_TOKEN "your-telegram-bot-token"
launchctl setenv TELEGRAM_CHAT_ID "your-chat-id"
```