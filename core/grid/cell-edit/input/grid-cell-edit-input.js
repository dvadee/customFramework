import Input from '@/core/input/input';

class GridCellEditInput extends Input {
  initComponent() {
    super.initComponent();

    this.addCls('form-control', 'w-100', 'border-primary');
  }
}

export default GridCellEditInput;
