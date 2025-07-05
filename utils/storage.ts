import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveNotes(notes: any[]) {
  await AsyncStorage.setItem('notes', JSON.stringify(notes));
}

export async function getNotes(): Promise<any[]> {
  const data = await AsyncStorage.getItem('notes');
  return data ? JSON.parse(data) : [];
}
