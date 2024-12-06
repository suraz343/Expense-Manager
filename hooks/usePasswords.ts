import { useState, useEffect } from 'react';
import { encrypt, decrypt } from '../utils/crypto';

interface Password {
  id: string;
  site: string;
  username: string;
  password: string;
}

export function usePasswords() {
  const [passwords, setPasswords] = useState<Password[]>([]);

  useEffect(() => {
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
      setPasswords(JSON.parse(storedPasswords).map((pw: Password) => ({
        ...pw,
        password: decrypt(pw.password)
      })));
    }
  }, []);

  const addPassword = (newPassword: Omit<Password, 'id'>) => {
    const passwordWithId = {
      ...newPassword,
      id: Date.now().toString(),
      password: encrypt(newPassword.password)
    };
    const updatedPasswords = [...passwords, passwordWithId];
    setPasswords(updatedPasswords);
    localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
  };

  const deletePassword = (id: string) => {
    const updatedPasswords = passwords.filter(pw => pw.id !== id);
    setPasswords(updatedPasswords);
    localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
  };

  return { passwords, addPassword, deletePassword };
}

