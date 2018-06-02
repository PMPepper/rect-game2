//Special server connector for using a web worker for the server
import Server from './server/Server';
import MessageTypes from './consts/MessageTypes';

let messageIdCounter = 1;
const messageReplyHandlers = {};


//initialise the server
const server = new Server();
server.sendMessageToClients = (type, data, onReply) => {
  const message = {
    type,
    data
  };

  if(onReply) {//register reply handler
    message.id = (messageIdCounter++).toString();
    messageReplyHandlers[message.id] = onReply;
  }

  postMessage(message);
}

//Process recieved messages
onmessage = function(e) {
  const message = e.data;

  if(message.type === MessageTypes.REPLY) {
    //handle reply messages
    if(messageReplyHandlers.hasOwnProperty(message.replyId)) {
      messageReplyHandlers[message.replyId](message.data);
      delete messageReplyHandlers[message.replyId];
    } else {
      throw new Error('WORKER: Unknown reply from client: ', message);
    }
  } else if(message.type.charAt(0) === '_') {
    throw new Error('invalid message type: ', message.type);
  } else if(server[message.type]) {
    const reply = server[message.type](message.data);

    //TODO send reply
    doReply(reply, message.id)
  } else {
    console.log('WORKER: unknown message type: ', message.type);
  }
}


function doReply(reply, replyId) {
  if(!!replyId) {
    postMessage({
      type: MessageTypes.REPLY,
      data: reply,
      replyId
    });
  }
};


//Finally tell the client the worker is loaded
postMessage({type: MessageTypes.WORKER_READY});
