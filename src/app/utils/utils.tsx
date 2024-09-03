import { toast } from 'react-toastify';

const GetLocalStorage = (localName: string): string | null => {
  const savedData = localStorage.getItem(localName);
  
  if (!savedData) {
    toast.error('Usuário não encontrado');
    return null;
  } else {
    return savedData;
  }
};

export default GetLocalStorage;
