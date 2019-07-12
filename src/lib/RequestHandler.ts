import axios from 'axios';
class RequestHandler{
    private baseUrl = 'https://www.avanza.se';
    private endPoints = {
        overView: '/_mobile/account/overview',
        positions: '/_mobile/account/positions'
    };
    getAccountOverview(requestHeader: object): any{
        return axios.get(this.baseUrl.concat(this.endPoints.overView), {
            headers: requestHeader
        })
    }
    getAccountPositions(requestHeader: object){
        return axios.get(this.baseUrl.concat(this.endPoints.positions), {
            headers: requestHeader
        })
    }
}

export { RequestHandler };