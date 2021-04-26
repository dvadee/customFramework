const cellCls = 'grid-column-check-cell';
const className = 'grid-column-check';

const render = (checked) => {
  const checkedCls = checked ? `${cellCls}--checked` : '';

  return `<div class="${cellCls} ${checkedCls}"></div>`;
};

const onCellClick = (manager, { data }, { dtRow }, domEl, e) => {
  dtRow.toggleChecked(data);

  e.preventDefault();
  e.stopImmediatePropagation();
};

export default { onCellClick, render, className };
