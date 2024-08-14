import axios, { AxiosResponse } from 'axios';
import instance from './axiosInstance'; 

interface RequestLoginEmployer {
  email: string;
  password: string;
}

export async function loginEmployer(params: RequestLoginEmployer) {
  try {
    const response = await instance.post('/Auth/loginemployer', params);

    const { token, bearerCode } = response.data;

    if (token) {
      localStorage.setItem('userToken', token);
      console.log(response);
      return response.status; 
    }
  } catch (error: any) {
    console.error("Erro ao fazer login:", error);
    return (error); 
  }
}

