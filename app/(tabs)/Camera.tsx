import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import io from 'socket.io-client';
import * as ImageManipulator from 'expo-image-manipulator';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const intervalRef = useRef(null);
  const isFocused = useIsFocused();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [bicepsCount, setBicepsCount] = useState(0);

  const socket = useRef(null);

  useEffect(() => {
    // Establish socket connection
    socket.current = io('http://127.0.0.1:5000');

    socket.current.on('connect', () => {
      console.log('Socket connected');
    });

    socket.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Listen for biceps count updates from the server
    socket.current.on('biceps_update', (data) => {
      console.log('Biceps Update:', data);
      setBicepsCount(data.nbr_curl_biceps_done);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (permission && permission.granted && isFocused && isCameraReady) {
      intervalRef.current = setInterval(() => {
        captureFrame();
      }, 200);
    } else {
      clearInterval(intervalRef.current);
    }
  
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [permission, isFocused, isCameraReady]);
  

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const captureFrame = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        const frameUri = await resizeImage(photo.uri);
        emitFrame(frameUri); // Send the frame to the server
      } catch (error) {
        console.error('Error capturing frame:', error);
      }
    }
  };

  const resizeImage = async (uri) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [
        { resize: { width: 320, height: 240 } }, // Redimensionnement
      ],
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG } // Compression et format
    );
    return manipulatedImage.uri;
  };
  

  const emitFrame = async (frameUri) => {
    if (socket.current) {
      try {
        // Lire le fichier image en binaire
        const response = await fetch(frameUri);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const binaryData = new Uint8Array(arrayBuffer);
  
        // Envoyer l'image via Socket.IO
        socket.current.emit('frame', binaryData);
        console.log('Frame emitted successfully');
      } catch (error) {
        console.error('Error emitting frame:', error);
      }
    }
  };
  

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          onCameraReady={handleCameraReady}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>Biceps Count: {bicepsCount}</Text>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    maxHeight: 300,
    borderRadius: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  counterContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
