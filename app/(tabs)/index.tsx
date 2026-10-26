import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Text } from 'react-native';
import CardProdutos from '@/components/CardProdutos';
import FallbackIcon from '@/components/FallbackIcon';
import { useState, useCallback, useMemo } from 'react';
import { LIPProducts } from '@/constants/Products';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LIPobterPerfil } from '@/constants/userStore';
import { LIPcarregarFotoPerfil } from '@/constants/profilePhoto';
import Colors from '@/constants/Colors';

export default function App() {
  const { session: LIPsession } = useAuth();
  const LIP_FOTO_PADRAO =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToTpoywMK_vppXftxXNHpSm_vx_YsMjgtTIMa5FhSp2cjGWPNC1RruPAq-&s=10';

  const [LIPimgperfil, setLIPimgperfil] = useState<string>(LIP_FOTO_PADRAO);
  const [LIPendereco, setLIPendereco] = useState<string>('Petrópolis, Manaus');
  const [LIPpesquisa, setLIPpesquisa] = useState<string>('');
  const [LIPprecoAscendente, setLIPprecoAscendente] = useState<boolean>(false);

  const LIPprodutosVisiveis = useMemo(() => {
    const LIPtermo = LIPpesquisa.trim().toLocaleLowerCase();
    const LIPfiltrados = LIPProducts.filter((LIPproduto) =>
      LIPproduto.LIPname.toLocaleLowerCase().includes(LIPtermo)
    );
    return LIPprecoAscendente
      ? [...LIPfiltrados].sort((LIPa, LIPb) => LIPa.LIPprice - LIPb.LIPprice)
      : LIPfiltrados;
  }, [LIPpesquisa, LIPprecoAscendente]);

  useFocusEffect(
    useCallback(() => {
      async function LIPcarregarDadosGlobais() {
        try {

          if (!LIPsession) {
            setLIPimgperfil(LIP_FOTO_PADRAO);
            setLIPendereco('Petrópolis, Manaus');
            return;
          }

          const [LIPfotoSalva, LIPperfil] = await Promise.all([
            LIPcarregarFotoPerfil(LIPsession),
            LIPobterPerfil(LIPsession),
          ]);
          if (LIPfotoSalva) {
            setLIPimgperfil(LIPfotoSalva);
          } else {
            setLIPimgperfil(LIP_FOTO_PADRAO);
          }

          if (LIPperfil) {
            setLIPendereco(LIPperfil.endereco);
          }
        } catch (error) {
          console.error('Erro ao carregar dados do AsyncStorage no catálogo:', error);
        }
      }

      LIPcarregarDadosGlobais();
    }, [LIPsession])
  );

  return (
    <View style={LIPstyles.container}>
      <View style={LIPstyles.perfil}>
        <View style={LIPstyles.areahome}>
          <Text style={LIPstyles.texto}>A entrega será feita em:</Text>
          {/* Exibe o endereço dinâmico */}
          <Text style={LIPstyles.endereco}>{LIPendereco}</Text>
        </View>

        <View style={LIPstyles.areafoto}>

          <Image source={{ uri: LIPimgperfil }} style={LIPstyles.fotoperfil} />
        </View>
      </View>

      <View style={LIPstyles.containerPesquisa}>
        <View style={LIPstyles.caixaInput}>
          <FallbackIcon name="search" size={20} color="#999" style={LIPstyles.iconeBusca} />
          <TextInput
            style={LIPstyles.input}
            placeholder="Pesquisar roupa..."
            placeholderTextColor="#999"
            value={LIPpesquisa}
            onChangeText={setLIPpesquisa}
            accessibilityLabel="Pesquisar produtos"
          />
        </View>

        <TouchableOpacity
          style={LIPstyles.botaoFiltro}
          onPress={() => setLIPprecoAscendente((LIPatual) => !LIPatual)}
          accessibilityRole="button"
          accessibilityLabel={
            LIPprecoAscendente
              ? 'Ordenar por preço decrescente'
              : 'Ordenar por preço crescente'
          }
        >
          <FallbackIcon name="swap-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={LIPstyles.catalogo}
      >
        <View style={LIPstyles.catalogoIntro}>
          <Text style={LIPstyles.catalogoTitulo}>Roupas para a sua criança</Text>
          <Text style={LIPstyles.catalogoSubtitulo}>Conforto e carinho em cada peça</Text>
        </View>
        {LIPprodutosVisiveis.length > 0 ? (
          LIPprodutosVisiveis.map((item) => (
            <CardProdutos
              key={item.LIPid}
              LIPid={item.LIPid}
              LIPname={item.LIPname}
              LIPprice={item.LIPprice}
              LIPimage={item.LIPimage}
              LIPAsize={item.LIPAsize}
            />
          ))
        ) : (
          <Text style={LIPstyles.semResultados}>Nenhum produto encontrado.</Text>
        )}
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}

const LIPstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  perfil: {
    flexDirection: 'row',
    backgroundColor: Colors.light.sage,
    width: '100%',
    height: '21%',
    minHeight: 145,
    maxHeight: 190,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  containerPesquisa: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: -25,
    zIndex: 10,
  },
  caixaInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginRight: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  iconeBusca: {
    marginRight: 8,
  },
  input: {
    flex: 1,
  },
  botaoFiltro: {
    backgroundColor: Colors.light.primary,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  semResultados: {
    width: '100%',
    marginTop: 24,
    color: Colors.light.textMuted,
    textAlign: 'center',
  },
  catalogo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 18,
    paddingBottom: 40,
  },
  catalogoIntro: {
    width: '100%',
    paddingHorizontal: 5,
    marginBottom: 4,
  },
  catalogoTitulo: {
    color: Colors.light.text,
    fontSize: 19,
    fontWeight: '700',
  },
  catalogoSubtitulo: {
    color: Colors.light.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  areahome: {
    height: '100%',
    width: '70%',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  areafoto: {
    height: '100%',
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endereco: {
    color: Colors.light.text,
    fontSize: 15,
    fontWeight: '600',
  },
  texto: {
    color: Colors.light.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  fotoperfil: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: Colors.light.surface,
  },
});