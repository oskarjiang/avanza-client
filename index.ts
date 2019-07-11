import axios from 'axios';
const authenticate = require('./src/lib/AuthenticationHandler');
const credentialsHandler = new (require('./src/lib/CredentialHandler'));
const accountOverViewURL = 'https://www.avanza.se/_mobile/account/overview'

credentialsHandler.init()
    .then(() => credentialsHandler.getToken()
        .then((token: string) => {
            console.log('Already logged in!');
            main(token);
        })
        .catch(() => 
            authenticate(require('./credentials/credentials').identificationNumber)
                .then((token: string) => {
                    if ('' === token) return
                    console.log('Logged in!');
                    credentialsHandler.setToken(Buffer.from(token, 'utf-8'))
                    main(token)
                })
                .catch((err: any) => console.error(err))))

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

function main(token: string){
}