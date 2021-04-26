import { forIn, isObject, has } from 'lodash';

/**
 * @mixin ObservableMixin
 */
const ObservableMixin = {
  isObservable: true,

  suspendedEvents: [],

  get observableMixin() {
    return ObservableMixin;
  },

  suspendEvents(events) {
    if (events) {
      this.suspendedEvents = [...events, ...this.suspendedEvents];
    } else {
      this.eventsSuspended = true;
    }
  },

  resumeEvents(events) {
    if (events) {
      this.suspendedEvents = this.suspendedEvents.filter(
        (event) => !events.includes(event)
      );
    } else {
      this.eventsSuspended = false;
    }
  },

  initObservable() {
    const { listeners = {} } = this;

    forIn(listeners, (fn, eventName) => {
      this.on(eventName, fn);
    });
  },
  /**
   * Подписаться на событие, использование:
   * menu.on('select', function(item) { ... }
   * menu.on({ 'select': function(item) { ... } }
   */
  on() {
    if (!this._eventHandlers) this._eventHandlers = {};

    if (isObject(arguments[0])) {
      const listeners = arguments[0];

      forIn(listeners, (fn, name) => this.on(name, fn));
    } else {
      const eventName = arguments[0];
      const handler = arguments[1];

      if (!eventName) {
        throw new Error('Empty event name!');
      }

      if (!handler) {
        throw new Error('Empty event handler!');
      }

      if (!this._eventHandlers[eventName]) {
        this._eventHandlers[eventName] = [];
      }

      this._eventHandlers[eventName].push(handler);
    }
  },

  /**
   * Отменить подписку, использование:
   * menu.un('select', handler)
   */
  un(eventName, handler) {
    let handlers = this._eventHandlers && this._eventHandlers[eventName];
    if (!handlers) return;
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1);
      }
    }
  },

  /**
   * once event
   * @param eventName
   * @param fn
   * @param params
   */
  one(eventName, fn, params = {}) {
    const { scope = this } = params;

    const handler = function () {
      fn.apply(scope, arguments);

      this.un(eventName, handler);
    };

    this.on(eventName, handler.bind(this));
  },

  /**
   * Сгенерировать событие с указанным именем и данными
   * this.trigger('select', data1, data2);
   */
  trigger(eventName, ...args) {
    let result = true;

    if (this.eventsSuspended || this.isSuspendedEvent(eventName)) {
      return;
    }

    if (!this._eventHandlers || !this._eventHandlers[eventName]) {
      return result; // обработчиков для этого события нет
    }

    // вызовем обработчики
    this._eventHandlers[eventName].forEach((handler) => {
      const res = handler.apply(this, args);

      res === false && (result = res);
    });

    return result;
  },

  /**
   *
   * @param fromCmp
   * @param events
   * @param prefix
   * @param beginEnd
   */
  relayEvents(fromCmp, events = [], prefix = '', beginEnd) {
    const me = this;

    events.forEach((event) => {
      fromCmp.on(event, function () {
        let args = Array.from(arguments);

        if (beginEnd) {
          Array.prototype.splice.apply(args, beginEnd);
        }

        args.unshift(prefix + event, me);

        me.trigger.apply(me, args);
      });
    });
  },

  hasListener(event) {
    return has(this._eventHandlers, event);
  },

  bubbleEvent(event, ...args) {
    let cmp = this;
    let result;

    while (cmp && result !== false) {
      if (cmp.isObservable) {
        result = cmp.trigger(event, ...args);
      }

      cmp = cmp.parentCmp;
    }

    return result;
  },

  isEventsSuspended: {
    get() {
      return this.eventsSuspended;
    },
  },

  isSuspendedEvent(event) {
    return this.suspendedEvents.includes(event);
  },
};

export default ObservableMixin;
