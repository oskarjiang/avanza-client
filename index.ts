import axios from 'axios';
const authenticate = require('./src/AuthenticationHandler');
const accountOverViewURL = 'https://www.avanza.se/_mobile/account/overview'

authenticate(require('./credentials').identificationNumber)
    .then((csid: string) => {
        if ('' === csid) return
        console.log('Logged in!');
    })
    .catch((err: any) => console.error(err));

function getAccountOverview(csid: string): void{
    axios.get(accountOverViewURL, {
        headers: {
            Cookie: 'csid='+csid+';'
        }
    })
        .then((res: any) => {
            console.log(res.data);
        })
        .catch((err: any) => {
            console.error(err)
        });
}