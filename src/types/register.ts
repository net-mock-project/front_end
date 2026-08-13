export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;  
  dateOfBirth: string;
  gender: number;
  password: string;
  confirmPassword: string;
  address: string;
  isAgreeTerms: boolean; 
  otpCode?: string;
}