# drpciv_tg_bot
Telegram BOT for DRPCIV. That that notifies you the most recent appointment date.

## Specifications
* npm 8
* node 16

## Settings:
` https://www.drpciv.ro/drpciv-booking-api/getAvailableDaysForSpecificService/{operation}/{judet_code}/ `

#### [Operation's](https://www.drpciv.ro/drpciv-booking-api/operations/)
#### [Judet code's](https://www.drpciv.ro/drpciv-booking-api/counties)

## Setup
- Replace TOKEN from `const token = "XXXXXXXXXXXXXXXXXXXXXX";` with your token from [@BotFather](https://t.me/BotFather)
- npm i
- npm i nodemon --save  (optional)
- node intex.js or nodemon index.js 
