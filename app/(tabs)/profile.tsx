import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
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
  const router = useRouter();
  const { session, signOut } = useAuth();
  const [LIPperfilUsuario, setLIPperfilUsuario] = useState<LIPUserProfile | null>(null);

  const LIP_FOTO_PADRAO =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToTpoywMK_vppXftxXNHpSm_vx_YsMjgtTIMa5FhSp2cjGWPNC1RruPAq-&s=10';

  const [LIPimgperfil, setLIPimgperfil] = useState<string>(LIP_FOTO_PADRAO);

  useFocusEffect(
    useCallback(() => {
      async function LIPcarregarFoto() {
        try {
          if (!session) {
            setLIPimgperfil(LIP_FOTO_PADRAO);
            setLIPperfilUsuario(null);
            return;
          }

          const [LIPfotoSalva, LIPdadosPerfil] = await Promise.all([
            LIPcarregarFotoPerfil(session),
            LIPobterPerfil(session),
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
    }, [session])
  );

  const LIPsair = async () => {
    try {
      await signOut();
      router.replace('/login' as Href);
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
        if (LIPimagem?.uri && session) {
          const LIPfotoSalva = await LIPsalvarFotoPerfil(
            session,
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
    <View style={styles.caixa1}>
      <View style={styles.caixa2}>
        <TouchableOpacity
          style={styles.perfil}
          onPress={LIPescolherfoto}
          accessibilityRole="button"
          accessibilityLabel="Alterar foto do perfil"
        >
          <Image source={{ uri: LIPimgperfil }} style={styles.perfil} />
        </TouchableOpacity>
        <Text style={styles.textonome}>{LIPperfilUsuario?.nome ?? 'Carregando perfil...'}</Text>
        <Text style={styles.textoemail}>{LIPperfilUsuario?.email ?? session}</Text>
      </View>

      <View style={styles.caixa3}>
        <View style={styles.caixaItem}>
          <FallbackIcon name="map" size={24} color="black" />
          <Text style={styles.texto}>Endereço</Text>
          <Text style={styles.detalheItem} numberOfLines={1}>
            {LIPperfilUsuario?.endereco || 'Não informado'}
          </Text>
          <View style={styles.padding1}>
            <TouchableOpacity onPress={() => router.push('/edit1')}>
              <FallbackIcon name="caret-right" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.caixaItem}>
          <FallbackIcon name="phone" size={24} color="black" />
          <Text style={styles.texto}>Telefone</Text>
          <Text style={styles.detalheItem} numberOfLines={1}>
            {LIPperfilUsuario?.telefone || 'Não informado'}
          </Text>
          <View style={styles.padding2}>
            <TouchableOpacity onPress={() => router.push('/edit2')}>
              <FallbackIcon name="caret-right" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.caixaItem}>
          <FallbackIcon name="credit-card" size={24} color="black" />
          <Text style={styles.texto}>Pagamento</Text>
          <Text style={styles.detalheItem}>
            {LIPperfilUsuario?.cartaoFinal
              ? `•••• ${LIPperfilUsuario.cartaoFinal}`
              : 'Não informado'}
          </Text>
          <View style={styles.padding3}>
            <TouchableOpacity onPress={() => router.push('/edit3')}>
              <FallbackIcon name="caret-right" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.botaoSair} onPress={LIPsair}>
          <Text style={styles.textoBotaoSair}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.light.background,
  },
  caixa2: {
    backgroundColor: Colors.light.tint,
    height: '40%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caixa3: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    width: '100%',
    height: '60%',
    paddingTop: 20,
  },
  perfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
  texto: {
    color: Colors.light.text,
    fontSize: 18,
    padding: 10,
    marginBottom: 3,
    fontWeight: '600',
  },
  textonome: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  textoemail: {
    color: '#c0c8e0',
    fontSize: 15,
    marginTop: 5,
  },
  caixaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    width: '100%',
  },
  detalheItem: {
    color: '#606879',
    fontSize: 13,
    flexShrink: 1,
    marginLeft: 'auto',
    marginRight: 12,
  },
  padding1: { marginLeft: 'auto' },
  padding2: { marginLeft: 'auto' },
  padding3: { marginLeft: 'auto' },
  botaoSair: {
    alignSelf: 'center',
    backgroundColor: '#172b6e',
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 8,
    marginTop: 24,
  },
  textoBotaoSair: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});