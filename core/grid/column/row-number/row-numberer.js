const applyRowsNumbers = (column) => {
  column.nodes().each((cell, i) => {
    cell.innerHTML = i + 1;
  });
};

const applyRowNumber = ({ column, row }) => {
  const nodes = column.nodes();
  const index = row.index();
  const node = nodes[index];

  if (node) {
    node.innerHTML = index + 1;
  }
};

const initColumn = ({ grid }, config, column) => {
  const cb = () => applyRowsNumbers(column);

  grid.on({
    tablesearch: cb,
    tableorder: cb,
    rowsdatachange: (grid, rows) =>
      rows.forEach((row) => applyRowNumber({ column, row })),
  });
};

export default { initColumn };
