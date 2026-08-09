import {
  View,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  TouchableOpacity,
  Text,
} from "react-native";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer } from "expo-three";
import React, { useState, useEffect, useRef } from "react";
import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  AnimationMixer,
  Clock,
  LoopOnce,
  LoopRepeat
} from "three";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShirt } from '@fortawesome/free-solid-svg-icons';

import { loadModel } from "../utils/3d";
import Profile from "./Profile";

const modelFBX = {
  avatar: {
    type: "fbx",
    name: "avatar",
    isometric: false,
    model: require("../../assets/3D/animation.fbx"),
    textures: [{ image: require("../../assets/3D/Image_0.jpg") }],
    scale: {
      x: 1,
      y: 1,
      z: 1,
    },
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    animation: {
      path: require("../../assets/3D/animation.fbx"),
    },
  },
};

const onContextCreate = async (gl: any, selected: any, setModelRef: any, setPlayAnimation: any) => {
  const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

  const renderer = new Renderer({ gl });
  renderer.setSize(width, height);

  const camera = new PerspectiveCamera(75, width / height, 0.1, 1500);
  camera.position.set(0, 130, 900);

  const scene = new Scene();

  // Lighting setup
  const ambientLight = new AmbientLight(0xffffff, 2);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffeedd, 1.5);
  directionalLight.position.set(100, 300, 100);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Load model and animations
  const { obj, mixer, animations } = await loadModel(selected);

  // Store the current animation
  let currentAction = null;

  // Function to play a specific animation
  const playAnimationOnce = (animationName) => {
    const action = mixer.clipAction(animations.find(anim => anim.name === animationName));

    if (currentAction) {
      currentAction.stop();  
    }

    action.setLoop(LoopOnce, 1);  
    action.reset().play(); 
    currentAction = action;
  };

  const playIdleAnimation = () => {
    const action = mixer.clipAction(animations.find(anim => anim.name === "idle"));

    if (currentAction) {
      currentAction.stop(); 
    }

    action.setLoop(LoopRepeat, Infinity);  
    action.reset().play(); 
    currentAction = action;
  };

  obj.position.set(selected.position.x, selected.position.y, selected.position.z);
  obj.scale.set(selected.scale.x, selected.scale.y, selected.scale.z);
  scene.add(obj);

  setModelRef(obj);
  setPlayAnimation({ playAnimationOnce, playIdleAnimation }); 

  let clock = new Clock();

 
  const render = () => {
    requestAnimationFrame(render);

    if (mixer) {
      const delta = clock.getDelta();
      mixer.update(delta);  
    }

    renderer.render(scene, camera);
    gl.endFrameEXP();
  };

  render();

  playIdleAnimation(); 
};


export default function HomeScreen({ navigation }) {
  const [gl, setGL] = useState<ExpoWebGLRenderingContext | null>(null);
  const [modelRef, setModelRef] = useState<any>(null);
  const [playAnimation, setPlayAnimation] = useState<any>(null); 

  const lastTouch = useRef<{ x: number; y: number } | null>(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      lastTouch.current = { x: gestureState.x0, y: gestureState.y0 };
    },
    onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      if (lastTouch.current && modelRef) {
        const deltaX = gestureState.moveX - lastTouch.current.x;
        const deltaY = gestureState.moveY - lastTouch.current.y;

        modelRef.rotation.y += deltaX * 0.01; 
        modelRef.rotation.x += deltaY * 0.01; 

        lastTouch.current = { x: gestureState.moveX, y: gestureState.moveY };
      }
    },
    onPanResponderRelease: () => {
      lastTouch.current = null;
    },
  });

  useEffect(() => {
    // Réafficher la barre du bas
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 0.5,
        borderTopColor: '#d1d1d1',
        height: 60,
        shadowColor: '#000',
        elevation: 10,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: -2 },
      },
      tabBarLabelStyle: {
        fontSize: 11,
        marginBottom: 4,
        marginTop: 0, // Aucun décalage supplémentaire
        
      },
      tabBarIconStyle: {
        marginTop: 4, // Ajuste l'espacement de l'icône vers le bas
    },
      tabBarActiveTintColor: '#000000', // Couleur noire pour l'icône active
      tabBarInactiveTintColor: '#808080',
    });
  }, [navigation]);

  useEffect(() => {
    if (gl) {
      const selected = modelFBX.avatar;
      onContextCreate(gl, selected, setModelRef, setPlayAnimation);
    }
  }, [gl]);

  const handleSquattAnimation = () => {
    if (playAnimation) {
      playAnimation.playAnimationOnce("squatt"); 
    }
  };

  const handleButtonPress = () => {
    console.log('Bouton de cintre pressé');
  };
  const openBattlePass = () => {

  };

  useEffect(() => {
    if (playAnimation) {
      const timeout = setTimeout(() => {
        playAnimation.playIdleAnimation(); 
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [playAnimation]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Profile navigation={navigation} />
      
      <GLView
        style={{ flex: 1 }}
        onContextCreate={(gl) => setGL(gl)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSquattAnimation}>
        <Text style={styles.buttonText}>Play Squatt Animation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.hangerButton} onPress={handleButtonPress}>
        <FontAwesomeIcon icon={faShirt} /> 
      </TouchableOpacity>
      <TouchableOpacity style={styles.battlePass} onPress={openBattlePass}>
        <Text>Battle Pass</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    position: "absolute",
    bottom: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#1E90FF",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  hangerButton: {
    position: 'absolute',
    left: '35%', // Ajuste la position horizontale
    top: '60%', // Centre verticalement
    transform: [{ translateY: -15 }], // Centrage de l'icône (moitié de la taille)
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    elevation: 5, // Ombre pour Android
    shadowColor: '#000', // Ombre pour iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  battlePass: {
    position: 'absolute',
    right: '20%', 
    bottom: '15%', 
    transform: [{ translateY: -15 }], 
    backgroundColor: 'white',
    padding: 10,
    elevation: 5, 
    

  },
});
