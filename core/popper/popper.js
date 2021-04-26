import { createPopper } from '@popperjs/core';
import { assign } from 'lodash';
import Base from '@/core/base';

class Popper extends Base {
  static createPopper({ targetEl, popperEl, options = {} }) {
    createPopper(
      targetEl,
      popperEl,
      assign(options, {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
          {
            name: 'flip',
            options: {
              enabled: true,
            },
          },
          {
            name: 'preventOverflow',
            options: {
              boundariesElement: 'scrollParent',
            },
          },
        ],
      })
    );
  }
}

export default Popper;
