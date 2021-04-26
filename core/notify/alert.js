import PNotify from './pnotify';

const showNotification = (title, message, type, css) => {
  return new PNotify({
    title: title,
    text: message,
    // type: type,
    addclass: css + ' alert alert-styled-left alert-arrow-left',
    buttons: {
      closer: true,
      sticker: true,
      show_on_nonblock: true,
    },
  });
};

const getConfirmation = (message, action, undo, noMessage) => {
  var notice = new PNotify({
    title: 'Подтверждение',
    text: message,
    hide: false,
    type: 'warning',
    addClass: 'bg-warning alert alert-styled-left alert-arrow-left',
    animateSpeed: 'fast',
    confirm: {
      confirm: true,
      buttons: [
        {
          text: 'Да',
          addClass: 'btn btn-sm btn-primary',
        },
        {
          text: 'Нет',
          addClass: 'btn btn-sm btn-link',
        },
      ],
    },
    buttons: {
      closer: false,
      sticker: false,
    },
  });
  notice.get().on('pnotify.confirm', function () {
    action();
  });
  notice.get().on('pnotify.cancel', function (e, notice) {
    if (!noMessage) {
      notice.cancelRemove().update({
        title: 'Информация',
        text: 'Действие отменено',
        type: 'info',
        addClass: 'bg-info alert alert-styled-left alert-arrow-left',
        animateSpeed: 'fast',
        hide: true,
        delay: 2000,
        confirm: {
          confirm: false,
        },
        buttons: {
          closer: true,
          sticker: true,
        },
      });
    }
    if (typeof undo === 'function') {
      undo();
    }
  });
};

const showSuccess = (message) => {
  showNotification('Успешно', message, 'success', 'bg-success');

  return true;
};

const showInfo = (message) => {
  showNotification('Информация', message, 'info', 'bg-info');
  return false;
};

const showWarning = (message) => {
  showNotification('Предупреждение', message, 'warning', 'bg-warning');
  return false;
};

const showError = (message) => {
  showNotification('Ошибка!', message, 'error', 'bg-danger');
  return false;
};

const showScheduleNotification = (notificationKey, message) => {
  if ($('.' + notificationKey).length > 0) {
    return;
  }

  const options = {
    title: 'Уведомление',
    text: message,
    addClass: `stack-bottom-left bg-primary border-primary ${notificationKey}`,
    stack: 'stack_bottom_left',
    type: 'info',
    hide: false,
    buttons: {
      closerHover: false,
      sticker: false,
    },
  };

  return showNotification(options);
};

const showSelectionEmptyAlert = (itemName = 'запись') =>
  showInfo(`Выберите ${itemName}!`);

export {
  showSuccess,
  showInfo,
  showWarning,
  showError,
  getConfirmation,
  showScheduleNotification,
  showSelectionEmptyAlert,
};
