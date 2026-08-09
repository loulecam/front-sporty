import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
  
      return () => {
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
        });
      };
    }, [navigation]);

  const handleLogin = async () => {
    setErrorMessage('');

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        navigation.navigate('HomeScreen');
      } else {
        setErrorMessage('Identifiant ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrorMessage('Erreur réseau : impossible de se connecter au serveur.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Connectez-vous</Text>

        <TextInput
          placeholder="Adresse email ou identifiant"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Mot de passe"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Je me connecte</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={() => console.log('Connexion avec Google')}>
          <Text style={styles.buttonText}>Se connecter avec Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.facebookButton} onPress={() => console.log('Connexion avec Facebook')}>
          <Text style={styles.buttonText}>Se connecter avec Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={styles.signupText}>Pas de compte ? Je m'inscris !</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f3f4f6',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  loginButton: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FF9119',
    borderRadius: 24,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  googleButton: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#1D4ED8',
    borderRadius: 24,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  facebookButton: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#1E40AF',
    borderRadius: 24,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  signupText: {
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
