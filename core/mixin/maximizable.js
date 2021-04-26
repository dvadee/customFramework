import { emptyFn } from '@/core/util/function';
const fullscreenClsList = ['fixed-top', 'rounded-0', 'h-100'];

let currentFullScreen;

const MaximizableMixin = {
  hasFullHeightCls: null,

  /**
   * Вернуть нормальный размер
   */
  minimize() {
    this.removeCls(fullscreenClsList);

    //Если перед увеличением был h-100 - вернуть
    if (this.hasFullHeightCls) {
      this.addCls('h-100');
    }

    $('body').removeClass('overflow-hidden');

    currentFullScreen = null;

    this.maximized = false;

    this.trigger('minimize', this);

    this.onMinimize();
  },

  maximize() {
    if (this.hasFullHeightCls === null) {
      this.hasFullHeightCls = this.hasCls('h-100');
    }

    this.addCls(fullscreenClsList);

    if (currentFullScreen) {
      currentFullScreen.minimize();
    }

    currentFullScreen = this;

    $('body').addClass('overflow-hidden');

    this.maximized = true;

    this.trigger('maximize', this);

    this.onMaximize();
  },

  toggleFullscreen() {
    this[this.maximized ? 'minimize' : 'maximize']();
  },

  onMaximize: emptyFn,

  onMinimize: emptyFn,
};

export default MaximizableMixin;
