import SignalRConnection from '@/core/signalr-connection/signalr-connection';
import { showInfo } from '@/core/notify/alert';

class Schedules {
  static init() {
    new Schedules();
  }

  constructor() {
    this.notificationsKeys = [];
    this.initConnection();
  }

  initConnection() {
    this.connection = new SignalRConnection({
      url: '/api/schedules',
      connectionMethodsHandlers: {
        ReceiveNotification: this.initNotification.bind(this),
      },
      autoStartConnection: true,
      connectionCreateMessage: 'Уведомления сервера включены.',
      connectionLostMessage: 'Уведомления сервера отключены, связь оборвана.',
    });
  }

  initNotification(key, message) {
    if (this.isAlreadyShowedNotification(key)) {
      return;
    }

    this.addNotificationKey(key);

    this.showNotification(message);
  }

  isAlreadyShowedNotification(key) {
    return this.notificationsKeys.includes(key);
  }

  addNotificationKey(key) {
    this.notificationsKeys.push(key);
  }

  showNotification(message) {
    showInfo(message);
  }
}

export default Schedules;
