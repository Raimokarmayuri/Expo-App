import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
// import * as Location from 'expo-location';
import * as ImagePicker from "expo-image-picker"; // used if you want to pick from gallery

import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getNotes, saveNotes } from "../../utils/storage";

export default function AddNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [image, setImage] = useState(null);
  const [image, setImage] = useState<string | null>(null); // ✅ Correct

  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  const handleCapture = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Camera access is needed to take a photo."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleGetLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Location access is needed.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    Alert.alert(
      "Location Saved",
      `Lat: ${loc.coords.latitude}, Lon: ${loc.coords.longitude}`
    );
  };

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Both fields are required.");
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      image,
      location,
    };

    const oldNotes = await getNotes();
    const updatedNotes = [...oldNotes, newNote];

    await saveNotes(updatedNotes);
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>➕ Add New Note</Text>

      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Content"
        multiline
        style={[styles.input, { height: 120 }]}
        value={content}
        onChangeText={setContent}
      />

      <View style={styles.iconRow}>
        <TouchableOpacity onPress={handleCapture} style={styles.iconButton}>
          <Ionicons name="camera-outline" size={28} color="#333" />
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
    borderColor: "#ccc",
    color: "red",
    // backgroundColor: "#f9f9f9",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 12,
  },
  iconButton: {
    marginRight: 20,
  },
  imagePreview: {
    width: "100%",
    height: 180,
    marginBottom: 12,
    borderRadius: 10,
  },
});
