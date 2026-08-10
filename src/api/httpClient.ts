import axios from 'axios'

import { env } from '../config/env'

const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default httpClient