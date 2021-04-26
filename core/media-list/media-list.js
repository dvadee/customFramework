import List from '../list/list';
import { template } from 'lodash';

const itemTpl = `
  <li>
    <div class="media">
        <div class="media-image-ct">
            <img class="media-image rounded-circle" src="{{imageUrl}}" width="42" height="42">
        </div>
        <div class="media-body">
            <h6 class="media-title">{{title}}</h6>
            {{desc}}
        </div>
    </div>
  </li>
`;

const headerTpl = `
  <li class="media font-weight-semibold">{{text}}</li>
`;

const emptyTpl = /*html */ `
  <li class="media text-muted py-2">{{text}}</li>
`;

class MediaList extends List {
  constructor(p) {
    MediaList.configDefaults(p, {
      bordered: false,
      selectable: false,
      emptyTpl,
      itemTpl,
      headerTpl,
    });

    MediaList.mergeConfig(p, {
      baseCls: 'media-list',
      childs: ['media'],
    });

    super(p);

    // Переопределение List.itemCls
    this.itemCls = ['media-list-item'];
  }

  initComponent() {
    super.initComponent();
    const { headerTpl, bordered } = this;

    if (headerTpl) {
      this.headerTpl = template(headerTpl);
    }

    if (bordered) {
      this.addCls('media-list-bordered');
    }
  }

  /**
   *
   * @return {boolean}
   */
  isHeaderItem() {
    return false;
  }

  renderItem(data) {
    const isHeader = this.isHeaderItem(data);

    return this[isHeader ? 'headerTpl' : 'itemTpl'](data);
  }
}

export default MediaList;
