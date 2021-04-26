import { blockEl, unblockEl } from '@/base/js/limitlessAppCustom';

const SCROLL_BAR_WIDTH =
  window.innerWidth - document.documentElement.clientWidth;

const setElDisabled = (el, disabled = false) => {
  el.prop('disabled', disabled);

  el[disabled ? 'addClass' : 'removeClass']('disabled');
};

const isDisabledEl = (el) => el.prop('disabled');

const isSelectorString = (str = '') =>
  str.startsWith('.') || str.startsWith('#');

const isVisible = (el) => el.is(':visible');

const setElVisible = (el, visible = true) => {
  el[visible ? 'removeClass' : 'addClass']('d-none');
};

const getScrollbarWidth = () => SCROLL_BAR_WIDTH;

const setElLoading = (el, loading = false) =>
  loading ? blockEl(el) : unblockEl(el);

const replaceElementWithKeepClasses = ($target, $el) => {
  const classList = $target.attr('class');

  $target.replaceWith($el);

  $el.addClass(classList);

  return $el;
};

/**
 *
 * @param {jQuery} $input
 */
function selectInputText($input) {
  $input.focus();
  $input.select();
}

export {
  isSelectorString,
  setElDisabled,
  isDisabledEl,
  isVisible,
  setElVisible,
  getScrollbarWidth,
  setElLoading,
  replaceElementWithKeepClasses,
  selectInputText,
};
