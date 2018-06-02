import MessageTypes from '../consts/MessageTypes';

let messageIdCounter = 1;
const messageReplyHandlers = {};

export default class WorkerConnector {
  /*
  let worker
  let client
  let onConnected;
  */

  constructor({path = '../js/worker.js'} = {}) {
    this._isWorkerLoaded = false;
    this.worker = new Worker(path);

    this.worker.onmessage = this.onMessageFromServer;
  }

  connect(client, onConnected) {
    this.client = client;
    this.onConnected = onConnected;

    this._checkIsConnected();
  }

  _checkIsConnected() {
    if(this._isWorkerLoaded && this.onConnected) {
      console.log('WORKER CONNECTOR: is connected');
      this.onConnected();
    }
  }

  sendMessageToServer = (type, data, onReply) => {
    const message = {
      type,
      data
    };

    if(onReply) {//register reply handler
      message.id = (messageIdCounter++).toString();
      messageReplyHandlers[message.id] = onReply;
    }

    this.worker.postMessage(message);
  }

  onMessageFromServer = ({data: message}) => {
    switch(message.type) {
      case MessageTypes.WORKER_READY:
        console.log('WORKER CONNECTOR: worker is ready');
        this._isWorkerLoaded = true;
        this._checkIsConnected();
        return;
      case MessageTypes.REPLY:
        console.log('WORKER CONNECTOR: reply from server');
        //handle reply messages
        if(messageReplyHandlers.hasOwnProperty(message.replyId)) {
          messageReplyHandlers[message.replyId](message.data);
          delete messageReplyHandlers[message.replyId];
        } else {
          throw new Error('WORKER CONNECTOR: Unknown reply from client: ', message);
        }
        return;
      default:
        const reply = this.client.onMessage(message.type, message.data);

        this.doReply(reply, message.id);

    }
  }

  doReply(reply, replyId) {
    if(!!replyId) {
      this.worker.postMessage({
        type: MessageTypes.REPLY,
        data: reply,
        replyId
      });
    }
  }
}
