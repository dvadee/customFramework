class Tooltip {
  static init() {
    $('body').tooltip({
      selector: '[data-toggle="tooltip"]',
    });
  }

  /**
   *
   * @param {jQuery} $el
   * @param {String} content
   */
  static addTooltipToEl($el, content) {
    $el.data('toggle', 'tooltip');

    $el.prop('title', content);
  }
}

export default Tooltip;
