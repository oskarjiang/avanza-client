
const credentialsHandler = new (require('./src/lib/CredentialsHandler'));
import { authenticate } from './src/lib/Adapter/AuthenticationHandler';
import { RequestHandler } from './src/lib/Adapter/RequestHandler'
import { PositionsDalc } from './src/data/PositionsDalc'

async function main(){
    const requestHandler = new RequestHandler();
    const positionsDalc = PositionsDalc.getInstance();
    let requestHeader = {};

    try{
        await credentialsHandler.init()
        credentialsHandler.getToken()
            .then((token: string) => {
                console.log('Already logged in!');
                requestHeader = getRequestHeader(token);
            })
            .catch(() => 
                authenticate(require('./credentials/credentials').identificationNumber)
                    .then(async (token: string) => {
                        if ('' === token) return
                        console.log('Logged in!');
                        credentialsHandler.setToken(Buffer.from(token, 'utf-8'))
                        requestHeader = getRequestHeader(token);
                        const positions = await requestHandler.getAccountPositions(requestHeader);
                        positionsDalc.insert(positions.data.instrumentPositions);
                    })
                    .catch((err: any) => console.error(err)));
        requestHandler.checkHeaderValidity(requestHeader)
            .then(() => console.log('Header is valid!'))
            .catch(() => {
                console.log("Token was not valid, please authenticate again!")
                authenticate(require('./credentials/credentials').identificationNumber)
                    .then(async (token: string) => {
                        if ('' === token) return
                        console.log('Logged in!');
                        credentialsHandler.setToken(Buffer.from(token, 'utf-8'))
                        requestHeader = getRequestHeader(token);
                        const positions = await requestHandler.getAccountPositions(requestHeader);
                        positionsDalc.insert(positions.data.instrumentPositions);
                    })
                    .catch((err: any) => console.error(err))
            });
    } catch (err){
        console.error(err);
    }
    
}

function getRequestHeader(token: string): object{
    return {
        Cookie: 'csid='+token+';'
    } 
}

main();