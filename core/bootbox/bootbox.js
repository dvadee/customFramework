import bootbox from 'bootbox';
import 'bootbox/bootbox.locales';
import { defaultsDeep } from 'lodash';

bootbox.setDefaults({
  locale: 'ru',
  animate: false,
  centerVertical: true,
});

const runAsync = (props, fn) => {
  return new Promise((resolve) => {
    props.callback = resolve;

    fn(props);
  });
};

const buttons = {
  YESNO: {
    confirm: {
      label: 'Да',
    },
    cancel: {
      label: 'Нет',
    },
  },
  CANCELSAVE: {
    cancel: {
      label: 'Отмена',
    },
    confirm: {
      label: 'Сохранить',
    },
  },
  YESNOCANCEL: {
    cancel: {
      label: 'Отмена',
      callback: () => 'cancel',
    },
    no: {
      label: 'Нет',
      callback: () => 'no',
    },
    yes: {
      label: 'Да',
      callback: () => 'yes',
    },
  },
};
/**
 *
 * @param p
 * @param {String} p.message
 * @param {Function} p.callback
 * @param {String} p.size small|large
 * @param {String} p.className
 * @param {Boolean} p.backdrop
 */
const alert = (p) => {
  bootbox.alert(p);
};

/**
 *
 * @param p
 * @param p.title
 * @param p.message
 * @param p.buttons
 * @param p.callback
 */
const confirm = (p) => {
  defaultsDeep(p, {
    title: 'Внимание',
    buttons: 'YESNO',
    centerVertical: true,
    size: 'small',
  });

  const btns = buttons[p.buttons];

  if (btns) {
    p.buttons = btns;
  }

  bootbox.confirm(p);
};

const asyncConfirm = (p) => runAsync(p, confirm);

const asyncRemoveConfirm = ({ fullMsg, name }) => {
  return asyncConfirm({
    message: fullMsg ? fullMsg : `Действительно удалить «${name}?»`,
    buttons: {
      cancel: {
        label: 'Нет',
      },
      confirm: {
        label: 'Да',
        className: 'btn-danger',
      },
    },
  });
};

/**
 *
 * @param p
 * @param p.buttons
 * @param p.title
 * @param p.centerVertical
 * @param p.inputType
 */
const prompt = (p) => {
  const btns = buttons[p.buttons];

  if (btns) {
    p.buttons = btns;
  }

  defaultsDeep(p, {
    centerVertical: true,
  });

  bootbox.prompt(p);
};

const asyncPrompt = (p) => runAsync(p, prompt);

/**
 *
 * @param p
 */
const dialog = (p) => {
  bootbox.dialog(p);
};

export {
  alert,
  confirm,
  prompt,
  asyncConfirm,
  asyncPrompt,
  dialog,
  asyncRemoveConfirm,
};
