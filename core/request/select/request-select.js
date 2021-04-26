import Select2 from '../../select2/select2';

class RequestSelect extends Select2 {
  constructor(p) {
    RequestSelect.mergeConfig(p, {
      rowTpl: /*html */ `
        <div class="d-flex align-items-center">
          <div class="badge <% if (isBad) { %>bg-warning<% } else { %>badge-success<% } %> mr-2">{{statusName}}</div>
          <div>{{title}}</div>
          <% if (fromB2B) { %> <div class="badge bg-teal ml-2">B2B</div> <% } %>
        </div>
      `,
      textField: 'title',
      valueField: 'requestId',
      config: {
        dropdownAutoWidth: true,
      },
      sorter: {
        direction: 'ASC',
        property: 'status',
      },
    });

    super(p);
  }

  initComponent() {
    this.setDataAttrValues({
      ref: 'request-select',
      fouc: true,
      style: '100%',
      placeholder: 'Выберите запрос из списка...',
    });

    this.initDummyOption();

    super.initComponent();
  }

  loadOptions(data) {
    data.forEach((request) => {
      request.isBad = request.status >= 20;
    });

    super.loadOptions(data);
  }

  async refreshRequests() {
    const requestId = this.value;

    await this.reload();

    if (requestId) {
      this.forceValueChange(requestId);
    }
  }

  clearRequests() {
    this.loadOptions([]);

    this.initDummyOption();

    this.setValue(null);
  }
}

export default RequestSelect;
