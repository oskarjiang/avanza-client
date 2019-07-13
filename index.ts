
import { CredentialsHandler } from './src/lib/CredentialsHandler';
import { authenticate } from './src/lib/Adapter/AuthenticationHandler';
import { RequestHandler } from './src/lib/Adapter/RequestHandler'
import { PositionsDalc } from './src/data/PositionsDalc'
import { AuthenticationError } from './src/data/Exceptions';
var http = require('http');

http.createServer(() => {
    console.log("*** New request "+new Date(Date.now()).toUTCString())
    main()
}).listen(8080);
async function main(){
    const requestHandler = new RequestHandler();
    const credentialsHandler = new CredentialsHandler();
    const positionsDalc = PositionsDalc.getInstance();
    let requestHeader = {};

    try{
        await credentialsHandler.init();
        const token = await credentialsHandler.getToken();
        requestHeader = getRequestHeader(token);
        await requestHandler.checkHeaderValidity(requestHeader);
    } catch (err){
        if (err instanceof AuthenticationError){
            authenticate(require('./credentials/credentials').identificationNumber)
                .then(async (token: string) => {
                    if ('' === token) return
                    console.log('Logged in!');
                    credentialsHandler.setToken(Buffer.from(token, 'utf-8'))
                    requestHeader = getRequestHeader(token);
                })
                .catch((err: any) => console.error(err))
        } else {
            console.error(err);
        }
    } finally {
        const positions = await requestHandler.getAccountPositions(requestHeader);
        positionsDalc.insert(positions.data.instrumentPositions);
    }
    
}

function getRequestHeader(token: string): object{
    return {
        Cookie: 'csid='+token+';'
    } 
}

main();