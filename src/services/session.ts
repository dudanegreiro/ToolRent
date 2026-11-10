import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'toolrent:user-session';

export type UserSession = {
  usuarioId: string;
  email?: string;
  nome?: string;
};

export async function saveSession(session: UserSession) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<UserSession | null> {
  const rawValue = await AsyncStorage.getItem(SESSION_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as UserSession;
  } catch {
    return null;
  }
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
