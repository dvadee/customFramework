import { defaults, chain, includes, toLower } from 'lodash';
import Component from '../component';

/**
 * @deprecated
 */
class Select extends Component {
  /**
   * @event change
   *
   * @param {Object} p
   * @param {Object} p.options
   * @param {JqueryDom} p.$filterInput
   */

  constructor(p) {
    defaults(p, {
      options: null,
    });

    super(p);
  }

  initComponent() {
    this.initOptions();
  }

  initEvents() {
    const { $el, $filterInput } = this;

    $el.on('change', this.onChange.bind(this));

    if ($filterInput) {
      $filterInput.keyup(() => this.filterOptions($filterInput.val()));
    }
  }

  initOptions() {
    const { $el, options } = this;

    const initFromDOM = options === null;

    if (initFromDOM) {
      this.options = Array.from($el.get(0).options).map(({ text, value }) => ({
        text,
        value,
      }));
    } else {
      this.fillOptions();
    }
  }

  fillOptions(options) {
    const { $el } = this;

    if (!options) {
      options = this.options;
    }

    const optionsHtml = options.map(
      ({ text, value }) => `<option value="${value}">${text}</option>`
    );

    $el.html(optionsHtml);
  }

  setOptions(options) {
    this.options = options;

    this.fillOptions();
  }

  onChange() {
    const value = this.$el.val();

    this.trigger('change', this, value);
  }

  filterOptions(value) {
    value = chain(value).trim().toLower().value();

    let filteredOptions = this.options;

    if (value) {
      filteredOptions = filteredOptions.filter(({ text }) =>
        includes(toLower(text), value)
      );
    }

    this.fillOptions(filteredOptions);
  }

  getValue() {
    return this.$el.val();
  }

  get value() {
    return this.$el.val();
  }

  set value(v) {
    this.$el.val(v);
  }

  clear() {
    this.$el.prop('selectedIndex', 0);
  }

  processLoadData(data) {
    this.setOptions(data);
  }
}

export default Select;
