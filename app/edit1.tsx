import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { showAlert } from '@/lib/alert';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LIPatualizarPerfil, LIPobterPerfil } from '@/constants/userStore';

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
        <Text style={{ flex: 1, flexWrap: 'wrap' }}>{LIPendatual}</Text>
      </View>
      <View style={LIPstyles.xd2}>
        <Text style={LIPstyles.texto}>Alterar endereço:</Text>
        <TextInput
          onChangeText={setLIPendnovo}
          value={LIPendnovo}
          placeholder="Digite o novo endereço aqui."
          multiline={true}
          style={{ flex: 1 }}
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
    fontSize: 15,
    marginRight: 30,
  },
  containersuperior: {
    flexDirection: 'column',
  },
  xd2: {
    flexDirection: 'row',
    margin: 30,
    alignItems: 'center',
  },
  botao: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#172b6e',
    height: 50,
    width: 200,
    borderRadius: 6,
  },
  textobotao: {
    color: '#fff',
    margin: 10,
    fontWeight: 'bold',
  },
  botaoxd: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});