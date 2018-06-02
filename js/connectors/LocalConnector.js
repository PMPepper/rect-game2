import Server from '../server/Server';

export default class LocalConnector {
  /*
  let server;
  let client;
  */

  //Server settings get passed here (e.g. IP address for network)
  constructor() {
    this.server = new Server();
    this.server.sendMessageToClients = this.sendMessageToClients;
  }

  connect(client, onConnected) {
    this.client = client;

    setTimeout(() => {
      onConnected()
    }, 0);
  }

  //Can't start seding messages untl you're connected
  sendMessageToServer = (type, data, onReply) => {
    const reply = this.server.onMessage(type, data);

    doReply(reply, onReply);
  }

  sendMessageToClients = (type, data, onReply) => {
    const reply = this.client.onMessage(type, data);

    doReply(reply, onReply);
  }
}

function doReply(reply, onReply) {
  if(reply && onReply) {
    setTimeout(
      () => {
        onReply(reply);
      },
      0
    );
  }
}
