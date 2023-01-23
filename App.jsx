import React ,{useState}from "react" ;
import {View , Text, StyleSheet, TextInput,ImageBackground,Button,Alert,TouchableOpacity,NativeAppEventEmitter } from "react-native" ;
import BleManager from 'react-native-ble-manager';


const image = {uri :"https://wallpapercave.com/wp/wp7134007.jpg"}
const App =()=>{

   const [username , setUsername] = useState("")
   const [password , setPassword] = useState("")
   const [screen1 , setScreen1] = useState(true)
   const [screen2 , setScreen2] = useState(false)
   const [screen3 , setScreen3] = useState(false)
   const [availableDevices , setAvailableDevices] = useState([])
   const map = new Map()
   function scanBluetoothDevices (){
    setScreen1(false)
    setScreen2(true)
    NativeAppEventEmitter.addListener("BleManagerDiscoverPeripheral",(data)=>{
       
      
      
       setAvailableDevices(prev => {
        return [...prev,data.id]
       })
    })
    BleManager.start({showAlert:false});
    BleManager.scan([],5,false)
   }
  console.log(map)
   function screen3Handler(){
    setScreen2(false)
    setScreen3(true)
   }
    return <View
    style={{
        flex : 1 ,
        justifyContent : "center",
        alignItems :"center",
       // backgroundColor :"skyblue",
    }}
    >
       
       <ImageBackground
       src={"https://www.pngitem.com/pimgs/m/5-57881_abstract-grey-background-png-transparent-png.png"}
       resizeMode="cover"
       style={{
        flex: 1,
        width:"100%",
        heigth:"100%",
        justifyContent: 'center',
        alignItems:"center",
       }}
       >
      {screen1 && <View style={{
            width:"100%",
            height:"100%",
            flexDirection : "column" ,
            justifyContent:"center",
            alignItems:"center"
        }}>
        <Text
        style={{
            color :"#2a2a2a",
            fontSize: 20,
        }}
        >please enable your bluetooth device</Text>
        <TouchableOpacity
         style={{
            width:"80%",
            backgroundColor:"#818589",
            paddingVertical:10,
            borderRadius:5,
            marginTop:70,
            justifyContent:"center",
            alignItems:"center",

            
           }}
           onPress={scanBluetoothDevices}
        >
            <Text
             style={
                {
                    color:"white",
                    fontWeight:"600",
                    fontSize:20,
                }
            }
            >okay</Text>
        </TouchableOpacity>
        </View>
}
{screen2 && <View
style={{
    width: "80%",
    padding:20,
    justifyContent:"center",
    alignItems: "center",
    borderWidth:1,
    borderColor:"#2a2a2a",
    borderStyle:"solid",
    borderRadius:5,
   }}>
    {availableDevices.map(device => {
        return <TouchableOpacity
        key={device}
        id={device}
        style={{
         width: "80%" ,
         paddingVertical:10,
         justifyContent:"center",
         alignItems:"center",
        }}
        onPress={screen3Handler}
        >
            <Text
            style={{
             color:"#2a2a2a"   ,
             fontWeight:600,
             fontSize:20,
            }}
            >{device}</Text>
        </TouchableOpacity>
    })}
    </View>}
          {screen3 && <View style={{
            width: "100%",
            
            justifyContent:"center",
            alignItems: "center"
           }}>
           <TextInput
           style={
            {
            borderColor : "black",
            borderBottomWidth : 1,
            width:"80%",
            paddingBottom : 10,

            }
           }
           placeholder="Username"
           onChangeText={text => setUsername(text)}
           ></TextInput>
       
        
           <TextInput
           style={
            {
            borderColor : "black",
            borderBottomWidth : 1,
            width:"80%",
            marginBottom:10,

            }
           }
           placeholder="password"
           onChangeText={text => setPassword(text)}
           ></TextInput>
          
           <TouchableOpacity
           
           style={{
            width:"80%",
            backgroundColor:"#818589",
            paddingVertical:10,
            borderRadius:5,
            
            justifyContent:"center",
            alignItems:"center",

            
           }}
           onPress={()=>Alert.alert(username ,password)}
           >
            <Text
            style={
                {
                    color:"white",
                    fontWeight:"600"
                }
            }
            >GET STARTED</Text>
           </TouchableOpacity>
           </View>}
       
       </ImageBackground>
    </View>
}

const styles = StyleSheet.create({
    container :{
        padding : 10,
        backgroundColor :"powerBlue"
    },
   
})

export default App