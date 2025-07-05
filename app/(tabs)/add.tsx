// File: app/add-note.tsx
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getNotes, saveNotes } from '../../utils/storage';

const categories = ['Work', 'Personal', 'Ideas', 'Travel', 'Important'];

export default function AddNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  const handleCapture = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera access is needed to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.5 });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleGalleryPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleGetLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Location access is needed.');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    Alert.alert('Location Saved', `Lat: ${loc.coords.latitude}, Lon: ${loc.coords.longitude}`);
  };

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Both fields are required.');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      category: selectedCategory,
      image,
      location,
      timestamp: new Date().toISOString(),
    };

    const oldNotes = await getNotes();
    const updatedNotes = [...oldNotes, newNote];
    await saveNotes(updatedNotes);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>➕ Add New Note</Text>

      <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />

      <TextInput
        placeholder="Content"
        multiline
        style={[styles.input, { height: 120 }]}
        value={content}
        onChangeText={setContent}
      />

      <Text style={{ marginBottom: 4, fontWeight: '600' }}>Category</Text>
      <View style={styles.dropdown}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[styles.categoryOption, selectedCategory === cat && styles.selectedCategory]}
          >
            <Text>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.iconRow}>
        <TouchableOpacity onPress={handleCapture} style={styles.iconButton}>
          <Ionicons name="camera-outline" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGalleryPick} style={styles.iconButton}>
          <Ionicons name="image-outline" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGetLocation} style={styles.iconButton}>
          <Ionicons name="location-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <Button title="Save Note" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ccc',
  },
  dropdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  categoryOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  selectedCategory: {
    backgroundColor: '#cce5ff',
    borderColor: '#007aff',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  iconButton: {
    marginRight: 20,
  },
  imagePreview: {
    width: '100%',
    height: 180,
    marginBottom: 12,
    borderRadius: 10,
  },
});
