import { defaults, isObject } from 'lodash';

/**
 * @mixin PopoverMixin (popover)po
 */
const PopoverMixin = {
  popover: {
    get: function () {
      const { $el } = this;

      return $el ? $el.popover() : null;
    },

    set: function (popover) {
      const { $el } = this;

      if (!$el) {
        return;
      }

      if (popover === true) {
        popover = {};
      }

      if (isObject(popover)) {
        defaults(popover, {
          trigger: 'hover',
          sanitize: false,
          html: true,
        });
      }

      $el.popover(popover);
    },
  },

  popoverContent: {
    get: function () {
      return this.getElAttr('data-content');
    },
    set: function (content) {
      this.setElAttr('data-content', content);
    },
  },
};

export default PopoverMixin;
