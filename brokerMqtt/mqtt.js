const conexion = require('../database/db')
const mqtt = require ('mqtt')

var options = {
    connectTimeout : 4000,
    clientId : 'dbConexion',
    keeplive: 60,
    clean: true,
}

var WebSocket_URL = 'ws://35.198.31.198:8083/mqtt'
var broker = mqtt.connect(WebSocket_URL,options);

broker.on('connect', () => {
  console.log('Mqtt conectado por WS')

  broker.subscribe("+/#", function(err){
    console.log("Suscripcion exitosa a todos los topicos")
  })
});

broker.on('message',function(topic,message){
  console.log("Topico: "+ topic + " / Mensaje: " + message.toString())
  
  let query = "INSERT INTO `data` (`topic`, `mensaje`) VALUES ('" + topic + "','" +message.toString() + "')"

  if (topic == '$SYS/brokers/emqx@127.0.0.1/sysdescr' ||
      topic =='$SYS/brokers/emqx@127.0.0.1/version' ||
      topic == '$SYS/brokers')
    return
    conexion.query(query,function(err,result,fields){
    if(err) throw err
  })
})


module.exports = broker