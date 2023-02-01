import React ,{useState,useEffect}from "react" ;
import {View , Text, StyleSheet, TextInput,ImageBackground,Button,Alert,TouchableOpacity,NativeAppEventEmitter,NativeEventEmitter,NativeModules,FlatList,ActivityIndicator,ScrollView } from "react-native" ;
import BleManager from 'react-native-ble-manager';


const image = {uri :"https://wallpapercave.com/wp/wp7134007.jpg"}
const BleManagerModule = NativeModules.BleManager ;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)
const peripherals = new Map()
const App =()=>{

   const [username , setUsername] = useState("")
   const [password , setPassword] = useState("")
   const [screen1 , setScreen1] = useState(true)
   const [screen2 , setScreen2] = useState(false)
   const [screen3 , setScreen3] = useState(false)
   const [availableDevices , setAvailableDevices] = useState([])
   const [serviceList , setServiceList] = useState([])
   const [screen4 ,setScreen4] = useState(false)
   
  // let peripherals = new Map();


  useEffect(()=>{
    BleManager.start({showAlert:false});
    BleManager.scan([],30,false)
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic',handleUpdateValueForCharacteristic)
   
  },[])

  function handleUpdateValueForCharacteristic(data){
    console.log(data)
    let val = data.value.pop()
    console.log(val)
    Alert.alert(val.toString())
   
  }

   function ScanBluetoothDevices (){
  setScreen1(false)
  setScreen2(true)
  
   
    //  bleManagerEmitter.addListener("BleManagerDiscoverPeripheral",(data)=>{
       
    //  console.log(data) 
      
    //    setAvailableDevices(prev => {
    //     return [...prev,data.id]
    //    })
    // })
  
  // BleManager.scan([],5,false)
  BleManager.getDiscoveredPeripherals([]).then(data =>{
    let length = data.length;
   
   for(let i=0 ;i<=length-1 ; i++){
   console.log(data[i].id)
   console.log(data[i].name)
   
   if( data[i].name === null){
    data[i].name = "no name"
   }
    peripherals.set(data[i].id ,data[i])
 
   }
    
  setAvailableDevices(Array.from(peripherals.values()))
 
})
  
   }

   
    

  
    const  screen3Handler =  (device) => {
   
    const id = device.id
   

    BleManager.connect(id).then(()=>{
        console.log("connected")
        BleManager.retrieveServices(id).then(data => {
            console.log(data)
            let characteristicsARR = data.characteristics;
            for(let i=0;i<characteristicsARR.length;i++){
             setServiceList(prev => [...prev , {
                 c : characteristicsARR[i].characteristic,
                 p : characteristicsARR[i].properties,
                 s:characteristicsARR[i].service,
                 id:data.id
     
             }])
            }
        }).catch(error => console.log(error))
    }).catch(error => console.log(error))
   setTimeout(()=>{
    setScreen2(false)
    setScreen3(true)
})
   }

   

   function startNotificationHandler(id , SU="180f" , CU="2a19"){
    console.log(id)
    BleManager.startNotification(id,SU,CU).then(() =>{
        console.log("notification  started")
    }).catch(error => console.log(error))
    console.log(serviceList)
   }
  
    return <View
    style={{
        flex : 1 ,
        justifyContent : "center",
        alignItems :"center",
      
    }}
    >
       
       <View
    
       style={{
        flex: 1,
        width:"100%",
        heigth:"100%",
        justifyContent: 'center',
        alignItems:"center",
        paddingHorizontal: 20,
        paddingVertical:25,
       }}
       >
       
      {screen1 && <View style={{
            width:"100%",
            height:"100%",
            flexDirection : "column" ,
           
            alignItems:"center",
            justifyContent:"space-between"
        }}>
        <Text
        style={{
            color :"#2a2a2a",
            fontSize: 20,
            marginTop:150,
        }}
        >Please enable bluetooth of your device</Text>
         <TouchableOpacity
         style={{
            width:"100%",
            backgroundColor:"#188b8b",
            paddingVertical:10,
            borderRadius:5,
           
            justifyContent:"center",
            alignItems:"center",

            
           }}
           onPress={ScanBluetoothDevices}
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
    width: "100%",
    flex:1,
    justifyContent:"center",
    alignItems: "center",
   
   }}>
    
    
    {!availableDevices.length>0 && <ActivityIndicator size="large" color="#188b8b"/>}
    {availableDevices.length>0 && < View
    style={{
        width:'100%',
        height:'100%',
        flex:1,
        justifyContent:'center',
        alignItems:"center",
        position:"relative"
    }}
    >
        <Text
        style={{
            fontSize:20,
            fontWeight:400,
            color : "#188b8b",
            position:"absolute",
            top:20
        }}
        >Select device to connect</Text>
       
       <ScrollView
    style={{
        width: "100%",
        flex:1,
        marginTop:100,
       
        
       
       }}
       contentContainerStyle={{
        justifyContent:"center",
        alignItems: "center",
       }}
       persistentScrollbar={true}       >
        {availableDevices.map(device => {
        return <TouchableOpacity
        key={device}

        style={{
         width: "100%" ,
         height:100,
         borderBottomWidth:2,
         borderBottomColor:"#188b8b",
         borderStyle:"solid",
         paddingHorizontal:10,
         marginBottom:15,
         flexDirection:'column',
         justifyContent:"center",
         alignItems:"center",
         
        
        }}
        onPress={()=>{screen3Handler(device)}}
        >
            <View
            style={{
                width:'100%',
                height:'100%',
                flex:1,
                flexDirection:'column' ,
                alignItems:'flex-start',
                justifyContent:'center',
               // marginBottom:10,
            }}
            >
           <Text
           
            style={{
             color:"#74b9b9"   ,
            // marginBottom:4,
             fontSize:10,
            }}
            >Device Name</Text>
            <Text
            
            style={{
             color:"#188b8b"   ,
             
             fontSize:15,
            }}
            >{device.name}</Text>

            </View>
            <View
            style={{
                width:'100%',
                height:'100%',
                flex:1,
                flexDirection:'column' ,
                alignItems:'flex-start',
                justifyContent:'center',
              
            }}
            >
           <Text
           
            style={{
             color:"#74b9b9"   ,
             //marginBottom:4,
             fontSize:10,
            }}
            >Device ID</Text>
            <Text
            
            style={{
             color:"#188b8b"   ,
             
             fontSize:15,
            }}
            >{device.id}</Text>

            </View>
            
        </TouchableOpacity>
       
       
        
    })}
        </ScrollView>
        </View>}
    
        
    </View>}
    {screen3 && <View
    style={{
        flex:1,
        justifyContent:'center',
        alignContent:"center",
        width:"100%",
        height:'100%',
        position:"relative"
    }}
    >
         
         {!serviceList.length>0 && <ActivityIndicator size="large"/>}
          {serviceList.length > 0 && < View
    style={{
        width:'100%',
        height:'100%',
        flex:1,
        justifyContent:'center',
        alignItems:"center",
        position:"relative"
    }}
    >
        <Text
        style={{
            fontSize:20,
            fontWeight:400,
            color : "#188b8b",
            position:"absolute",
            top:20
        }}
        >Select service to subscribe</Text>
       
       <ScrollView
    style={{
        width: "100%",
        flex:1,
        marginTop:100,
       
        
       
       }}
       contentContainerStyle={{
        justifyContent:"center",
        alignItems: "center",
       }}
       persistentScrollbar={true}       >
           
        {serviceList.map(service => {
            return <TouchableOpacity
            style={{
               flex:1,
               width:'100%',
               paddingBottom: 2,
                flexDirection:'column',
                borderBottomWidth: 1,
                borderBottomColor : "#188b8b" ,
                marginBottom :20 ,
               
                
                
            }}
            onPress={()=>{startNotificationHandler(service.id)}}
            >
                <Text
                style={{
                    color : "#74b9b9",
                    fontSize : 15,
                   
                     
                }}
                >{"Characteristic UUID :"+" "+service.c}</Text>
               
                <Text
                 style={{
                    color : "#74b9b9",
                    fontSize : 15,
                   
                }}
                >{"Service UUID :"+" "+service.s}</Text>
            </TouchableOpacity>
        })}
       
          
        </ScrollView> 
        </View>
        
        }      
        
        </View>}
          {screen4 && <View style={{
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
          
       
       </View>
      
    </View>
}

const styles = StyleSheet.create({
    container :{
        padding : 10,
        backgroundColor :"powerBlue"
    },
   
})

export default App