import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { getNotes, saveNotes } from '../../utils/storage';

export default function NoteDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const load = async () => {
      const all = await getNotes();
      const found = all.find((n) => n.id === id);
      if (found) {
        setNote(found);
        setTitle(found.title);
        setContent(found.content);
      }
    };
    load();
  }, []);

  const handleUpdate = async () => {
    const allNotes = await getNotes();
    const updatedNotes = allNotes.map((n) =>
      n.id === id ? { ...n, title, content } : n
    );
    await saveNotes(updatedNotes);
    Alert.alert('Note updated!');
    router.back(); // go back to the notes list
  };

  if (!note) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputTitle}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      <TextInput
        style={styles.inputContent}
        value={content}
        onChangeText={setContent}
        placeholder="Content"
        multiline
      />
      <Button title="Update Note" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  inputTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  inputContent: {
    fontSize: 16,
    marginBottom: 20,
    height: 150,
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
  },
});
