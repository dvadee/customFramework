import { isFunction } from 'lodash';
import { replaceElementWithKeepClasses } from '@/core/util/dom';
import template from '@/core/util/lodash-template';

/**
 * @mixin RenderableMixin
 */
const RenderableMixin = {
  /**
   * @cfg {Boolean} prepend[true]
   */

  /**
   * @cfg {String|Function} renderTpl
   */

  get renderableMixin() {
    return RenderableMixin;
  },

  renderSlotsProps: [],

  isRenderable: true,

  renderable: true,

  replaceRenderTo: false,

  getTplRenderData() {
    const renderData = this.getRenderData ? this.getRenderData() : {};

    renderData.owner = this;
    renderData.id = this.id;

    return renderData;
  },

  render() {
    const { prepend = false, renderTpl } = this;

    const renderData = this.getTplRenderData();

    Object.assign(renderData, this.getRenderSlots(renderData));

    const $renderTo = this.$renderTo || this.$el;

    let html;

    if (!renderTpl) {
      throw new Error(
        `${this.constructor.name} - Не указан renderTpl у компонента!`
      );
    }

    if (isFunction(renderTpl)) {
      html = renderTpl(renderData);
    } else {
      const compiled = template(this.renderTpl);

      html = compiled(renderData);
    }

    const $rendered = $(html);

    if ($renderTo) {
      if (this.renderToRef || this.replaceRenderTo) {
        replaceElementWithKeepClasses($renderTo, $rendered);

        this.$el = $rendered;
      } else {
        $rendered[prepend ? 'prependTo' : 'appendTo']($renderTo);
      }
    }

    if (!this.$el) {
      this.$el = $rendered;
    }

    if (this.isObservable) {
      this.trigger('render', this);
    }
  },

  getRenderSlots(renderData) {
    return this.renderSlotsProps.reduce((obj, slotName) => {
      let slot = this[slotName];

      if (!isFunction(slot)) {
        slot = template(slot);
      }

      obj[slotName] = slot(renderData);

      return obj;
    }, {});
  },
};

export default RenderableMixin;
