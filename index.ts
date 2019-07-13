
import { CredentialsHandler } from './src/lib/CredentialsHandler';
import { authenticate } from './src/lib/Adapter/AuthenticationHandler';
import { RequestHandler } from './src/lib/Adapter/RequestHandler'
import { PositionsDalc } from './src/data/PositionsDalc'

async function main(){
    const requestHandler = new RequestHandler();
    const credentialsHandler = new CredentialsHandler();
    const positionsDalc = PositionsDalc.getInstance();
    let requestHeader = {};

    try{
        await credentialsHandler.init();
        const token = await credentialsHandler.getToken();
        const header = getRequestHeader(token);
        await requestHandler.checkHeaderValidity(header);
    } catch (err){
        console.error(err);
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
    }
    
}

function getRequestHeader(token: string): object{
    return {
        Cookie: 'csid='+token+';'
    } 
}

main();