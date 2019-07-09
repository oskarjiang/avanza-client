const axios = require('axios');
const Stock = require('./src/models/Stock');

axios.get('https://www.avanza.se/_mobile/market/stock/5361')
.then((res: any) => {
    var data = res.data;
    var stock = createStockWithData(data);
    console.log(stock);
})
.catch((err: any) => {
    console.error(err);
})

function createStockWithData(data: any){
    return new Stock(data.name, data.marketPlace)
}