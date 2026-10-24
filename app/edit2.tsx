
import { Text, View, StyleSheet,TextInput, TouchableOpacity } from 'react-native'
import { showAlert } from '@/lib/alert';
import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import { LIPatualizarPerfil, LIPobterPerfil } from '@/constants/userStore'

export default function LIPedit2(){
    const { session } = useAuth()

    const[LIPtelnovo, setLIPtelnovo]=useState<string>('')
    const[LIPtelatual, setLIPtelatual]=useState<string>('')
    useFocusEffect(
      useCallback(() => {
        async function LIPcarregarTelefone() {
          try {
            const LIPperfil = session ? await LIPobterPerfil(session) : null
            setLIPtelatual(LIPperfil?.telefone ?? '')
          } catch (error) {
            console.error('Erro ao carregar telefone:', error)
            showAlert('Erro', 'Não foi possível carregar o telefone salvo.')
          }
        }

        LIPcarregarTelefone()
      }, [session])
    )

    const LIPnovotel = async () => {
  
  if (LIPtelnovo.trim() === '') {
    
    showAlert('Aviso', 'Nada foi digitado!');
    return
  }

  try {
    const LIPtelefoneLimpo = LIPtelnovo.trim()
    if (!session) {
      throw new Error('É necessário entrar na conta para atualizar o telefone.')
    }
    await LIPatualizarPerfil(session, { telefone: LIPtelefoneLimpo })
    setLIPtelatual(LIPtelefoneLimpo)
    setLIPtelnovo('')
    showAlert('Sucesso', 'Telefone salvo com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar telefone:', error)
    showAlert('Erro', 'Não foi possível salvar o telefone.')
  }
};
return(
    <View style={styles.containersuperior}>
        <View style={styles.xd2}>
      <Text style={styles.texto}>Telefone atual:</Text>
      <Text style={{flex:1, flexWrap:'wrap'}}>{LIPtelatual}</Text>
      </View>
      <View style={styles.xd2}>
        <Text style={styles.texto}>Alterar telefone:</Text>
        <TextInput onChangeText={setLIPtelnovo} 
        value={LIPtelnovo} 
        placeholder="Digite o telefone aqui."
         multiline={true}
         style={{flex:1}}/>
      </View>
      <View style={styles.botaoxd}>
        <TouchableOpacity  onPress={LIPnovotel}style={styles.botao}>
        <Text style={styles.textobotao}>Salvar Telefone</Text>
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
    fontFamily:"bold"

 },
 botaoxd:{
 flexDirection:"row",
 justifyContent:"center"


 }



})