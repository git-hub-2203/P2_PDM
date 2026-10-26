import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LIPaddProductToCart } from '@/constants/cart';
import { showAlert } from '@/lib/alert';
import Colors from '@/constants/Colors';

interface LIPCardProdutosProps {
  LIPid: string;
  LIPname: string;
  LIPprice: number;
  LIPimage: string;
  LIPAsize: string[];
}

export default function LIPCardProdutos(props: LIPCardProdutosProps) {
  const LIProuter = useRouter();
  const LIPabrirDetalhes = () => LIProuter.push(`/produtos/${props.LIPid}`);
  const LIPadicionarAoCarrinho = async () => {
    try {
      await LIPaddProductToCart(props, props.LIPAsize[0] ?? 'M');
      showAlert('Adicionado', 'Produto adicionado ao carrinho.');
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      showAlert('Erro', 'Não foi possível adicionar o produto ao carrinho.');
    }
  };

  return (
    <View style={LIPstyles.card}>
      <TouchableOpacity
        onPress={LIPabrirDetalhes}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${props.LIPname}`}
      >
        <Image source={{ uri: props.LIPimage }} style={LIPstyles.foto} />
        <Text style={LIPstyles.nomeproduto}>{props.LIPname}</Text>
      </TouchableOpacity>

      <View style={LIPstyles.areapreco}>
        <Text style={LIPstyles.precoproduto}>R$ {props.LIPprice.toFixed(2)}</Text>
        <TouchableOpacity
          style={LIPstyles.botao}
          onPress={LIPadicionarAoCarrinho}
          accessibilityRole="button"
          accessibilityLabel={`Adicionar ${props.LIPname} ao carrinho`}
        >
          <Text style={LIPstyles.textobotao}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const LIPstyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 18,
    padding: 10,
    margin: 10,               
    elevation: 2,
    width:'43%',
    shadowColor: Colors.light.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  foto: {
    width: '100%',
    height: 140,
    borderRadius: 12,
  },
  nomeproduto: {
    textAlign: "center",
    color: Colors.light.text,
    fontSize: 13,
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
    color: Colors.light.primaryDark,
    fontSize: 15,
    fontWeight: 'bold',
  },
  botao: {
    backgroundColor: Colors.light.sage,
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textobotao: {
    color: Colors.light.primaryDark,
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 24,           
  }
});