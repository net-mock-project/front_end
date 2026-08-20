import httpClient from '../../../api/httpClient'
const RELIEF_REQUEST_ENDPOINT= '/api/relief-requests';


export const getAllReliefRequests= async () =>{
    const response= await httpClient.get(`${RELIEF_REQUEST_ENDPOINT}/?mine=false`);
    return response.data.result
}