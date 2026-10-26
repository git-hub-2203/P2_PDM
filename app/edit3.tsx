
import { Text, View, StyleSheet,TextInput, TouchableOpacity } from 'react-native'
import { showAlert } from '@/lib/alert';
import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import { LIPatualizarPerfil, LIPobterPerfil } from '@/constants/userStore'
import Colors from '@/constants/Colors'

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
      <Text style={LIPstyles.valorAtual}>
        {LIPpagatual ? `•••• •••• •••• ${LIPpagatual}` : 'Nenhum cartão salvo'}
      </Text>
      </View>
      <View style={LIPstyles.xd2}>
        <Text style={LIPstyles.texto}>Alterar Número do cartão:</Text>
        <TextInput onChangeText={setLIPpagnovo} 
        value={LIPpagnovo} 
        placeholder="Digite o Número do Cartão  aqui."
         keyboardType="number-pad"
         secureTextEntry
         style={LIPstyles.input}
         placeholderTextColor={Colors.light.textMuted}/>
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
    fontSize:14,
    color:Colors.light.text,
    fontWeight:"600",
    marginBottom:8,
 },
 containersuperior:{
    flex:1,
    flexDirection:"column",
    backgroundColor:Colors.light.background,
    padding:20,
 },
 xd2:{
 flexDirection: "column",
 backgroundColor:Colors.light.surface,
 marginBottom:16,
 padding:18,
 borderRadius:18,
 borderWidth:1,
 borderColor:Colors.light.border,
 },
 valorAtual:{
  color:Colors.light.textMuted,
  fontSize:15,
  lineHeight:21,
 },
 input:{
  minHeight:54,
  borderWidth:1,
  borderColor:Colors.light.border,
  borderRadius:12,
  paddingHorizontal:13,
  paddingVertical:12,
  color:Colors.light.text,
  backgroundColor:Colors.light.background,
 },
 botao:{
  justifyContent:"center",
  alignItems:"center",
  backgroundColor:Colors.light.primary,
  height: 50,
  width: "100%",
  borderRadius: 14,
 },
 textobotao:{
    color:"#fff",
    fontWeight:"bold"

 },
 botaoxd:{
  marginTop:6,
 }



})