import axios, { AxiosResponse } from 'axios';
import instance from './axiosInstance'; 
import { toast } from 'react-toastify';

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
      return response.status; 
    }
  } catch (error: any) {
    toast.error('Usuario não encontrado ');
    return (error.response.status); 
  }
}

