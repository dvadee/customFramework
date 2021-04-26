import Base from '@/core/base';

/**
 * @class ViewModelBind
 * @prop viewModel
 * @prop vmProp
 * @prop stubVmProp
 * @prop cmpProp
 * @prop cmp
 * @prop isExpression
 */
class ViewModelBind extends Base {
  get value() {
    const { isExpression } = this;

    return this.viewModel[isExpression ? 'getExpressionValue' : 'get'](
      this.stubVmProp
    );
  }

  set value(v) {
    if (this.isExpression) {
      console.error('not allow set value to expression bind!');
      return;
    }

    const { stubVmProp } = this;

    this.viewModel.set(stubVmProp, v);
  }

  notify() {
    const { cmpProp } = this;

    this.cmp[cmpProp] = this.value;
  }
}

export default ViewModelBind;
