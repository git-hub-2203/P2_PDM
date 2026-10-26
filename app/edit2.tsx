
import { Text, View, StyleSheet,TextInput, TouchableOpacity } from 'react-native'
import { showAlert } from '@/lib/alert';
import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import { LIPatualizarPerfil, LIPobterPerfil } from '@/constants/userStore'
import Colors from '@/constants/Colors'

export default function LIPedit2(){
    const { session: LIPsession } = useAuth()

    const[LIPtelnovo, setLIPtelnovo]=useState<string>('')
    const[LIPtelatual, setLIPtelatual]=useState<string>('')
    useFocusEffect(
      useCallback(() => {
        async function LIPcarregarTelefone() {
          try {
            const LIPperfil = LIPsession ? await LIPobterPerfil(LIPsession) : null
            setLIPtelatual(LIPperfil?.telefone ?? '')
          } catch (error) {
            console.error('Erro ao carregar telefone:', error)
            showAlert('Erro', 'Não foi possível carregar o telefone salvo.')
          }
        }

        LIPcarregarTelefone()
      }, [LIPsession])
    )

    const LIPnovotel = async () => {
  
  if (LIPtelnovo.trim() === '') {
    
    showAlert('Aviso', 'Nada foi digitado!');
    return
  }

  try {
    const LIPtelefoneLimpo = LIPtelnovo.trim()
    if (!LIPsession) {
      throw new Error('É necessário entrar na conta para atualizar o telefone.')
    }
    await LIPatualizarPerfil(LIPsession, { telefone: LIPtelefoneLimpo })
    setLIPtelatual(LIPtelefoneLimpo)
    setLIPtelnovo('')
    showAlert('Sucesso', 'Telefone salvo com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar telefone:', error)
    showAlert('Erro', 'Não foi possível salvar o telefone.')
  }
};
return(
    <View style={LIPstyles.containersuperior}>
        <View style={LIPstyles.xd2}>
      <Text style={LIPstyles.texto}>Telefone atual:</Text>
      <Text style={LIPstyles.valorAtual}>{LIPtelatual || 'Nenhum telefone salvo'}</Text>
      </View>
      <View style={LIPstyles.xd2}>
        <Text style={LIPstyles.texto}>Alterar telefone:</Text>
        <TextInput onChangeText={setLIPtelnovo} 
        value={LIPtelnovo} 
        placeholder="Digite o telefone aqui."
         multiline={true}
         style={LIPstyles.input}
         placeholderTextColor={Colors.light.textMuted}/>
      </View>
      <View style={LIPstyles.botaoxd}>
        <TouchableOpacity  onPress={LIPnovotel}style={LIPstyles.botao}>
        <Text style={LIPstyles.textobotao}>Salvar Telefone</Text>
      </TouchableOpacity>
      </View>
      
    </View>
    
)


}
const LIPstyles= StyleSheet.create({
 texto:{
    fontSize:14,
    color:Colors.light.text,
    fontWeight:'600',
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