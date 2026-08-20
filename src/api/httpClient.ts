import axios from 'axios'

import { env } from '../config/env'

const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
})

httpClient.interceptors.response.use(function (response) {

    console.log("Check axios: ", response);
    
    return response;
  });

export default httpClient