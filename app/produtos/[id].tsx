import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LIPProducts } from '../../constants/Products';
import FallbackIcon from '@/components/FallbackIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LIPaddProductToCart } from '@/constants/cart';
import { showAlert } from '@/lib/alert';

export default function LIPProductDetail() {
  const { id } = useLocalSearchParams();
  const LIPprodutoAtual = LIPProducts.find(item => item.LIPid === id);

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
      <View style={styles.containerErro}>
        <Text style={styles.textoErro}>Produto não encontrado!</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.containerGeral}>
      <ScrollView style={styles.containerScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.containerImagem}>
          <Image source={{ uri: LIPprodutoAtual.LIPimage }} style={styles.imagemProduto} />
          
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
            <FallbackIcon name="left" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoFavorito}>
            <FallbackIcon name="heart-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.containerInfo}>
          <View style={styles.linhaTitulo}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nomeProduto}>{LIPprodutoAtual.LIPname}</Text>
              <Text style={styles.subtituloProduto}>Roupa Infantil</Text>
            </View>

            <View style={styles.containerAvaliacao}>
              <FallbackIcon name="star" size={18} color="#FF9500" />
              <Text style={styles.textoAvaliacao}>4.8 <Text style={styles.textoQtdAvaliacao}>(230)</Text></Text>
            </View>
          </View>
          <View style={styles.divisoria} />
          <Text style={styles.tituloSecao}>Descrição</Text>
          <Text style={styles.textoDescricao}>
            {LIPprodutoAtual.LIPdesc}
          </Text>
            
          <Text style={styles.tituloSecao}>Tamanho</Text>
          <View style={styles.containerTamanhos}>
            {LIPprodutoAtual.LIPAsize.map((tamanho) => (
              <TouchableOpacity
                key={tamanho}
                style={[
                  styles.caixaTamanho,
                  LIPtamanhoSelecionado === tamanho && styles.caixaTamanhoSelecionado
                ]}
                onPress={() => setLIPtamanhoSelecionado(tamanho)}
              >
                <Text
                  style={[
                    styles.textoTamanho,
                    LIPtamanhoSelecionado === tamanho && styles.textoTamanhoSelecionado
                  ]}
                >
                  {tamanho}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.barraInferior}>
        <View>
          <Text style={styles.labelPreco}>Preço</Text>
          <Text style={styles.valorPreco}>R$ {LIPprodutoAtual.LIPprice.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.botaoComprar} onPress={LIPadicionarAoCarrinho}>
          <Text style={styles.textoBotaoComprar}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerGeral: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: 'red',
  },
  containerImagem: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    backgroundColor: '#fff',
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
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 20,
  },
  botaoFavorito: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#f5f5f5',
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
    color: '#1a1a1a',
  },
  subtituloProduto: {
    fontSize: 14,
    color: '#888',
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
    color: '#888',
    fontWeight: 'normal',
  },
  divisoria: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  textoDescricao: {
    fontSize: 14,
    color: '#666',
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
    borderColor: '#e0e0e0',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  caixaTamanhoSelecionado: {
    borderColor: '#172b6e',
    backgroundColor: '#f0f4ff',
  },
  textoTamanho: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  textoTamanhoSelecionado: {
    color: '#172b6e',
    fontWeight: 'bold',
  },
  barraInferior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  labelPreco: {
    fontSize: 12,
    color: '#888',
  },
  valorPreco: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172b6e',
  },
  botaoComprar: {
    backgroundColor: '#172b6e',
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