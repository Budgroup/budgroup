# tg-bot.Budget

bot.Budget (Golang) [Open Source + платный(100 RUB) tutorial]

Финансовый бот. Особенность в групповом(семейном) ведении бюджета в  быстром виде. Добавление в семейный слот происходит посредством всё той же реферальной ссылки. Пример сообщения в семейный чат:

Мама: /b 🚕 (Вводит вычетание в историю аргумент как "такси". По умолчанию за такси выставлено 200 RUB. В настройках бота это изменяемо для каждого индивидуально)
Папа: [Replay сообщения выше]/b - (Удаляет выделенные данные)
Сын: /b 230 такси на дачу ("такси" - аргумент, "на дачу" - описание аргумента. Теперь эта сумма значится как по умолчанию для поездки на такси на дачу. В следущий раз можно писать без числа. Так же не имеет значения, написано число в начале или в конце сообщения, с минусом или без)
Сестра: /b +500 нашла (Прибавляет к общей сумме бюджета семьи)

У создателя семьи есть возможность включить или выключить ведение учёта бюджета. Т.е. возможна только история затрат и прибыли, без строгой суммы в остатке. Есть возможность вести такой учет с реплееями не в групповом чате, а внутри диалога бота. Т.е. каждое изменение сразу же высвечивается у всех членов семьи.
