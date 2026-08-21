import httpClient from '../../../api/httpClient'
import type { RegisterPayload } from '../../../types/register'

const formatPayload = (data: RegisterPayload) => {
  let genderNumber = data.gender

  if (typeof data.gender === 'string') {
    if (data.gender === 'male') genderNumber = 1
    else if (data.gender === 'female') genderNumber = 2
    else genderNumber = 3
  }

  let formattedDob = data.dateOfBirth
  if (data.dateOfBirth && !data.dateOfBirth.includes('T')) {
    formattedDob = new Date(data.dateOfBirth).toISOString()
  }

  return {
    ...data,
    gender: genderNumber,
    dateOfBirth: formattedDob,
  }
}

export const sendOtpApi = async (registerData: RegisterPayload) => {
  const payload = formatPayload(registerData)
  const response = await httpClient.post('/api/auth/send-otp', payload)
  return response.data
}

export const resendOtpApi = async (email: string) => {
  const response = await httpClient.post('/api/auth/resend-otp', { email })
  return response.data
}

export const registerApi = async (registerData: RegisterPayload) => {
  const payload = formatPayload(registerData)
  const response = await httpClient.post('/api/auth/register', payload)
  return response.data
}

export const loginApi = async (payload: { email: string; password: string }) => {
  const response = await httpClient.post('/api/auth/login', payload)
  return response.data
}

export const logoutApi = async () => {
  const response = await httpClient.post('/api/auth/logout')
  return response.data
}
