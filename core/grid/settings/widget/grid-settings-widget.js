import { template } from 'lodash';
import Component from '@/core/component';
import GridSettingsBtn from '../btn/grid-settings-btn';
import { setCheckboxState } from '@/core/util/form';

const filterValuesTableTpl = `
    <table class="table table-sm small">
        <thead>
            <th class="w-50">Столбец</th>
            <th class="w-50">Текст фильтра</th>
        </thead>
        <tbody>
          <% filters.forEach(filter => { %>
            <tr>
                <td>{{filter.title}}</td>
                <td>{{filter.value}}</td>
            </tr>
          <% }); %>
        </tbody>
    </table>
  `;

const renderTpl = `
    <div class="rounded-top bg-light border ml-auto text-center p-1" tab-index="-1">
        <div class="btn-group leftdrop" data-ref="buttons-ct">
        </div>
        <button class="btn dropdown-toggle dropdown-toggle-split btn-light" data-toggle="dropdown" data-ref="columns-visible-toggle-menu-btn"></button>
        <div data-ref="columns-visible-toggle-menu" class="dropdown-menu {{ dropdownCls }} dropdown-menu-right p-1"></div>
    </div>
  `;

/**
 * @class GridSettingsWidget
 * @extend Component
 * @prop dropdownVisibleCls
 * @prop filterBtnCls
 * @prop dropdownCls
 * @prop filterValuesTableTpl
 * @prop filterValuesTableHtml
 * @prop buttons
 * @prop {Grid} grid
 * @prop {GridSettingsBtn} filterBtn
 * @prop {GridSettingsBtn} clearFilterBtn
 */

class GridSettingsWidget extends Component {
  constructor(p) {
    GridSettingsWidget.configDefaults(p, {
      $renderTo: p.grid.$settingsCt,
      filterValuesTableTpl: template(filterValuesTableTpl),
      childs: [
        'buttons-ct',
        'columns-visible-toggle-menu',
        'columns-visible-toggle-menu-btn',
      ],
      baseCls: 'grid-settings-btn',
      dropdownVisibleCls: 'grid-settings-btn--dropdown-visible',
      filterBtnCls: 'grid-settings-btn__filter-btn',
      dropdownCls: 'grid-settings-btn__dropdown',
      filterValuesTableHtml: '',
      buttons: [],
      renderTpl,
    });

    if (p.grid.enableFilter) {
      GridSettingsWidget.mergeConfig(p, {
        buttons: [
          {
            reference: 'clear-filter-btn',
            listeners: {
              click: 'onClearBtnClick',
            },
            renderConfig: {
              icon: 'icon-eraser',
              tooltip: 'Сбросить фильтры',
            },
          },
          {
            reference: 'filter-btn',
            listeners: {
              click: 'onFilterBtnClick',
            },
            renderConfig: {
              tooltip: 'Показать/скрыть панель фильтров',
              icon: 'icon-filter3',
              popover: true,
            },
          },
        ],
      });
    }

    super(p);
  }

  initComponent() {
    this.blockCmp = this.grid;

    super.initComponent();

    this.initButtons();

    this.initDropdown();

    this.grid.on('tabledraw', this.onGridTableDraw.bind(this));
  }

  initButtons() {
    const { buttons } = this;

    if (buttons) {
      buttons.forEach((config) => {
        GridSettingsWidget.configDefaults(config, {
          $renderTo: this.childs.$buttonsCt,
          component: GridSettingsBtn,
        });

        this.addChildComponent(config);
      });
    }
  }

  onClearBtnClick() {
    this.grid.clearFilters();
  }

  onFilterBtnClick() {
    this.grid.toggleFilterRow();
  }

  initDropdown() {
    const { grid, $el, childs, dropdownVisibleCls } = this;
    const { $columnsVisibleToggleMenu } = childs;
    const { baseCls, columns = [], table } = grid;

    columns
      .filter(
        ({ type, hidden }) => !hidden && !grid.specialColumns.includes(type)
      )
      .forEach((col, index) => {
        const id = `${baseCls}-column-${index}`;
        const checkbox = $(
          `<input type="checkbox" class="form-check-input-styled goods-grid-stock-availability-checkbox" checked id="${id}">`
        );
        const label = $(
          `<label class="form-check-label ml-2 w-100" for="${id}">${
            col.title || ''
          }</label>`
        );
        const menuItem = $(
          '<div class="goods-grid-settings-dropdown-item p-0"></div>'
        );
        const formCheck = $(
          '<div class="form-check form-check-inline w-100 h-100 py-1"></div>'
        );

        checkbox.appendTo(formCheck);
        label.appendTo(formCheck);
        formCheck.appendTo(menuItem);
        menuItem.appendTo($columnsVisibleToggleMenu);

        const dtColumn = grid.getColumnByName(col.name).header();

        dtColumn._visibleStateCheckbox = checkbox;

        menuItem.click((e) => this.onColumnsVisibleMenuItemClick(e, col.name));
      });

    table.on('column-visibility.dt', (e, settings, index, state) => {
      const col = table.column(index).header();
      const { _visibleStateCheckbox } = col;

      if (_visibleStateCheckbox) {
        setCheckboxState(_visibleStateCheckbox, state);
      }
    });

    $el.on({
      'show.bs.dropdown': () => $el.addClass(dropdownVisibleCls),
      'hide.bs.dropdown': () => $el.removeClass(dropdownVisibleCls),
    });
  }

  onColumnsVisibleMenuItemClick(e, columnName) {
    e.stopPropagation();
    e.preventDefault();

    this.grid.toggleGridColumnVisible(columnName);
  }

  getRenderData() {
    const { baseCls, filterBtnCls, dropdownCls } = this;

    return {
      baseCls,
      filterBtnCls,
      dropdownCls,
    };
  }

  onGridTableDraw() {
    const { filterBtn, grid } = this;
    const { hasFilterValues } = grid;
    let filterValuesTableHtml = '';

    if (!filterBtn) {
      return;
    }

    filterBtn.toggleCls(this.filterBtnCls + '--has-value', hasFilterValues);

    filterBtn.popover = hasFilterValues ? 'enable' : 'disable';

    if (hasFilterValues) {
      filterValuesTableHtml = this.filterValuesTableTpl({
        filters: grid.filterColumnsValues,
      });
    }

    filterBtn.setElAttr('data-content', filterValuesTableHtml);
  }
}

GridSettingsWidget.initMixins(['renderable']);

export default GridSettingsWidget;
