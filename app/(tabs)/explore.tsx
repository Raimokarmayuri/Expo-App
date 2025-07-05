import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getNotes } from '../../utils/storage';

const categories = ['All', 'Work', 'Personal', 'Ideas', 'Travel', 'Important'];

type Note = {
  id: string;
  title: string;
  content: string;
  category?: string;
  image?: string;
  location?: { latitude: number; longitude: number };
  timestamp?: string;
};

export default function NotesScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadNotes = async () => {
    const storedNotes = await getNotes();
    setNotes(storedNotes);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const filteredNotes = notes.filter(
    (note: Note) => selectedCategory === 'All' || note.category === selectedCategory
  );

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const showNoteAddedNotification = async (noteTitle: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📝 Note Saved!',
        body: `Your note titled "${noteTitle}" has been saved.`,
      },
      trigger: null, // Send immediately
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Notes</Text>

      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.activeCategory,
            ]}
          >
            <Text>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

       <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/note/${item.id}`)}
            style={styles.noteItem}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
            {item.category && <Text style={styles.categoryLabel}>{item.category}</Text>}
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.noteImage} />
            )}
          </Pressable>
        )}
        ListEmptyComponent={<Text>No notes found.</Text>}
      />

      {/* <Pressable
        onPress={() => {
          router.push({ pathname: '/add', params: { notify: 'true' } });
        }}
        style={styles.addButton}
      >
        <Text style={styles.addText}>+ Add Note</Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 8,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeCategory: {
    backgroundColor: '#cce5ff',
    borderColor: '#007aff',
  },
  row: {
    justifyContent: 'space-between',
  },
  noteItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
  noteImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  addText: { color: '#fff', fontSize: 16 },
});
