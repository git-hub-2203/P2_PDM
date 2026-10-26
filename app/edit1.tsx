import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { showAlert } from '@/lib/alert';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LIPatualizarPerfil, LIPobterPerfil } from '@/constants/userStore';
import Colors from '@/constants/Colors';

export default function LIPedit1() {
  const { session: LIPsession } = useAuth();
  const [LIPendnovo, setLIPendnovo] = useState<string>('');
  const [LIPendatual, setLIPendatual] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      async function LIPcarregarEndereco() {
        try {
          const LIPperfil = LIPsession ? await LIPobterPerfil(LIPsession) : null;
          setLIPendatual(LIPperfil?.endereco ?? '');
        } catch (error) {
          console.error('Erro ao carregar endereço:', error);
          showAlert('Erro', 'Não foi possível carregar o endereço salvo.');
        }
      }

      LIPcarregarEndereco();
    }, [LIPsession])
  );

  const LIPnovoend = async () => {
    const LIPenderecoLimpo = LIPendnovo.trim();
    if (LIPenderecoLimpo === '') {
      showAlert('Aviso', 'Nada foi digitado!');
      return;
    }

    try {
      if (!LIPsession) {
        throw new Error('É necessário entrar na conta para atualizar o endereço.');
      }
      await LIPatualizarPerfil(LIPsession, { endereco: LIPenderecoLimpo });
      setLIPendatual(LIPenderecoLimpo);
      setLIPendnovo('');
      showAlert('Sucesso', 'Endereço salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      showAlert('Erro', 'Não foi possível salvar o endereço.');
    }
  };

  return (
    <View style={LIPstyles.containersuperior}>
      <View style={LIPstyles.xd2}>
        <Text style={LIPstyles.texto}>Endereço Atual:</Text>
        <Text style={LIPstyles.valorAtual}>{LIPendatual || 'Nenhum endereço salvo'}</Text>
      </View>
      <View style={LIPstyles.xd2}>
        <Text style={LIPstyles.texto}>Alterar endereço:</Text>
        <TextInput
          onChangeText={setLIPendnovo}
          value={LIPendnovo}
          placeholder="Digite o novo endereço aqui."
          multiline={true}
          style={LIPstyles.input}
          placeholderTextColor={Colors.light.textMuted}
        />
      </View>
      <View style={LIPstyles.botaoxd}>
        <TouchableOpacity onPress={LIPnovoend} style={LIPstyles.botao}>
          <Text style={LIPstyles.textobotao}>Salvar Endereço</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const LIPstyles = StyleSheet.create({
  texto: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  containersuperior: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  xd2: {
    flexDirection: 'column',
    backgroundColor: Colors.light.surface,
    marginBottom: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  valorAtual: {
    color: Colors.light.textMuted,
    fontSize: 15,
    lineHeight: 21,
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  botao: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    height: 50,
    width: '100%',
    borderRadius: 14,
  },
  textobotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoxd: {
    marginTop: 6,
  },
});