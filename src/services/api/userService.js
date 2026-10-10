import { mockApiResponse } from './httpClient';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '../storage';

export const getProfileApi = async () => {
  return mockApiResponse(() => {
    const user = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) throw new Error('Avtorizatsiyadan oʻtilmagan');
    return user;
  }, 250);
};

export const updateProfileApi = async (updates) => {
  return mockApiResponse(() => {
    const user = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) throw new Error('Avtorizatsiyadan oʻtilmagan');

    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u.id === user.id);

    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    if (idx !== -1) {
      users[idx] = updated;
      setToStorage(STORAGE_KEYS.USERS, users);
    }
    setToStorage(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
  }, 400);
};
