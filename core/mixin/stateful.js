import { encode, decode } from '../util/util';

/**
 * @mixin StatefulMixin
 * @prop {String} stateId
 */
const StatefulMixin = {
  stateful: true,

  stateEvents: [],

  isStateful: {
    get: function () {
      return this.stateful && !!this.stateId;
    },
  },

  /**
   * @param {String[]} eventsNames
   */
  addStateEvents(eventsNames) {
    eventsNames.forEach((name) => {
      this.on(name, this.onStateChange.bind(this));
    });
  },

  /**
   * @protected
   */
  getState() {},

  /**
   * @protected
   */
  applyState() {},

  loadState() {
    if (!this.isStateful) {
      return;
    }

    const { stateId } = this;
    const state = localStorage.getItem(stateId);

    return decode(state);
  },

  saveState() {
    if (!this.isStateful) {
      return;
    }

    const { stateId } = this;
    const state = encode(this.getState());

    if (state) {
      localStorage.setItem(stateId, state);
    }
  },

  initState() {
    if (!this.isStateful) {
      return;
    }

    this.addStateEvents(this.stateEvents);

    const state = this.loadState();

    if (state) {
      this.applyState(state);
    }
  },

  onStateChange() {
    this.saveState();
  },

  suspendStateSave() {
    this.stateful = false;
  },

  resumeStateSave() {
    this.stateful = true;
  },
};

export default StatefulMixin;
