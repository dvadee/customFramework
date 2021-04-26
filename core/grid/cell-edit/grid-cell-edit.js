import Base from '@/core/base';
import GridCellEditInput from './input/grid-cell-edit-input';
import keyCodeDict from '../../util/key-code';

class GridCellEdit extends Base {
  preventSaveValue = false;

  editorComponent = null;

  editorConfig = null;

  get cellValue() {
    const { cell } = this;

    return cell ? cell.data() : null;
  }

  get input() {
    let { _input } = this;

    if (!_input || _input.destroyed) {
      _input = this._input = this.createInput();
    }

    return _input;
  }

  set input(v) {
    if (v === null && this._input) {
      this._input.destroy();
      this._input = null;
    }
  }

  /**
   *
   * @param {Object} p
   * @param {Grid} p.grid
   */
  constructor(p) {
    super(p);

    this.tdEditCls = this.grid.tdCls + '--edit';
  }

  createInput() {
    const { editorConfig, editorComponent } = this;

    const Editor = editorComponent || GridCellEditInput;

    const $el = $(
      Editor.renderHtml ? Editor.renderHtml : GridCellEditInput.renderHtml
    );

    $el.addClass('grid__cell-editor');

    const config = Base.mergeConfig(editorConfig || {}, {
      listeners: {
        blur: this.onBlur.bind(this),
        keyup: this.processKeyUp.bind(this),
        click: this.onClick.bind(this),
        mousedown: this.onClick.bind(this),
      },
      $el,
    });

    return new Editor(config);
  }

  onClick(input, e) {
    e.stopImmediatePropagation();
  }

  onBlur() {
    this.saveValue();

    this.setCell(null);
  }

  processKeyUp(input, e) {
    const { keyCode } = e;

    if (keyCode === keyCodeDict.ENTER) {
      this.saveValue();
    } else if (keyCode === keyCodeDict.ESC) {
      this.cancelEdit();
    }
  }

  saveValue() {
    const { grid, cell, preventSaveValue, dataSrc } = this;

    if (!preventSaveValue) {
      const { value } = this.input;
      const oldValue = cell.data() ?? '';

      this.endEdit();

      this.input = null;

      if (oldValue != value) {
        cell.data(value);

        grid.onCellValueEdit(cell, dataSrc, value, oldValue);
      }
    }
  }

  cancelEdit() {
    const { cell } = this;

    this.preventSaveValue = true;

    this.endEdit();

    this.input = null;

    cell.invalidate().draw();
  }

  startEdit() {
    const { cell, $cell } = this;

    if (!cell) {
      return;
    }

    this.preventSaveValue = false;

    const { input } = this;

    $cell.addClass(this.tdEditCls);

    input.value = cell.data();

    input.show();

    input.$el.appendTo($cell);

    if (input.focus) {
      input.focus();
    }
  }

  setCell(meta) {
    const oldCell = this.cell;

    if (oldCell) {
      this.cell = null;
      this.$cell = null;
    }

    if (meta) {
      const { cell } = meta;

      this.cell = cell;
      this.dataSrc = meta.dataSrc;
      this.editorComponent = meta.editor;
      this.editorConfig = meta.editorConfig;
      this.$cell = $(cell.node());
    }
  }

  endEdit() {
    const { $cell } = this;

    if (!$cell) {
      return;
    }

    $cell.removeClass(this.tdEditCls);
  }
}

export default GridCellEdit;
