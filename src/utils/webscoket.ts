import mittBus from "@/utils/mitt";
import { baseUrl } from "@/utils/auth";

let wsConn: any = null;
let lockReconnect = false;
let wsUrl: any = null;
let heartCheck = {
  //心跳检测,每20s心跳一次
  timeout: 20000,
  timeoutObj: {},
  serverTimeoutObj: null,
  start: function () {
    // @ts-ignore
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
    let self = this as any;
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      websocketSend("PING");
      console.info("客户端发送心跳");
      //如果超过一定时间还没重置，说明后端主动断开了
      self.serverTimeoutObj = setTimeout(function () {
        //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        wsConn.close();
      }, self.timeout);
    }, this.timeout);
  }
};

/**
 * 获取ws连接地址
 */
export function getConnUrl(userId: number) {
  const { protocol, host } = location;
  let wsBaseUrl = baseUrl;
  const url = `${protocol === "https:" ? "wss" : "ws"}:/${host}${wsBaseUrl}/websocket?token=${userId}`;
  return url;
}

/**
 * 初始化连接
 */
export function initWebSocket(url: string) {
  // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
  wsConn = new WebSocket(url);
  wsConn.onopen = websocketOnopen;
  wsConn.onerror = websocketOnerror;
  wsConn.onmessage = websocketOnmessage;
  wsConn.onclose = websocketOnclose;
  wsUrl = url;
}

function websocketOnopen() {
  console.log("WebSocket连接成功");
  //心跳检测重置
  heartCheck.start();
}

function websocketOnerror(e: any) {
  console.log("WebSocket连接发生错误");
  reconnect();
}

function websocketOnmessage(e: any) {
  console.log("-----接收消息-------", e.data);
  //心跳检测重置
  heartCheck.start();
  if ("PONG" == e.data) {
    return;
  }
  // 抛出事件 对应页面进行处理  查找 this.bus.$on('sysMsgNotice'
  let msg = JSON.parse(e.data as string);
  mittBus.emit(msg.msgType, msg.body);
}

function websocketOnclose(e: any) {
  console.log("connection closed (" + e + ")");
  reconnect();
}

function websocketSend(text: string) {
  // 数据发送
  try {
    wsConn.send(text);
  } catch (err: any) {
    console.log("send failed (" + err.code + ")");
  }
}

function reconnect() {
  if (lockReconnect) return;
  lockReconnect = true;
  //没连接上会一直重连，设置延迟避免请求过多
  setTimeout(function () {
    console.info("尝试重连...");
    initWebSocket(wsUrl);
    lockReconnect = false;
  }, 5000);
}
