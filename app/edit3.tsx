
import { Text, View, StyleSheet,TextInput, TouchableOpacity } from 'react-native'
import { showAlert } from '@/lib/alert';
import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import { LIPatualizarPerfil, LIPobterPerfil } from '@/constants/userStore'

export default function LIPedit3(){
    const { session: LIPsession } = useAuth()

    const[LIPpagnovo, setLIPpagnovo]=useState<string>('')
    const[LIPpagatual, setLIPpagatual]=useState<string>('')

    useFocusEffect(
      useCallback(() => {
        async function LIPcarregarCartao() {
          try {
            const LIPperfil = LIPsession ? await LIPobterPerfil(LIPsession) : null
            setLIPpagatual(LIPperfil?.cartaoFinal ?? '')
          } catch (error) {
            console.error('Erro ao carregar final do cartão:', error)
            showAlert('Erro', 'Não foi possível carregar o cartão salvo.')
          }
        }

        LIPcarregarCartao()
      }, [LIPsession])
    )

   const LIPnovopag = async () => {
  
  const LIPdigitosCartao = LIPpagnovo.replace(/\D/g, '')
  if (LIPdigitosCartao.length < 4) {

    showAlert('Aviso', 'Digite pelo menos os quatro últimos dígitos do cartão.')
    return
  }

  try {
    const LIPultimosDigitos = LIPdigitosCartao.slice(-4)
    if (!LIPsession) {
      throw new Error('É necessário entrar na conta para atualizar o pagamento.')
    }
    await LIPatualizarPerfil(LIPsession, { cartaoFinal: LIPultimosDigitos })
    setLIPpagatual(LIPultimosDigitos)
    setLIPpagnovo('');
    showAlert('Sucesso', 'Final do cartão salvo com segurança.')
  } catch (error) {
    console.error('Erro ao salvar final do cartão:', error)
    showAlert('Erro', 'Não foi possível salvar o cartão.')
  }
};
return(
    <View style={LIPstyles.containersuperior}>
        <View style={LIPstyles.xd2}>
      <Text style={LIPstyles.texto}>Cartão atual:</Text>
      <Text style={{flex:1, flexWrap:'wrap'}}>•••• •••• •••• {LIPpagatual}</Text>
      </View>
      <View style={LIPstyles.xd2}>
        <Text style={LIPstyles.texto}>Alterar Número do cartão:</Text>
        <TextInput onChangeText={setLIPpagnovo} 
        value={LIPpagnovo} 
        placeholder="Digite o Número do Cartão  aqui."
         keyboardType="number-pad"
         secureTextEntry
         style={{flex:1}}/>
      </View>
      <View style={LIPstyles.botaoxd}>
        <TouchableOpacity  onPress={LIPnovopag}style={LIPstyles.botao}>
        <Text style={LIPstyles.textobotao}>Salvar Cartão</Text>
      </TouchableOpacity>
      </View>
      
    </View>
    
)


}
const LIPstyles= StyleSheet.create({
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