const SignalR = require('@aspnet/signalr');
import { forIn } from 'lodash';
import { showError } from '../notify/alert';

/**
 * @class SignalrConnect
 * @mixes {ObservableMixin}
 * @prop {String} url
 * @prop {String} connectionLostMessage
 * @prop {Object} methodsHandlers
 */
class SignalRConnection {
  url;
  connectionLostMessage;
  connection;

  /**
   * @param p
   * @param {String} p.url
   * @param {String} p.connectionCreateMessage
   * @param {String} p.connectionLostMessage
   * @param {Object} p.methodsHandlers
   * @param {Boolean} p.autoStartConnection
   */
  constructor(p) {
    if (!p?.url) {
      throw new Error('SignalRConnection - url required!');
    }

    this.initConfig(p);

    this.resetErrorCounter();

    this.init();
  }

  initConfig({
    url,
    connectionCreateMessage,
    connectionLostMessage,
    connectionMethodsHandlers,
    autoStartConnection = true,
  }) {
    this.url = url;
    this.connectionLostMessage = connectionLostMessage;
    this.connectionCreateMessage =
      connectionCreateMessage || `WS SignalR ${url} - connected`;
    this.connectionMethodsHandlers = connectionMethodsHandlers;
    this.autoStartConnection = autoStartConnection;
    this.reconnectTimeout = 5000;
  }

  init() {
    this.createConnection();

    this.initConnectionMethodsHandlers();

    if (this.autoStartConnection) {
      this.startConnection();
    }
  }

  createConnection() {
    this.connection = new SignalR.HubConnectionBuilder()
      .withUrl(this.url)
      .configureLogging(SignalR.LogLevel.Information)
      .build();
  }

  resetErrorCounter() {
    this.errorCounter = 0;
  }

  increaseErrorCounter() {
    this.errorCounter = this.errorCounter + 1;
  }

  isErrorCounterReachMaximum() {
    return this.errorCounter > 5;
  }

  async startConnection() {
    const { connectionLostMessage } = this;

    try {
      await this.connection.start();

      console.log(this.connectionCreateMessage);
    } catch (err) {
      console.log(err);

      this.increaseErrorCounter();

      if (this.isErrorCounterReachMaximum()) {
        showError(connectionLostMessage);
      } else if (connectionLostMessage) {
        setTimeout(() => this.startConnection(), this.reconnectTimeout);
      }
    }
  }

  onConnectionClose() {
    this.startConnection();
  }

  initConnectionMethodsHandlers() {
    const { connectionMethodsHandlers } = this;

    this.connection.onclose(this.onConnectionClose.bind(this));

    if (connectionMethodsHandlers) {
      forIn(connectionMethodsHandlers, (fn, name) => {
        this.addConnectionHandler(name, fn);
      });
    }
  }

  /**
   * @public
   * @param {String} name
   * @param {Function} fn
   */
  addConnectionHandler(name, fn) {
    const { connection } = this;

    if (!connection) {
      throw new Error('SignalRConnection - connection not created yet!');
    }

    connection.on(name, fn);
  }
}

export default SignalRConnection;
