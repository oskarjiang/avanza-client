
const authenticate = require('./src/lib/AuthenticationHandler');
const credentialsHandler = new (require('./src/lib/CredentialsHandler'));
import { EndpointAdapter } from './src/lib/EndpointAdapter'
import { PositionsDalc } from './src/lib/PositionsDalc'

credentialsHandler.init()
    .then(() => credentialsHandler.getToken()
        .then((token: string) => {
            console.log('Already logged in!');
            main(getRequestHeader(token));
        })
        .catch(() => 
            authenticate(require('./credentials/credentials').identificationNumber)
                .then((token: string) => {
                    if ('' === token) return
                    console.log('Logged in!');
                    credentialsHandler.setToken(Buffer.from(token, 'utf-8'))
                    main(getRequestHeader(token))
                })
                .catch((err: any) => console.error(err))))



async function main(requestHeader: object){
    const endpointAdapter = new EndpointAdapter();
    const positionsDalc = PositionsDalc.getInstance();
    
    const positions = await endpointAdapter.getAccountPositions(requestHeader);
    positionsDalc.insert(positions.data.instrumentPositions);
}

function getRequestHeader(token: string): object{
    return {
        Cookie: 'csid='+token+';'
    } 
}