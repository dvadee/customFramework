const cls = 'grid-column-drag';

const initRowDrag = ($row, text) => {
  $row.find(`.${cls}`).draggable({
    cursor: 'move',
    cursorAt: { top: -5, left: -5 },
    appendTo: 'body',
    helper: () => `<div class="jquery-ui-draggable-helper">${text}</div>`,
    revert: true,
    revertDuration: 0,
    connectToFancytree: true,
    zIndex: 1000,
  });
};

const initColumn = (manager, config) => {
  manager.grid.on({
    rowcreate: (grid, row, data) => initRowDrag(row, data[config.textData]),
  });
};

const render = (data, type, row, meta, manager, config) => {
  const { idField } = manager.grid;

  return `
    <div class="${cls}" title="${config.tooltip}" data-toggle="tooltip" data-id="${row[idField]}">
        <i class="icon-dots"></i>
    </div>
  `;
};

export default { render, initColumn };
