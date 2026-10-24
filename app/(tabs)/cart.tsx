import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from 'expo-router';
import FallbackIcon from '@/components/FallbackIcon';
import { LIPCartItem, LIPloadCart, LIPsaveCart } from '@/constants/cart';
import { showAlert } from '@/lib/alert';

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

  const total = LIPcartItems.reduce((sum, LIPitem) => sum + LIPitem.LIPprice * LIPitem.LIPqnt, 0);

  return (
    <View style={styles.container}>
      {LIPcartItems.length === 0 ? (
        <View style={styles.ContainerVazio}>
          <Text style={styles.TextVazio}>O seu carrinho está vazio. Vá ao catálogo para enchê-lo.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={LIPcartItems}
            keyExtractor={(LIPitem) => `${LIPitem.LIPid}-${LIPitem.LIPSsize ?? 'M'}`}
            contentContainerStyle={styles.listContent}
            renderItem={({ item: LIPitem }) => (
              <View style={styles.card}>
                <Image source={{ uri: LIPitem.LIPimage }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.itemName}>{LIPitem.LIPname}</Text>
                  <Text style={styles.itemSize}>Tam: {LIPitem.LIPSsize || 'M'}</Text>

                  <View style={styles.controls}>
                    <TouchableOpacity
                      onPress={() => LIPupdateQuantity(LIPitem.LIPid, LIPitem.LIPSsize, -1)}
                      style={styles.btnQty}
                    >
                      <Text style={styles.btnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{LIPitem.LIPqnt}</Text>
                    <TouchableOpacity
                      onPress={() => LIPupdateQuantity(LIPitem.LIPid, LIPitem.LIPSsize, 1)}
                      style={styles.btnQty}
                    >
                      <Text style={styles.btnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => LIPremoveItem(LIPitem.LIPid, LIPitem.LIPSsize)}
                  style={styles.btnRemove}
                >
                  <FallbackIcon name="trash" size={24} color="#e03131" />
                </TouchableOpacity>

                <Text style={styles.itemPrice}>
                  R$ {(LIPitem.LIPprice * LIPitem.LIPqnt).toFixed(2)}
                </Text>
              </View>
            )}
          />

          <View style={styles.footer}>
            <View style={styles.totallinha}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValor}>R$ {total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.checkbtn} onPress={LIPfinalizarPedido}>
              <Text style={styles.Btncomprar}>Finalizar Pedido</Text>
            </TouchableOpacity>

            {LIPmsg !== '' && <Text style={styles.LIPsucessoText}>{LIPmsg}</Text>}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  container: { 
   flex: 1,
   backgroundColor: '#f8f9fa' 
    },

  ContainerVazio: { 
  flex: 1, 
  justifyContent: 'center',
  alignItems: 'center'
     },

  TextVazio: {
   fontSize: 15, 
   color: '#616b74', 
   alignSelf: 'center', 
   textAlign: 'center', 
   paddingHorizontal: 20 
  },

  listContent: { 
    padding: 16 
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    position: 'relative',
  },
  image: { 
  width: 70, 
  height: 70, 
  borderRadius: 6, 
  backgroundColor: '#e9ecef'
 },

  info: { 
  flex: 1,
  marginLeft: 12

   },

  itemName: { 
  fontSize: 16, 
  fontWeight: 'bold', 
  color: '#212529'
   },
  itemSize: { 
  fontSize: 13, 
  color: '#616b74', 
  marginTop: 2 
  },

  itemPrice: { 
  fontSize: 20, 
  fontWeight: '600', 
  color: '#2b8a3e', 
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
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
  fontSize: 16, 
  fontWeight: 'bold', 
  color: '#333' },
  qtyText: { 
  fontSize: 14, 
  fontWeight: 'bold' },

  btnRemove: { 
    marginLeft: 'auto'
   },

  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },

  totallinha: {
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  marginBottom: 16 
},

  totalLabel: { fontSize: 18, 
  color: '#495057' 
},

  totalValor: { 
  fontSize: 22, 
  fontWeight: 'bold', 
  color: '#212529'
 },

  checkbtn: {
    backgroundColor: '#172b6e',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  Btncomprar: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  LIPsucessoText: { color: '#2b8a3e', fontSize: 16, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
});