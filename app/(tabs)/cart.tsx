import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from 'expo-router';
import FallbackIcon from '@/components/FallbackIcon';
import { LIPCartItem, LIPloadCart, LIPsaveCart } from '@/constants/cart';
import { showAlert } from '@/lib/alert';
import Colors from '@/constants/Colors';

export default function LIPCartScreen() {
  const [LIPcartItems, setLIPCartItems] = useState<LIPCartItem[]>([]);
  const [LIPmsg, setLIPmsg] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      async function LIPloadCarrinho() {
        try {
          setLIPCartItems(await LIPloadCart());
        } catch (error) {
          console.error('Erro ao carregar carrinho:', error);
          showAlert('Erro', 'Não foi possível carregar o carrinho.');
        }
      }
      LIPloadCarrinho();
    }, [])
  );

  const LIPsaveCarrinho = async (LIPnovaLista: LIPCartItem[]) => {
    try {
      await LIPsaveCart(LIPnovaLista);
      setLIPCartItems(LIPnovaLista);
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
      showAlert('Erro', 'Não foi possível atualizar o carrinho.');
    }
  };

  const LIPupdateQuantity = (LIPid: string, LIPSsize: string | undefined, LIPvar: number) => {
    const LIPlistaAtualizada = LIPcartItems.map((LIPitem) => {
      if (LIPitem.LIPid === LIPid && (LIPitem.LIPSsize ?? 'M') === (LIPSsize ?? 'M')) {
        const LIPnewQnt = LIPitem.LIPqnt + LIPvar;
        return LIPnewQnt > 0 ? { ...LIPitem, LIPqnt: LIPnewQnt } : LIPitem;
      }
      return LIPitem;
    });

    LIPsaveCarrinho(LIPlistaAtualizada);
  };


  const LIPremoveItem = (LIPid: string, LIPSsize: string | undefined) => {
    const LIPlistaAtualizada = LIPcartItems.filter(
      (LIPitem) =>
        LIPitem.LIPid !== LIPid || (LIPitem.LIPSsize ?? 'M') !== (LIPSsize ?? 'M')
    );
    LIPsaveCarrinho(LIPlistaAtualizada);
  };

  const LIPfinalizarPedido = async () => {
    try {
      await LIPsaveCart([]);
      setLIPCartItems([]);
      setLIPmsg('Pedido finalizado com sucesso!');

      setTimeout(() => {
        setLIPmsg('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      showAlert('Erro', 'Não foi possível finalizar o pedido.');
    }
  };

  const LIPtotal = LIPcartItems.reduce((LIPsum, LIPitem) => LIPsum + LIPitem.LIPprice * LIPitem.LIPqnt, 0);

  return (
    <View style={LIPstyles.container}>
      {LIPcartItems.length === 0 ? (
        <View style={LIPstyles.ContainerVazio}>
          <View style={LIPstyles.emptyIcon}>
            <FallbackIcon name="shopping-cart" size={34} color={Colors.light.primaryDark} />
          </View>
          <Text style={LIPstyles.emptyTitle}>Seu carrinho está esperando</Text>
          <Text style={LIPstyles.TextVazio}>Encontre uma peça especial no catálogo e ela aparece por aqui.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={LIPcartItems}
            keyExtractor={(LIPitem) => `${LIPitem.LIPid}-${LIPitem.LIPSsize ?? 'M'}`}
            contentContainerStyle={LIPstyles.listContent}
            renderItem={({ item: LIPitem }) => (
              <View style={LIPstyles.card}>
                <Image source={{ uri: LIPitem.LIPimage }} style={LIPstyles.image} />
                <View style={LIPstyles.info}>
                  <Text style={LIPstyles.itemName}>{LIPitem.LIPname}</Text>
                  <Text style={LIPstyles.itemSize}>Tam: {LIPitem.LIPSsize || 'M'}</Text>

                  <View style={LIPstyles.controls}>
                    <TouchableOpacity
                      onPress={() => LIPupdateQuantity(LIPitem.LIPid, LIPitem.LIPSsize, -1)}
                      style={LIPstyles.btnQty}
                    >
                      <Text style={LIPstyles.btnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={LIPstyles.qtyText}>{LIPitem.LIPqnt}</Text>
                    <TouchableOpacity
                      onPress={() => LIPupdateQuantity(LIPitem.LIPid, LIPitem.LIPSsize, 1)}
                      style={LIPstyles.btnQty}
                    >
                      <Text style={LIPstyles.btnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => LIPremoveItem(LIPitem.LIPid, LIPitem.LIPSsize)}
                  style={LIPstyles.btnRemove}
                >
                  <FallbackIcon name="trash" size={24} color="#e03131" />
                </TouchableOpacity>

                <Text style={LIPstyles.itemPrice}>
                  R$ {(LIPitem.LIPprice * LIPitem.LIPqnt).toFixed(2)}
                </Text>
              </View>
            )}
          />

          <View style={LIPstyles.footer}>
            <View style={LIPstyles.totallinha}>
              <Text style={LIPstyles.totalLabel}>Total:</Text>
              <Text style={LIPstyles.totalValor}>R$ {LIPtotal.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={LIPstyles.checkbtn} onPress={LIPfinalizarPedido}>
              <Text style={LIPstyles.Btncomprar}>Finalizar Pedido</Text>
            </TouchableOpacity>

            {LIPmsg !== '' && <Text style={LIPstyles.LIPsucessoText}>{LIPmsg}</Text>}
          </View>
        </>
      )}
    </View>
  );
}

const LIPstyles = StyleSheet.create({

  container: { 
   flex: 1,
   backgroundColor: Colors.light.background,
    },

  ContainerVazio: { 
  flex: 1, 
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 28,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: Colors.light.sage,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 19,
    color: Colors.light.text,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 7,
     },

  TextVazio: {
   fontSize: 14,
   color: Colors.light.textMuted,
   alignSelf: 'center', 
   textAlign: 'center', 
   paddingHorizontal: 20 
  },

  listContent: { 
    padding: 16 
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.border,
    position: 'relative',
  },
  image: { 
  width: 70, 
  height: 70, 
  borderRadius: 6, 
  backgroundColor: Colors.light.surfaceMuted
 },

  info: { 
  flex: 1,
  marginLeft: 12

   },

  itemName: { 
  fontSize: 16, 
  fontWeight: 'bold', 
  color: Colors.light.text
   },
  itemSize: { 
  fontSize: 13, 
  color: Colors.light.textMuted,
  marginTop: 2 
  },

  itemPrice: { 
  fontSize: 20, 
  fontWeight: '600', 
  color: Colors.light.primaryDark,
  marginTop: 4, 
  position: 'absolute', 
  right: 10, 
  bottom: 10
  },

  controls: { 
  flexDirection: 'row', 
  alignItems: 'center', 
  marginTop: 8, 
  gap: 10 
},

  btnQty: {
    width: 28,
    height: 28,
    backgroundColor: Colors.light.surfaceMuted,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
  fontSize: 16, 
  fontWeight: 'bold', 
  color: Colors.light.primaryDark },
  qtyText: { 
  fontSize: 14, 
  fontWeight: 'bold' },

  btnRemove: { 
    marginLeft: 'auto'
   },

  footer: {
    backgroundColor: Colors.light.surface,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },

  totallinha: {
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  marginBottom: 16 
},

  totalLabel: { fontSize: 18, 
  color: Colors.light.textMuted,
},

  totalValor: { 
  fontSize: 22, 
  fontWeight: 'bold', 
  color: Colors.light.text
 },

  checkbtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  Btncomprar: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  LIPsucessoText: { color: Colors.light.primaryDark, fontSize: 15, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
});