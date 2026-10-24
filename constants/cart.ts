import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LIPProduct } from './Products';

export const LIP_CART_STORAGE_KEY = '@LIP_carrinho_compras';

export interface LIPCartItem {
  LIPid: string;
  LIPname: string;
  LIPprice: number;
  LIPimage: string;
  LIPSsize?: string;
  LIPqnt: number;
}

type LIPCartProduct = Pick<LIPProduct, 'LIPid' | 'LIPname' | 'LIPprice' | 'LIPimage'>;

export async function LIPloadCart(): Promise<LIPCartItem[]> {
  const LIPdadosSalvos = await AsyncStorage.getItem(LIP_CART_STORAGE_KEY);
  return LIPdadosSalvos ? (JSON.parse(LIPdadosSalvos) as LIPCartItem[]) : [];
}

export async function LIPsaveCart(LIPitems: LIPCartItem[]): Promise<void> {
  await AsyncStorage.setItem(LIP_CART_STORAGE_KEY, JSON.stringify(LIPitems));
}

export async function LIPaddProductToCart(
  LIPproduct: LIPCartProduct,
  LIPsize = 'M'
): Promise<void> {
  const LIPcart = await LIPloadCart();
  const LIPexistingIndex = LIPcart.findIndex(
    (LIPitem) =>
      LIPitem.LIPid === LIPproduct.LIPid &&
      (LIPitem.LIPSsize ?? 'M') === LIPsize
  );

  if (LIPexistingIndex >= 0) {
    LIPcart[LIPexistingIndex] = {
      ...LIPcart[LIPexistingIndex],
      LIPqnt: LIPcart[LIPexistingIndex].LIPqnt + 1,
    };
  } else {
    LIPcart.push({
      ...LIPproduct,
      LIPSsize: LIPsize,
      LIPqnt: 1,
    });
  }

  await LIPsaveCart(LIPcart);
}
