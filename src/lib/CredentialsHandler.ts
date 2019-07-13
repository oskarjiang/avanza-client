import { writeFile, readFile } from 'fs';
import { generateKeyPair, publicEncrypt, privateDecrypt } from 'crypto';
import { AuthenticationError, KeypairError } from '../data/Exceptions';

/**
 * Manages credentials that are used for authentication
 */
class CredentialsHandler{
    puk: Buffer;
    prk: Buffer;
    constructor(){
        this.puk = Buffer.alloc(255);
        this.prk = Buffer.alloc(255);
    }

    /**
     * Initializes the instance with an keypair
     */
    init(): Promise<void>{
        return new Promise((resolve, reject) => {
            console.log('Checking for existing keypair...');
            this.setKeysIfExists()
                .then(() => {
                    console.log('Keypair found!')
                    resolve();
                })
                .catch(() => {
                    console.log('Existing keypair not found!\nCreating new one...')
                    this.createAndSetKeys()
                        .then(() => {
                            console.log('Created new one!')
                            resolve();
                        })
                        .catch(() => {
                            reject(new KeypairError('Failed to create a new keypair'));
                        })
                });
        })
    }

    /**
     * Sets the keys of this instance if we manage to read the keys
     */
    private setKeysIfExists(): Promise<void> {
        return new Promise((resolve, reject) =>{
            readFile("credentials/puk", (err, puk) => {
                if (err) reject(new KeypairError(err.toString()))
                readFile("credentials/prk", (err, prk) => {
                    if (err) reject(new KeypairError(err.toString()))
                    this.puk = puk;
                    this.prk = prk;
                    resolve();
                })
            })
        })
    }

    /**
     * Creates new keypair and writes to file
     */
    private createAndSetKeys(): Promise<void> {
        return new Promise((resolve, reject) =>{
            generateKeyPair('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'der'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'der',
                    cipher: 'aes-256-cbc',
                    passphrase: 'top secret'
                }
            }, (err, publicKey, privateKey) => {
                if (err) reject(new KeypairError(err.toString()));
                writeFile("credentials/puk", publicKey, (err: any) => {
                    if (err) reject(new KeypairError(err.toString()));
                    writeFile("credentials/prk", privateKey, (err: any) => {
                        if (err) reject(new KeypairError(err.toString()));
                        this.puk = publicKey;
                        this.prk = privateKey;
                        resolve();
                    });
                });
            });
        })
    }
    
    /**
     * Encrypts data and outputs to file
     * 
     * @param key 
     * @param data 
     */
    private writeEncryptedDataToFile(key: Buffer, data: Buffer): void {
        console.log('Writing encrypted authentication session to file...')
        const encryptedData = data;
        writeFile("credentials/authenticationData", encryptedData, (err: any) => {
            if (err) console.log(err);
            console.log("Successfully Written to File.");
        });
    }

    /**
     * Reads data from file and decrypts it
     * 
     * @param key 
     */
    private readEncryptedDataFromFile(key: Buffer): Promise<string> {
        console.log('Reading token from file...');
        return new Promise((resolve, reject) => {
            readFile("credentials/authenticationData", (err, data) => {
                if (null !== err || undefined === data){
                    reject(new AuthenticationError("Token is missing"))
                    return;
                }
                console.log("Got token from file!");
                resolve(data.toString());
            })
        })
    }

    /**
     * Return token
     */
    public getToken(): Promise<string> {
        return this.readEncryptedDataFromFile(this.prk);
    }
    
    /**
     * Sets new token
     * 
     * @param data 
     */
    public setToken(data: Buffer): void{
        this.writeEncryptedDataToFile(this.puk, data);
    }
}

export { CredentialsHandler };