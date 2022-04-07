const axios = require("axios");
const api = require("imersao-bot-cripto-api")

const credentials = {
    apiKey: process.env.apiKey,
    secretKey: process.env.apiSecret,
    test: true

}

async function process() {
    const symbol = "BTCBUSD";
 
  const response = await axios.get(
    "https://api.binance.com/api/v3/klines?symbol=BTCBUSD&interval=1m"
  );
  const closes = response.data.map(candle => parseFloat(candle[4]));
  const rsi = calcRSI(closes);
  console.log(rsi);


  if (rsi > 70 && bought) {
    console.log("sobrecomprado!");
    const sellresult = await api.sell(credentials,symbol, 0.001);
    bought = false;
    console.log(sellresult)
  } else if (rsi < 30 && !bought) {
    console.log("sobrevendido!");
    const buyresult = await api.buy(credentials,symbol, 0.001);
    console.log(buyresult)
    bought = true;
  }
}

let bought = true;

function calcRSI(closes){
    let gains = 0;
    let losses = 0;

    for(let i = closes.length - 14; i < closes.length; i++){
        const diff = closes[i] - closes[i - 1];
        if(diff > 0 && bought){
            gains+=diff;
            bought = false;
        }else if ( rsi < 30 && !bought){
            losses-=diff;
            bought = true;
        }
    }


    const strength = gains /losses;
    return 100 - (100 / (1 + strength));

}

setInterval(process, 40000);
