import $ from 'jquery';
import Switchery from 'switchery';
import { merge } from 'lodash';

const initUniform = () => {
  $('.form-check-input-styled').uniform();
};

const initUniformDefaults = () => {
  Object.assign($.uniform.defaults, {
    checkboxClass: 'uniform-checker',
    radioClass: 'uniform-choice',
    fileClass: 'uniform-uploader',
    fileNameClass: 'filename',
    fileButtonClass: 'input-file-btn btn btn-light',
    fileDefaultHtml: 'Файл не выбран',
    fileButtonHtml: 'Выбрать файл',
  });
};

const initSwitchery = () => {
  var elems = Array.from(
    document.querySelectorAll('.form-check-input-switchery')
  );
  elems.forEach((el) => {
    el._switchery = new Switchery(el, { size: 'small' });
  });
};

const blockEl = ($el, p) => {
  const cfg = merge(
    {
      message: '<i class="icon-spinner2 spinner"></i>',
      overlayCSS: {
        backgroundColor: '#fff',
        opacity: 0.8,
        cursor: 'wait',
        'box-shadow': '0 0 0 1px #ddd',
      },
      css: {
        border: 0,
        padding: 0,
        backgroundColor: 'none',
      },
    },
    p
  );

  $el.block(cfg);
};

const unblockEl = ($el) => $el.unblock();

const toggleElBlock = ($el, state) => (state ? blockEl($el) : unblockEl($el));

const initLimitless = () => {
  initUniformDefaults();
  initUniform();
  initSwitchery();
};

export {
  initUniformDefaults,
  initUniform,
  initSwitchery,
  initLimitless,
  blockEl,
  unblockEl,
  toggleElBlock,
};
