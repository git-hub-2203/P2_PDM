import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

export interface LIPUserProfile {
  nome: string;
  email: string;
  endereco: string;
  telefone: string;
  cartaoFinal: string;
}

interface LIPUserRecord extends LIPUserProfile {
  senhaSalt: string;
  senhaHash: string;
}

const LIP_FILE_NAME = 'usuarios.txt';
const LIP_WEB_STORAGE_KEY = '@LIP_usuarios_txt';

async function LIPlerUsuarios(): Promise<LIPUserRecord[]> {
  let LIPconteudo: string | null;

  if (Platform.OS === 'web') {
    LIPconteudo = typeof localStorage === 'undefined'
      ? null
      : localStorage.getItem(LIP_WEB_STORAGE_KEY);
  } else {
    const { File, Paths } = await import('expo-file-system');
    const LIParquivo = new File(Paths.document, LIP_FILE_NAME);
    LIPconteudo = LIParquivo.exists ? await LIParquivo.text() : null;
  }

  if (!LIPconteudo) {
    return [];
  }

  const LIPdados: unknown = JSON.parse(LIPconteudo);
  if (
    typeof LIPdados !== 'object' ||
    LIPdados === null ||
    !('usuarios' in LIPdados) ||
    !Array.isArray(LIPdados.usuarios)
  ) {
    throw new Error('O arquivo de usuários possui um formato inválido.');
  }

  return LIPdados.usuarios as LIPUserRecord[];
}

async function LIPsalvarUsuarios(LIPusuarios: LIPUserRecord[]): Promise<void> {
  const LIPconteudo = JSON.stringify({ usuarios: LIPusuarios }, null, 2);

  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') {
      throw new Error('O armazenamento local do navegador não está disponível.');
    }
    localStorage.setItem(LIP_WEB_STORAGE_KEY, LIPconteudo);
    return;
  }

  const { File, Paths } = await import('expo-file-system');
  const LIParquivo = new File(Paths.document, LIP_FILE_NAME);
  if (!LIParquivo.exists) {
    LIParquivo.create();
  }
  await LIParquivo.write(LIPconteudo);
}

function LIPnormalizarEmail(LIPemail: string): string {
  return LIPemail.trim().toLocaleLowerCase();
}

async function LIPgerarHash(LIPsenha: string, LIPsalt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${LIPsalt}:${LIPsenha}`
  );
}

export async function LIPregistrarUsuario(
  LIPdados: LIPUserProfile,
  LIPsenha: string
): Promise<void> {
  const LIPusuarios = await LIPlerUsuarios();
  const LIPemail = LIPnormalizarEmail(LIPdados.email);
  if (LIPusuarios.some((LIPusuario) => LIPnormalizarEmail(LIPusuario.email) === LIPemail)) {
    throw new Error('Já existe uma conta cadastrada com este e-mail.');
  }

  const LIPsalt = Crypto.randomUUID();
  LIPusuarios.push({
    ...LIPdados,
    email: LIPemail,
    senhaSalt: LIPsalt,
    senhaHash: await LIPgerarHash(LIPsenha, LIPsalt),
  });
  await LIPsalvarUsuarios(LIPusuarios);
}

export async function LIPvalidarLogin(
  LIPemail: string,
  LIPsenha: string
): Promise<LIPUserProfile | null> {
  const LIPemailNormalizado = LIPnormalizarEmail(LIPemail);
  const LIPusuario = (await LIPlerUsuarios()).find(
    (LIPitem) => LIPnormalizarEmail(LIPitem.email) === LIPemailNormalizado
  );
  if (!LIPusuario) {
    return null;
  }

  const LIPsenhaHash = await LIPgerarHash(LIPsenha, LIPusuario.senhaSalt);
  if (LIPsenhaHash !== LIPusuario.senhaHash) {
    return null;
  }

  return {
    nome: LIPusuario.nome,
    email: LIPusuario.email,
    endereco: LIPusuario.endereco,
    telefone: LIPusuario.telefone,
    cartaoFinal: LIPusuario.cartaoFinal,
  };
}

export async function LIPobterPerfil(LIPemail: string): Promise<LIPUserProfile | null> {
  const LIPusuario = (await LIPlerUsuarios()).find(
    (LIPitem) => LIPnormalizarEmail(LIPitem.email) === LIPnormalizarEmail(LIPemail)
  );

  if (!LIPusuario) {
    return null;
  }

  return {
    nome: LIPusuario.nome,
    email: LIPusuario.email,
    endereco: LIPusuario.endereco,
    telefone: LIPusuario.telefone,
    cartaoFinal: LIPusuario.cartaoFinal,
  };
}

export async function LIPatualizarPerfil(
  LIPemail: string,
  LIPatualizacoes: Partial<Omit<LIPUserProfile, 'email'>>
): Promise<LIPUserProfile> {
  const LIPusuarios = await LIPlerUsuarios();
  const LIPindice = LIPusuarios.findIndex(
    (LIPitem) => LIPnormalizarEmail(LIPitem.email) === LIPnormalizarEmail(LIPemail)
  );

  if (LIPindice < 0) {
    throw new Error('Não foi possível encontrar o perfil desta conta.');
  }

  LIPusuarios[LIPindice] = { ...LIPusuarios[LIPindice], ...LIPatualizacoes };
  await LIPsalvarUsuarios(LIPusuarios);

  const { senhaHash: _senhaHash, senhaSalt: _senhaSalt, ...LIPperfil } = LIPusuarios[LIPindice];
  return LIPperfil;
}
