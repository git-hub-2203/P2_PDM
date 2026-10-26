import { StyleSheet, TouchableOpacity, Image, Text, View, ScrollView } from 'react-native';
import { showAlert } from '@/lib/alert';
import FallbackIcon from '@/components/FallbackIcon';
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import { useRouter, useFocusEffect, type Href } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LIPobterPerfil, type LIPUserProfile } from '@/constants/userStore';
import { LIPcarregarFotoPerfil, LIPsalvarFotoPerfil } from '@/constants/profilePhoto';

export default function TabThreeScreenLIP() {
  const LIProuter = useRouter();
  const { session: LIPsession, signOut: LIPsignOut } = useAuth();
  const [LIPperfilUsuario, setLIPperfilUsuario] = useState<LIPUserProfile | null>(null);

  const LIP_FOTO_PADRAO =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToTpoywMK_vppXftxXNHpSm_vx_YsMjgtTIMa5FhSp2cjGWPNC1RruPAq-&s=10';

  const [LIPimgperfil, setLIPimgperfil] = useState<string>(LIP_FOTO_PADRAO);

  useFocusEffect(
    useCallback(() => {
      async function LIPcarregarFoto() {
        try {
          if (!LIPsession) {
            setLIPimgperfil(LIP_FOTO_PADRAO);
            setLIPperfilUsuario(null);
            return;
          }

          const [LIPfotoSalva, LIPdadosPerfil] = await Promise.all([
            LIPcarregarFotoPerfil(LIPsession),
            LIPobterPerfil(LIPsession),
          ]);
          if (LIPfotoSalva) {
            setLIPimgperfil(LIPfotoSalva);
          } else {
            setLIPimgperfil(LIP_FOTO_PADRAO);
          }
          setLIPperfilUsuario(LIPdadosPerfil);
        } catch (error) {
          console.error('Erro ao carregar dados do perfil:', error);
          showAlert('Erro', 'Não foi possível carregar os dados do perfil.');
        }
      }
      LIPcarregarFoto();
    }, [LIPsession])
  );

  const LIPsair = async () => {
    try {
      await LIPsignOut();
      LIProuter.replace('/login' as Href);
    } catch (error) {
      console.error('Erro ao sair da conta:', error);
      showAlert('Erro', 'Não foi possível sair da conta.');
    }
  };

  const LIPescolherfoto = async () => {
    try {
      const LIPpermissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!LIPpermissao.granted) {
        showAlert('Permissão necessária', 'Permita o acesso às fotos para trocar a imagem do perfil.');
        return;
      }

      const LIPresult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!LIPresult.canceled) {
        const LIPimagem = LIPresult.assets[0];
        if (LIPimagem?.uri && LIPsession) {
          const LIPfotoSalva = await LIPsalvarFotoPerfil(
            LIPsession,
            LIPimagem.uri,
            LIPimagem.base64,
            LIPimagem.mimeType
          );
          setLIPimgperfil(LIPfotoSalva);
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar ou salvar foto do perfil:', error);
      showAlert('Erro', 'Não foi possível atualizar a foto do perfil.');
    }
  };

  return (
    <ScrollView
      style={LIPstyles.caixa1}
      contentContainerStyle={LIPstyles.conteudo}
      showsVerticalScrollIndicator={false}
    >
      <View style={LIPstyles.caixa2}>
        <TouchableOpacity
          style={LIPstyles.avatarWrap}
          onPress={LIPescolherfoto}
          accessibilityRole="button"
          accessibilityLabel="Alterar foto do perfil"
        >
          <Image source={{ uri: LIPimgperfil }} style={LIPstyles.perfil} />
        </TouchableOpacity>
        <Text style={LIPstyles.textonome}>{LIPperfilUsuario?.nome ?? 'Carregando perfil...'}</Text>
        <Text style={LIPstyles.textoemail}>{LIPperfilUsuario?.email ?? LIPsession}</Text>
      </View>

      <View style={LIPstyles.caixa3}>
        <Text style={LIPstyles.tituloSecao}>Minha conta</Text>
        <TouchableOpacity
          style={LIPstyles.caixaItem}
          onPress={() => LIProuter.push('/edit1')}
          accessibilityRole="button"
          accessibilityLabel="Editar endereço"
        >
          <View style={LIPstyles.iconeItem}>
            <FallbackIcon name="map" size={21} color={Colors.light.primaryDark} />
          </View>
          <View style={LIPstyles.infoItem}>
            <Text style={LIPstyles.texto}>Endereço</Text>
            <Text style={LIPstyles.detalheItem} numberOfLines={1}>
              {LIPperfilUsuario?.endereco || 'Não informado'}
            </Text>
          </View>
          <FallbackIcon name="caret-right" size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={LIPstyles.caixaItem}
          onPress={() => LIProuter.push('/edit2')}
          accessibilityRole="button"
          accessibilityLabel="Editar telefone"
        >
          <View style={LIPstyles.iconeItem}>
            <FallbackIcon name="phone" size={21} color={Colors.light.primaryDark} />
          </View>
          <View style={LIPstyles.infoItem}>
            <Text style={LIPstyles.texto}>Telefone</Text>
            <Text style={LIPstyles.detalheItem} numberOfLines={1}>
              {LIPperfilUsuario?.telefone || 'Não informado'}
            </Text>
          </View>
          <FallbackIcon name="caret-right" size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[LIPstyles.caixaItem, LIPstyles.ultimoItem]}
          onPress={() => LIProuter.push('/edit3')}
          accessibilityRole="button"
          accessibilityLabel="Editar pagamento"
        >
          <View style={LIPstyles.iconeItem}>
            <FallbackIcon name="credit-card" size={21} color={Colors.light.primaryDark} />
          </View>
          <View style={LIPstyles.infoItem}>
            <Text style={LIPstyles.texto}>Pagamento</Text>
            <Text style={LIPstyles.detalheItem} numberOfLines={1}>
              {LIPperfilUsuario?.cartaoFinal
                ? `•••• ${LIPperfilUsuario.cartaoFinal}`
                : 'Não informado'}
            </Text>
          </View>
          <FallbackIcon name="caret-right" size={20} color={Colors.light.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={LIPstyles.botaoSair} onPress={LIPsair}>
          <Text style={LIPstyles.textoBotaoSair}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const LIPstyles = StyleSheet.create({
  caixa1: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  conteudo: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  caixa2: {
    backgroundColor: Colors.light.sage,
    minHeight: 235,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 26,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  caixa3: {
    backgroundColor: Colors.light.surface,
    marginHorizontal: 18,
    marginTop: 22,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  perfil: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: Colors.light.surface,
  },
  avatarWrap: {
    width: 102,
    height: 102,
    borderRadius: 51,
    padding: 5,
    backgroundColor: Colors.light.surface,
    marginBottom: 10,
  },
  texto: {
    color: Colors.light.text,
    fontSize: 15,
    fontWeight: '600',
  },
  textonome: {
    color: Colors.light.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 5,
  },
  textoemail: {
    color: Colors.light.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  tituloSecao: {
    color: Colors.light.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  caixaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  iconeItem: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.light.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
  },
  detalheItem: {
    color: Colors.light.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  ultimoItem: {
    borderBottomWidth: 0,
  },
  botaoSair: {
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceMuted,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 16,
  },
  textoBotaoSair: {
    color: Colors.light.primaryDark,
    fontSize: 14,
    fontWeight: '600',
  },
});