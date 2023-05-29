
import { useUserStore,useCountStore } from "@/store"
import * as mqtt from '../../node_modules/mqtt/dist/mqtt.js'
// var mqtt = require('../../node_modules/mqtt/dist/mqtt.js')
import { storeToRefs } from 'pinia';
import { subWebSocket } from '@/api/modules/userInfo'

const store = useCountStore()

const { token } = storeToRefs(store);

// let mqtt  = require('@/utils/m')

const userStore = useUserStore()

const url = "wxs://zhuyiyun.com/mqtt/"

let client: any = null


/**mqtt连接,不支持发送16进制buffer数据，暂弃用*/
const connectmqtt = () => {
      const options = {
      keepalive: 60,
      clean: false,
      reconnectPeriod: 1000,
      connectTimeout: 4000,
      clientId: userStore.userInfo!.id+"_xcx_"+ userStore.uuid,
      username: userStore.userInfo!.id, 
      password: token.value
    } 
    client = mqtt.connect(`wxs://zhuyiyun.com:443/mqtt`, options)
  client.on('connect', async (e) => {
      await subWebSocket(userStore.userInfo!.id+"_xcx_"+ userStore.uuid)
      console.log('服务器连接成功', e)
      // client.subscribe('abc', { qos: 2 }, function (err) {
      //   if (!err) {
      //     console.log('订阅成功')
      //   }
      // })
    })
    //信息监听
  client.on('message', function (topic, massage) {
    console.log("123")
    console.log('收到' + JSON.parse(massage))
  })
  client.on('reconnect', (error) => {
    console.log('正在重连', error)
  })
  client.on('error', (error) => {
    console.log('连接失败', error)
  })
  // 连接断开后触发的回调 
  client.on("close", function () {
    console.log("已断开连接")
  });
  // 客户端脱机下线触发回调 
  client.on("offline", function () {
    console.log("您已断开连接，请检查网络")
  });
  //当客户端发送任何数据包时发出。这包括publish()以及MQTT用于管理订阅和连接的包 
  client.on("packetsend", (packet) => {
    //console.log("客户端已发出报文", packet);
  });
}
  //mqtt发送数据，只支持string，不支持16进制buffer
const  mqttSend = (msg)=> {
  client.publish('ping', msg, { qos: 2 }, function (err) {
    console.log('send', err)
  })
}

// 关闭mqtt
const disConnection = () => {
  client && client.end(true);
}


  /**将ArrayBuffer转换成字符串*/
const ab2hex = (buffer)=> {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
}



// 生成uuid
function generateUUID() {
  let d = new Date().getTime() 
  let uuid = 'xxxxxxx4xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (d + Math.random()*16)%16 | 0 
    d = Math.floor(d/16) 
    return (c=='x' ? r : (r&0x3|0x8)).toString(16) 
  }) 
  return uuid
}

export {
  generateUUID,connectmqtt,disConnection
} 