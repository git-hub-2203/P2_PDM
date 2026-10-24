import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

const LIP_PHOTO_KEY_PREFIX = '@LIP_foto_perfil:';

async function LIPcriarChaveFoto(LIPemail: string): Promise<string> {
  const LIPemailNormalizado = LIPemail.trim().toLocaleLowerCase();
  const LIPhash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    LIPemailNormalizado
  );
  return `${LIP_PHOTO_KEY_PREFIX}${LIPhash}`;
}

export async function LIPcarregarFotoPerfil(LIPemail: string): Promise<string | null> {
  return AsyncStorage.getItem(await LIPcriarChaveFoto(LIPemail));
}

export async function LIPsalvarFotoPerfil(
  LIPemail: string,
  LIPuriOriginal: string,
  LIPbase64?: string | null,
  LIPmimeType?: string | null
): Promise<string> {
  const LIPchave = await LIPcriarChaveFoto(LIPemail);

  if (Platform.OS === 'web') {
    if (!LIPbase64) {
      throw new Error('O navegador não retornou os dados da imagem selecionada.');
    }

    const LIPtipo = LIPmimeType || 'image/jpeg';
    const LIPdataUrl = `data:${LIPtipo};base64,${LIPbase64}`;
    await AsyncStorage.setItem(LIPchave, LIPdataUrl);
    return LIPdataUrl;
  }

  const { File, Paths } = await import('expo-file-system');
  const LIPid = Crypto.randomUUID();
  const LIPextensao = LIPmimeType === 'image/png' ? 'png' : 'jpg';
  const LIParquivoDestino = new File(
    Paths.document,
    `perfil-${LIPid}.${LIPextensao}`
  );

  await new File(LIPuriOriginal).copy(LIParquivoDestino);
  await AsyncStorage.setItem(LIPchave, LIParquivoDestino.uri);
  return LIParquivoDestino.uri;
}
