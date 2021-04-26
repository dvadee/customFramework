import { get, defaults } from 'lodash';
import api from '../../../services/api';

class GridProxy {
  static sortDirection = {
    asc: 0,
    desc: 1,
  };

  static emptyDataTableLoadResponse = {
    recordsTotal: 0,
    recordsFiltered: 0,
    data: [],
  };

  grid;

  /**
   *
   * @param {Object} p
   * @param {Object} p.query
   * @param {Grid} p.grid
   * @param {Function} p.proxyApi
   */
  constructor(p) {
    defaults(p, {
      onLoad: () => {},
    });

    Object.assign(this, p);

    this.buildParams();
  }

  async load() {
    let data;

    try {
      if (this.grid.isServerSideTable) {
        data = await this.loadServerSideData();
      } else {
        data = await this.loadData();
      }

      return data;
    } catch (err) {
      console.error('Ошибка загрузки');
      console.error(err);
      throw err;
    }
  }

  async loadData() {
    const { params } = this;
    const { proxyApi } = this.grid;

    const res = await proxyApi(params);

    if (!res) {
      throw new Error();
    }

    return { data: res };
  }

  async loadServerSideData() {
    const { params } = this;
    const { ajaxCfg } = this.grid;

    const res = await api.post(ajaxCfg.url, params);

    if (!res) {
      throw new Error();
    }

    const { items, pager } = res;

    return {
      data: items,
      recordsTotal: pager.totalRecords,
      recordsFiltered: pager.totalRecords,
    };
  }

  buildParams() {
    const { query, grid } = this;
    const { table, loadParams = {}, loadFilter = {}, isServerSideTable } = grid;

    if (!isServerSideTable) {
      this.params = loadParams;

      return;
    }

    const tableSort = get(query, 'order[0]', null);
    const { page, length } = table.page.info();
    const pager = {
      currentPage: page,
      itemsOnPage: length,
    };
    const sort = {};
    const filter = {};

    if (tableSort !== null) {
      const column = grid.getColumnEnumValue(tableSort.column);

      sort[column] = GridProxy.sortDirection[tableSort.dir];
    }

    filter.columnsFilter = grid.getColumnsFilters();

    Object.assign(filter, loadFilter);

    loadParams.searchPattern =
      loadParams.searchPattern || get(query, 'search.value', '');

    this.params = Object.assign({ sort, filter, pager }, loadParams);
  }

  get filter() {
    return get(this, 'params.filter', {});
  }

  getFilterValue(key) {
    return this.filter[key];
  }
}

export default GridProxy;
