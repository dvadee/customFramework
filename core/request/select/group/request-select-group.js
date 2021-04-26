import Component from '@/core/component';
import RequestSelect from '@/core/request/select/request-select';
import Button from '@/core/button/button';
import { alias } from '@/core/util/function';
import ErrorHandler from '@/core/error/handler/error-handler';

const renderTpl = `
<div class="input-group flex-nowrap">
  <div class="flex-fill w-0">
    <select data-ref="select"></select>
  </div>
  <div class="input-group-append">
    <button data-ref="refresh-btn"></button>
  </div>
</div>
`;

/**
 * @class RequestSelectGroup
 * @extends Component
 * @prop select
 * @prop refreshBtn
 */
class RequestSelectGroup extends Component {
  constructor(p) {
    RequestSelectGroup.configDefaults(p, {
      childs: [
        {
          reference: 'select',
          component: RequestSelect,
          ...p.selectConfig,
        },
        {
          reference: 'refresh-btn',
          component: Button,
          cls: 'btn btn-light',
          renderConfig: {
            icon: 'icon-reload-alt',
          },
          listeners: {
            click: 'onRefreshBtnClick',
          },
        },
      ],
      renderTpl,
    });

    super(p);
  }

  get requestId() {
    return this.select.value;
  }

  set requestId(id) {
    this.select.value = id;
  }

  initComponent() {
    super.initComponent();

    const { select } = this;

    this.load = alias(select, 'load');
    this.reload = alias(select, 'reload');
    this.getSelectionData = alias(select, 'getSelectionData');

    select.on({
      loadingstart: this.onSelectLoadingStart.bind(this),
      loadingend: this.onSelectLoadingEnd.bind(this),
    });
  }

  initEvents() {
    super.initEvents();

    this.relayEvents(this.select, ['change', 'load'], '');
  }

  onSelectLoadingStart() {
    this.loading = true;
  }

  onSelectLoadingEnd() {
    this.loading = false;
  }

  onRefreshBtnClick() {
    this.refreshRequests();
  }

  async refreshRequests() {
    try {
      await this.select.refreshRequests();
    } catch (err) {
      ErrorHandler.handleError(err);
    }
  }
}

RequestSelectGroup.initMixins(['renderable']);

export default RequestSelectGroup;
