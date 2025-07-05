import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function NoteCard({ note }: { note: any }) {
  const router = useRouter();

  return (
     <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/note/[id]',
          params: { id: note.id },
        })
      }
    >
      <View style={styles.card}>
        <Text style={styles.title}>{note.title}</Text>
        <Text numberOfLines={2}>{note.content}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
});
