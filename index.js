//write the simplest telegram bot
const TelegramBot = require("node-telegram-bot-api");

// replace the value below with the Telegram token you receive from @BotFather
const token = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const axios = require("axios");
const bot = new TelegramBot(token, { polling: true });

const BASE_URL =
  "https://www.drpciv.ro/drpciv-booking-api/getAvailableDaysForSpecificService/1/27/";

const months = [
  "",
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie",
];

let timer = null;
let ckecks = 0;
let current_date = "";

//------------------BOT COMMANDS------------------
  bot.onText(/\/start/, async (message) => {
    //STOP
    clearInterval(timer);
    timer = null;
    ckecks = 0;
    current_date = "";
    // then start
    console.log(message.text);
    bot.sendMessage(
      message.chat.id,
      "Hey, o sa va anuntam despre programarile disponibile la DRPCIV"
    );
    current_date = await getDateDRPCIV(message);
    bot.sendMessage(message.chat.id, `Data curenta este: ${current_date}`);
    appointmentChecker(message);
    console.log(message.text);
  });

  bot.onText(/\/stop/, (message) => {
    clearInterval(timer);
    timer = null;
    ckecks = 0;
    current_date = "";
    bot.sendMessage(message.chat.id, "Botul a fost oprit");
    console.log(message.text);
  });

  bot.onText(/\/help/, async (message) => {
    console.log(message.text);
    bot.sendMessage(
      message.chat.id,
      "Comenzile disponibile sunt: /start, /stop, /help, /date"
    );
    if (current_date != "") {
      appointmentChecker(message);
      console.log("subscribtion active...");
    }
  });

  bot.onText(/\/date/, async (message) => {
    let data = await getDateDRPCIV();
    bot.sendMessage(message.chat.id, "*" + data + "*", {
      parse_mode: "Markdown",
    });
    if (current_date != "") {
      appointmentChecker(message);
      console.log("subscribtion active...");
    }
  });

  bot.on("message", async (msg) => {
    console.log(msg);
    if (msg.text[0] != "/") {
      const chatId = msg.chat.id;
      bot.sendMessage(
        chatId,
        "Se pare ca acest mesaj nu este o comanda valida. Incearca /help."
      );
    }
    if (current_date != "") {
      appointmentChecker(msg);
      console.log("subscribtion active...");
    }
  });

//--------------------FUNCTIONS----------------------

function appointmentChecker(message) {
  console.log("checking for appointments...");
  timer = setInterval(async () => {
    let date = await getDateDRPCIV(message);
    if (date !== current_date) {
      console.log("new date found");
      current_date = date;
      bot.sendMessage(
        message.chat.id,
        `${date} este noua data disponibila la DRPCIV `
      );
    }
  }, 60 * 1000 * 5); // 5 minutes
}

async function getDateDRPCIV() {
  let first_date = "";
  return new Promise((resolve) => {
    axios
      .get(BASE_URL)
      .then((data) => {
        first_date = data.data[0].split(" ")[0];
        first_date = first_date.split("-");
        first_date =
          first_date[2] +
          " " +
          months[parseInt(first_date[1])] +
          " " +
          first_date[0];
        setTimeout(() => {
          resolve(String(first_date));
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
