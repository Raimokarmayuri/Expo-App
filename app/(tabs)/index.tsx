import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { getNotes } from '../../utils/storage';
import NoteCard from '../../components/NoteCard';
import { useRouter, useFocusEffect } from 'expo-router';

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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📒 My Notes</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard note={item} />}
      />
      <Button title="Add Note" onPress={() => router.push('/add')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
