import { Alert, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LIPaddProductToCart } from '@/constants/cart';

interface LIPCardProdutosProps {
  LIPid: string;
  LIPname: string;
  LIPprice: number;
  LIPimage: string;
  LIPAsize: string[];
}

export default function LIPCardProdutos(props: LIPCardProdutosProps) {
  const router = useRouter();
  const LIPabrirDetalhes = () => router.push(`/produtos/${props.LIPid}`);
  const LIPadicionarAoCarrinho = async () => {
    try {
      await LIPaddProductToCart(props, props.LIPAsize[0] ?? 'M');
      Alert.alert('Adicionado', 'Produto adicionado ao carrinho.');
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o produto ao carrinho.');
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={LIPabrirDetalhes}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${props.LIPname}`}
      >
        <Image source={{ uri: props.LIPimage }} style={styles.foto} />
        <Text style={styles.nomeproduto}>{props.LIPname}</Text>
      </TouchableOpacity>

      <View style={styles.areapreco}>
        <Text style={styles.precoproduto}>R$ {props.LIPprice.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.botao}
          onPress={LIPadicionarAoCarrinho}
          accessibilityRole="button"
          accessibilityLabel={`Adicionar ${props.LIPname} ao carrinho`}
        >
          <Text style={styles.textobotao}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 15,          
    padding: 10,
    margin: 10,               
    elevation: 4,
    width:'43%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  foto: {
    width: '100%',
    height: 140,
    borderRadius: 10,
  },
  nomeproduto: {
    textAlign: "center",
    color: '#333333',       
    fontSize: 10,            
    fontWeight: '600',       
    marginTop: 8,
  },
  areapreco: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  precoproduto: {
    color: '#feb600',        
    fontSize: 18,
    fontWeight: 'bold',
  },
  botao: {
    backgroundColor: '#004cff',
    width: 34,
    height: 34,
    borderRadius: 10,           
    justifyContent: 'center',
    alignItems: 'center',
  },
  textobotao: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 24,           
  }
});