import axios from 'axios'

import { env } from '../config/env'

const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
})

export default httpClient