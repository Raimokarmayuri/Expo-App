import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import NoteCard from '../../components/NoteCard';
import { deleteNote, getNotes } from '../../utils/storage';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  const loadNotes = async () => {
    const saved = await getNotes();
    setNotes(saved);
  };

useFocusEffect(
  useCallback(() => {
    loadNotes(); // ⬅️ re-fetch notes every time screen focuses
  }, [])
);

const handleDelete = async (id: string) => {
  await deleteNote(id);               // 🗑️ Delete from storage
  const updated = await getNotes();   // 🔁 Reload updated list
  setNotes(updated);                  // 📦 Update local state
};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📒 My Notes</Text>
     <FlatList
  data={notes}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <NoteCard
      note={item}
      onDelete={() => handleDelete(item.id)} // ✅ No alert, no notification
    />
  )}
/>
      <Button title="Add Note" onPress={() => router.push('/add')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
