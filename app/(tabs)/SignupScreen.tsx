import { useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    // Cacher la barre du bas
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });

    // Réafficher la barre du bas quand on quitte cet écran
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
  const handleSignup = () => {
    setErrorMessage('');

    if (!agreeToTerms) {
      setErrorMessage('Vous devez accepter les termes et conditions.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    console.log('Signup successful:', { email, password });
    navigation.navigate('CreateProfil');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Inscription</Text>

        <TextInput
          placeholder="Adresse email"
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

        <TextInput
          placeholder="Confirmer le mot de passe"
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          onPress={() => setAgreeToTerms(!agreeToTerms)}
          style={styles.termsContainer}
        >
          <View
            style={[
              styles.checkbox,
              agreeToTerms && styles.checkboxChecked,
            ]}
          />
          <Text style={styles.termsText}>
            J'accepte les{' '}
            <Text
              style={styles.linkText}
              onPress={() => console.log("Open Terms of Service")}
            >
              Conditions d'utilisation
            </Text>{' '}
            et la{' '}
            <Text
              style={styles.linkText}
              onPress={() => console.log("Open Privacy Policy")}
            >
              Politique de confidentialité
            </Text>
            .
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.signupButton, !agreeToTerms && styles.disabledButton]}
          onPress={handleSignup}
          disabled={!agreeToTerms}
        >
          <Text
            style={[styles.buttonText, !agreeToTerms && styles.disabledButtonText]}
          >
            Je m'inscris
          </Text>
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
  termsContainer: {
    width: '90%',
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  termsText: {
    color: '#6b7280',
    fontSize: 14,
  },
  linkText: {
    color: '#1D4ED8',
    textDecorationLine: 'underline',
  },
  signupButton: {
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
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButtonText: {
    color: '#6b7280',
  },
});
