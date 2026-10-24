import { LIPregistrarUsuario, LIPvalidarLogin } from '@/constants/userStore';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [LIPmodoCadastro, setLIPmodoCadastro] = useState(false);
  const [LIPnome, setLIPnome] = useState('');
  const [LIPemail, setLIPemail] = useState('');
  const [LIPsenha, setLIPsenha] = useState('');
  const [LIPendereco, setLIPendereco] = useState('');
  const [LIPtelefone, setLIPtelefone] = useState('');
  const [LIPcartao, setLIPcartao] = useState('');
  const [LIPenviando, setLIPenviando] = useState(false);

  const LIPenviar = async () => {
    const LIPemailLimpo = LIPemail.trim().toLocaleLowerCase();
    if (!LIPemailLimpo.includes('@') || LIPsenha.length < 6) {
      Alert.alert('Confira os dados', 'Informe um e-mail válido e uma senha com pelo menos 6 caracteres.');
      return;
    }

    if (LIPmodoCadastro) {
      const LIPultimosDigitos = LIPcartao.replace(/\D/g, '').slice(-4);
      if (
        !LIPnome.trim() ||
        !LIPendereco.trim() ||
        LIPtelefone.replace(/\D/g, '').length < 8 ||
        LIPultimosDigitos.length !== 4
      ) {
        Alert.alert(
          'Dados incompletos',
          'Preencha nome, endereço, telefone e os quatro últimos dígitos do cartão.'
        );
        return;
      }
    }

    setLIPenviando(true);
    try {
      if (LIPmodoCadastro) {
        await LIPregistrarUsuario(
          {
            nome: LIPnome.trim(),
            email: LIPemailLimpo,
            endereco: LIPendereco.trim(),
            telefone: LIPtelefone.trim(),
            cartaoFinal: LIPcartao.replace(/\D/g, '').slice(-4),
          },
          LIPsenha
        );
      } else {
        const LIPusuario = await LIPvalidarLogin(LIPemailLimpo, LIPsenha);
        if (!LIPusuario) {
          Alert.alert('Não foi possível entrar', 'E-mail ou senha incorretos.');
          return;
        }
      }

      await signIn(LIPemailLimpo);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Não foi possível concluir a operação.'
      );
    } finally {
      setLIPenviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brand}>Loja de Roupas</Text>
          <Text style={styles.title}>{LIPmodoCadastro ? 'Crie sua conta' : 'Bem-vindo de volta'}</Text>
          <Text style={styles.subtitle}>
            {LIPmodoCadastro
              ? 'Preencha seus dados para continuar'
              : 'Entre para acessar sua loja infantil'}
          </Text>
        </View>

        <View style={styles.form}>
          {LIPmodoCadastro && (
            <>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                value={LIPnome}
                onChangeText={setLIPnome}
                placeholder="Seu nome"
                placeholderTextColor="#8b93a7"
                style={styles.input}
                autoCapitalize="words"
                textContentType="name"
              />
            </>
          )}

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            value={LIPemail}
            onChangeText={setLIPemail}
            placeholder="seu@email.com"
            placeholderTextColor="#8b93a7"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            value={LIPsenha}
            onChangeText={setLIPsenha}
            placeholder="Mínimo de 6 caracteres"
            placeholderTextColor="#8b93a7"
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            textContentType={LIPmodoCadastro ? 'newPassword' : 'password'}
          />

          {LIPmodoCadastro && (
            <>
              <Text style={styles.label}>Endereço de entrega</Text>
              <TextInput
                value={LIPendereco}
                onChangeText={setLIPendereco}
                placeholder="Rua, número, bairro e cidade"
                placeholderTextColor="#8b93a7"
                style={styles.input}
                autoCapitalize="words"
                textContentType="fullStreetAddress"
              />

              <Text style={styles.label}>Telefone</Text>
              <TextInput
                value={LIPtelefone}
                onChangeText={setLIPtelefone}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#8b93a7"
                style={styles.input}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
              />

              <Text style={styles.label}>Pagamento</Text>
              <TextInput
                value={LIPcartao}
                onChangeText={setLIPcartao}
                placeholder="Somente os 4 últimos dígitos"
                placeholderTextColor="#8b93a7"
                style={styles.input}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
              />
              <Text style={styles.note}>O número completo do cartão não deve ser informado.</Text>
            </>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, LIPenviando && styles.disabledButton]}
            onPress={LIPenviar}
            disabled={LIPenviando}
            accessibilityRole="button"
          >
            {LIPenviando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {LIPmodoCadastro ? 'Criar conta' : 'Entrar'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setLIPmodoCadastro((LIPatual) => !LIPatual)}
          >
            <Text style={styles.toggleText}>
              {LIPmodoCadastro ? 'Já tem uma conta? Entrar' : 'Ainda não tem conta? Cadastre-se'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fc',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brand: {
    color: '#172b6e',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
  },
  title: {
    color: '#172b6e',
    fontSize: 25,
    fontWeight: '700',
    marginTop: 8,
  },
  subtitle: {
    color: '#68738d',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#172b6e',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  label: {
    color: '#26365f',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#dce2ef',
    borderRadius: 10,
    paddingHorizontal: 14,
    color: '#202a44',
    backgroundColor: '#fbfcff',
  },
  note: {
    color: '#68738d',
    fontSize: 12,
    marginTop: 7,
  },
  primaryButton: {
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#172b6e',
    borderRadius: 10,
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleButton: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 4,
  },
  toggleText: {
    color: '#172b6e',
    fontSize: 14,
    fontWeight: '600',
  },
});
