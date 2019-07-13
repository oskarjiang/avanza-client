class ServerError{
    constructor(public info: string){}
}

class AuthenticationError{
    constructor(public info: string){}
}

class KeypairError{
    constructor(public info: string){}
}

export { AuthenticationError, ServerError, KeypairError };