import axios from 'axios';
import {ServerError, AuthenticationError} from '../../data/Exceptions';
const bankIdAuthenticationURL = 'https://www.avanza.se/_api/authentication/sessions/bankid/';

/**
 * Start authenticating using BankID
 * 
 * @param identificationNumber
 */
function getTransactionId(identificationNumber: string): Promise<string> {
    console.log('Attempting to login using BankID ...');
    return new Promise((resolve, reject) => {
        axios.post(bankIdAuthenticationURL, {identificationNumber: identificationNumber})
            .then((res: any) => {
                if (202 !== res.status) return;
                const responseData = res.data;
                resolve(responseData.transactionId)
            })
            .catch((err: any) => {
                if (undefined !== err.data)
                    reject(new ServerError(err.data.message))
                else
                    reject(new ServerError(err))
            });
    })
}
/**
 * Check on status of authentication with 2s intervals and act accordingly
 * 
 * @param transactionId 
 */
function getLoginPath(transactionId: string): Promise<string> {
    console.log('Authenticate using your BankID...');
    return new Promise((resolve, reject ) => {
        getStatus(transactionId, resolve, reject);
    })
    function getStatus(transactionId: string, resolveFun: Function, rejectFun: Function){
        console.log('...')
        axios.get(bankIdAuthenticationURL.concat(transactionId))
            .then((res: any) => {
                if (200 === res.status && 'OUTSTANDING_TRANSACTION' === res.data.state)
                    setTimeout(getStatus, 2000, transactionId, resolveFun, rejectFun);
                else if (500 === res.status)
                    rejectFun(res.data);
                else if (200 === res.status && 'COMPLETE' === res.data.state) {
                    console.log('BankID verified');
                    resolveFun('https://www.avanza.se'.concat(res.data.logins[0].loginPath));
                }
            })
            .catch((err: any) => {
                rejectFun(new ServerError(err))
            });
    }
}

/**
 * Return tokens from the successful login
 * 
 * @param url 
 */
function getAuthenticationSession(url: string): Promise<string> {
    console.log('Logging in...');
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then((res: any) => {
                resolve(res.data.authenticationSession);
            })
            .catch((err: any) => {
                reject(new AuthenticationError(err))
            });
    })
}

/**
 * Authenticates using an identification number, returns a promise with
 * authentication session, to be used in cookie
 * 
 * @param identificationNumber 
 */
async function authenticate(identificationNumber: string): Promise<string>{
    try {
        const transactionId = await getTransactionId(identificationNumber);
        const loginPath = await getLoginPath(transactionId);
        const authenticationSession = await getAuthenticationSession(loginPath);
        return authenticationSession;
    } catch (err) {
        throw err
    }
}

export { authenticate };