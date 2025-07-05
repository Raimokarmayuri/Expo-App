// import AsyncStorage from '@react-native-async-storage/async-storage';

// export async function saveNotes(notes: any[]) {
//   await AsyncStorage.setItem('notes', JSON.stringify(notes));
// }

// export async function getNotes(): Promise<any[]> {
//   const data = await AsyncStorage.getItem('notes');
//   return data ? JSON.parse(data) : [];
// }
// File: utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'NOTES_DATA';

export async function getNotes() {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading notes from storage:', e);
    return [];
  }
}

export async function saveNotes(notes: any[]) {
  try {
    const jsonValue = JSON.stringify(notes);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving notes to storage:', e);
  }
}

export async function deleteNote(id: string) {
  const notes = await getNotes();
  const filtered = notes.filter((note: any) => note.id !== id);
  await saveNotes(filtered);
}
