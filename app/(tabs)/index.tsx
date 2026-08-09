import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; 
import HomeScreen from './HomeScreen';
import Communaute from './Communaute';
import StartTraining from './StartTraining'; 
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDumbbell, faHouse, faGlobe, faStore, faRobot } from '@fortawesome/free-solid-svg-icons';
import ExploreRoutine from './ExploreRoutine';
import CameraScreen from './Camera';
import TrainingScreen from './TrainingScreen';
import { SafeAreaView } from 'react-native';
import LoginScreen from './LoginScreen';
import CreateProfil from './CreateProfil';
import SignupScreen from './SignupScreen';

import FriendChatPage from '@/components/FriendChat';
import Boutique from './Store';
import Chatbot from './Chatbot'; 
import ProfileScreen from './ProfileScreen'; 
import TestCamera from './TestCamera';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); 

function TrainingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="StartTraining" component={StartTraining} />
      <Stack.Screen name="ExploreRoutine" component={ExploreRoutine} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="TrainingScreen" component={TrainingScreen} />

    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TestCamera" component={TestCamera} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="CreateProfil" component={CreateProfil} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen 
        name="Profil" 
        component={ProfileScreen} 
        options={{ headerShown: true, title: 'Mon Profil' }} 
      />
    </Stack.Navigator>
  );
}

function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Communaute" component={Communaute} />
      <Stack.Screen name="FriendChatPage" component={FriendChatPage}  />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarStyle: {
            position: 'absolute', // Pour garantir qu'elle reste fixe au bas
            bottom: 0, // Coller la barre en bas de l'écran
            left: 0, // Étendre sur tout l'écran horizontalement
            right: 0,
            backgroundColor: '#ffffff', // Fond blanc
            borderTopWidth: 0.5, // Fine bordure en haut
            borderTopColor: '#d1d1d1', // Gris clair pour la bordure
            height: 60,
            //paddingBottom: 20, // Ajuste pour l'encoche (Safe Area)
            shadowColor: '#000',
            elevation: 10, // Ombre pour Android
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: -2 },
            paddingBottom: 0,
            
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
        }}
        
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ 
            headerShown: false, 
            title: 'Accueil', 
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={faHouse} color={color} size={size || 24} />
            ),
            
          }}
        />

        <Tab.Screen
            name="Boutique"
            component={Boutique}
            options={{
              headerShown: false,
              title: 'Boutique',
              tabBarIcon: ({ color, size }) => (
                <FontAwesomeIcon icon={faStore} color={color} size={size || 24} />
              ),
            }}
            />

          <Tab.Screen
          name="Entraînement"
          component={TrainingStack}
          options={{ 
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={faDumbbell} color={color} size={size || 24} /> 
            ),
          }}
        />

        <Tab.Screen
          name="Communauté"
          component={CommunityStack}
          options={{ 
            headerShown: false, 
            title: 'Communauté',
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={faGlobe} color={color} size={size || 24} />
            ),
            
          }}
          />
    

          <Tab.Screen
            name="Chatbot"
            component={Chatbot}
            options={{
              headerShown: false,
              title: 'IA',
              tabBarIcon: ({ color, size }) => (
                <FontAwesomeIcon icon={faRobot} color={color} size={size || 24} />
              ),
            }}
          />
        
      </Tab.Navigator>
    </NavigationContainer>
    </SafeAreaView>
  );
}
