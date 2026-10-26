import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LIPProducts } from '../../constants/Products';
import FallbackIcon from '@/components/FallbackIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LIPaddProductToCart } from '@/constants/cart';
import { showAlert } from '@/lib/alert';
import Colors from '@/constants/Colors';

export default function LIPProductDetail() {
  const { id: LIPid } = useLocalSearchParams();
  const LIPprodutoAtual = LIPProducts.find(LIPitem => LIPitem.LIPid === LIPid);

  const [LIPtamanhoSelecionado, setLIPtamanhoSelecionado] = useState<string>(
    LIPprodutoAtual?.LIPAsize?.[0] || 'M'
  );

  const LIPadicionarAoCarrinho = async () => {
    if (!LIPprodutoAtual) return;

    try {
      await LIPaddProductToCart(LIPprodutoAtual, LIPtamanhoSelecionado);
      showAlert('Sucesso!', 'Produto adicionado ao carrinho.', [
        { text: 'Continuar na Loja' },
        { text: 'Ir para o Carrinho', onPress: () => router.push('/(tabs)/cart') },
      ]);
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      showAlert('Erro', 'Não foi possível adicionar o produto ao carrinho.');
    }
  };

  if (!LIPprodutoAtual) {
    return (
      <View style={LIPstyles.containerErro}>
        <Text style={LIPstyles.textoErro}>Produto não encontrado!</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={LIPstyles.containerGeral}>
      <ScrollView style={LIPstyles.containerScroll} showsVerticalScrollIndicator={false}>
        <View style={LIPstyles.containerImagem}>
          <Image source={{ uri: LIPprodutoAtual.LIPimage }} style={LIPstyles.imagemProduto} />
          
          <TouchableOpacity style={LIPstyles.botaoVoltar} onPress={() => router.back()}>
            <FallbackIcon name="left" size={20} color={Colors.light.text} />
          </TouchableOpacity>

          <TouchableOpacity style={LIPstyles.botaoFavorito}>
            <FallbackIcon name="heart-outline" size={22} color={Colors.light.primaryDark} />
          </TouchableOpacity>
        </View>

        <View style={LIPstyles.containerInfo}>
          <View style={LIPstyles.linhaTitulo}>
            <View style={{ flex: 1 }}>
              <Text style={LIPstyles.nomeProduto}>{LIPprodutoAtual.LIPname}</Text>
              <Text style={LIPstyles.subtituloProduto}>Roupa Infantil</Text>
            </View>

            <View style={LIPstyles.containerAvaliacao}>
              <FallbackIcon name="star" size={18} color={Colors.light.primary} />
              <Text style={LIPstyles.textoAvaliacao}>4.8 <Text style={LIPstyles.textoQtdAvaliacao}>(230)</Text></Text>
            </View>
          </View>
          <View style={LIPstyles.divisoria} />
          <Text style={LIPstyles.tituloSecao}>Descrição</Text>
          <Text style={LIPstyles.textoDescricao}>
            {LIPprodutoAtual.LIPdesc}
          </Text>
            
          <Text style={LIPstyles.tituloSecao}>Tamanho</Text>
          <View style={LIPstyles.containerTamanhos}>
            {LIPprodutoAtual.LIPAsize.map((LIPtamanho) => (
              <TouchableOpacity
                key={LIPtamanho}
                style={[
                  LIPstyles.caixaTamanho,
                  LIPtamanhoSelecionado === LIPtamanho && LIPstyles.caixaTamanhoSelecionado
                ]}
                onPress={() => setLIPtamanhoSelecionado(LIPtamanho)}
              >
                <Text
                  style={[
                    LIPstyles.textoTamanho,
                    LIPtamanhoSelecionado === LIPtamanho && LIPstyles.textoTamanhoSelecionado
                  ]}
                >
                  {LIPtamanho}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={LIPstyles.barraInferior}>
        <View>
          <Text style={LIPstyles.labelPreco}>Preço</Text>
          <Text style={LIPstyles.valorPreco}>R$ {LIPprodutoAtual.LIPprice.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={LIPstyles.botaoComprar} onPress={LIPadicionarAoCarrinho}>
          <Text style={LIPstyles.textoBotaoComprar}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const LIPstyles = StyleSheet.create({
  containerGeral: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  containerScroll: {
    flex: 1,
  },
  containerErro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoErro: {
    fontSize: 18,
    color: Colors.light.primaryDark,
  },
  containerImagem: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    backgroundColor: Colors.light.sage,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  imagemProduto: {
    width: 260,
    height: 260,
    borderRadius: 130,
    resizeMode: 'cover',
  },
  botaoVoltar: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: Colors.light.surface,
    padding: 10,
    borderRadius: 20,
  },
  botaoFavorito: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: Colors.light.surface,
    padding: 10,
    borderRadius: 20,
  },
  containerInfo: {
    padding: 20,
  },
  linhaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nomeProduto: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  subtituloProduto: {
    fontSize: 14,
    color: Colors.light.textMuted,
    marginTop: 4,
  },
  containerAvaliacao: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoAvaliacao: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  textoQtdAvaliacao: {
    fontSize: 12,
    color: Colors.light.textMuted,
    fontWeight: 'normal',
  },
  divisoria: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 15,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  textoDescricao: {
    fontSize: 14,
    color: Colors.light.textMuted,
    lineHeight: 20,
    marginBottom: 20,
  },
  containerTamanhos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  caixaTamanho: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
  },
  caixaTamanhoSelecionado: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.surfaceMuted,
  },
  textoTamanho: {
    fontSize: 16,
    color: Colors.light.textMuted,
    fontWeight: '600',
  },
  textoTamanhoSelecionado: {
    color: Colors.light.primaryDark,
    fontWeight: 'bold',
  },
  barraInferior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
  },
  labelPreco: {
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  valorPreco: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primaryDark,
  },
  botaoComprar: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 16,
  },
  textoBotaoComprar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});