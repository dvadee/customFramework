import CardHeader from '@/core/card/header/card-header';
import renderTpl from './dictionary-card-header.pug';

class DictionaryCardHeader extends CardHeader {
  constructor(p) {
    DictionaryCardHeader.configDefaults(p, {
      scopedChildsReferences: true,
      childs: ['toolbar'],
      refreshable: true,
      renderTpl,
    });

    super(p);
  }
}

export default DictionaryCardHeader;
