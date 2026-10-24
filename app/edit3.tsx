
import { Text, View, StyleSheet,TextInput, TouchableOpacity, Alert} from 'react-native'
import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import { LIPatualizarPerfil, LIPobterPerfil } from '@/constants/userStore'

export default function LIPedit3(){
    const { session } = useAuth()

    const[LIPpagnovo, setLIPpagnovo]=useState<string>('')
    const[LIPpagatual, setLIPpagatual]=useState<string>('')

    useFocusEffect(
      useCallback(() => {
        async function LIPcarregarCartao() {
          try {
            const LIPperfil = session ? await LIPobterPerfil(session) : null
            setLIPpagatual(LIPperfil?.cartaoFinal ?? '')
          } catch (error) {
            console.error('Erro ao carregar final do cartão:', error)
            Alert.alert('Erro', 'Não foi possível carregar o cartão salvo.')
          }
        }

        LIPcarregarCartao()
      }, [session])
    )

   const LIPnovopag = async () => {
  
  const LIPdigitosCartao = LIPpagnovo.replace(/\D/g, '')
  if (LIPdigitosCartao.length < 4) {

    Alert.alert('Aviso', 'Digite pelo menos os quatro últimos dígitos do cartão.')
    return
  }

  try {
    const LIPultimosDigitos = LIPdigitosCartao.slice(-4)
    if (!session) {
      throw new Error('É necessário entrar na conta para atualizar o pagamento.')
    }
    await LIPatualizarPerfil(session, { cartaoFinal: LIPultimosDigitos })
    setLIPpagatual(LIPultimosDigitos)
    setLIPpagnovo('');
    Alert.alert('Sucesso', 'Final do cartão salvo com segurança.')
  } catch (error) {
    console.error('Erro ao salvar final do cartão:', error)
    Alert.alert('Erro', 'Não foi possível salvar o cartão.')
  }
};
return(
    <View style={styles.containersuperior}>
        <View style={styles.xd2}>
      <Text style={styles.texto}>Cartão atual:</Text>
      <Text style={{flex:1, flexWrap:'wrap'}}>•••• •••• •••• {LIPpagatual}</Text>
      </View>
      <View style={styles.xd2}>
        <Text style={styles.texto}>Alterar Número do cartão:</Text>
        <TextInput onChangeText={setLIPpagnovo} 
        value={LIPpagnovo} 
        placeholder="Digite o Número do Cartão  aqui."
         keyboardType="number-pad"
         secureTextEntry
         style={{flex:1}}/>
      </View>
      <View style={styles.botaoxd}>
        <TouchableOpacity  onPress={LIPnovopag}style={styles.botao}>
        <Text style={styles.textobotao}>Salvar Cartão</Text>
      </TouchableOpacity>
      </View>
      
    </View>
    
)


}
const styles= StyleSheet.create({
 texto:{
    fontSize:15,
    marginRight:30,



 },
 containersuperior:{
    flexDirection:"column",


 },
 xd2:{
 flexDirection: "row",
 margin:30,
 alignItems:"center"

 },
 botao:{
  flexDirection:"row",
  justifyContent:"center",
  backgroundColor:"#172b6e",
  height: 50,
  width: 200,
  borderRadius: 6,
 },
 textobotao:{
    color:"#fff",
    margin:10,
    fontWeight:"bold"

 },
 botaoxd:{
 flexDirection:"row",
 justifyContent:"center"


 }



})