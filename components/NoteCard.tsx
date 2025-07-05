// import { useRouter } from 'expo-router';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function NoteCard({ note }: { note: any }) {
//   const router = useRouter();

//   return (
//      <TouchableOpacity
//       onPress={() =>
//         router.push({
//           pathname: '/note/[id]',
//           params: { id: note.id },
//         })
//       }
//     >
//       <View style={styles.card}>
//         <Text style={styles.title}>{note.title}</Text>
//         <Text numberOfLines={2}>{note.content}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     padding: 14,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     elevation: 2,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 18,
//     marginBottom: 4,
//   },
// });
// https://expo.dev/accounts/mraimokar/projects/MyFirstExpoApp/builds/5e650243-d179-42ae-a2e3-f0f7b1910413   


import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function NoteCard({ note, onDelete }) {
  const router = useRouter();
  return (
    
//          <TouchableOpacity
//       onPress={() =>
//         router.push({
//           pathname: '/note/[id]',
//           params: { id: note.id },
//         })
//       }
//     >
//       <View style={styles.card}>
//         <Text style={styles.title}>{note.title}</Text>
//         <Text numberOfLines={2}>{note.content}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

<TouchableOpacity
  onPress={() =>
    router.push({
      pathname: '/note/[id]',
      params: { id: note.id },
    })
  }
>
  <View style={styles.card}>
    {note.image && <Image source={{ uri: note.image }} style={styles.image} />}

    <View style={styles.textRow}>
      <Text style={styles.title}>{note.title}</Text>
      <Pressable
        onPress={(e) => {
          e.stopPropagation(); // ✅ Block navigation when deleting
          onDelete();
        }}
      >
        <Ionicons name="trash-bin" size={20} color="#d11a2a" />
      </Pressable>
    </View>

    {note.category && <Text style={styles.category}>{note.category}</Text>}
  </View>
</TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
});
