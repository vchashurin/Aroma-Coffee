export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, phone, guests } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Пожалуйста, заполните все поля' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Конфигурация сервера не настроена' });
  }

  const message = `<b>Нове бронювання столика!</b>\n\n` +
                  `<b>Ім'я:</b> ${name}\n` +
                  `<b>Телефон:</b> ${phone}\n` +
                  `<b>Кількість гостей:</b> ${guests} осіб`;

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: 'html',
        text: message
      })
    });

    if (telegramRes.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Ошибка отправки в Telegram' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}
