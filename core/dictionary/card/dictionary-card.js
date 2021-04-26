import Card from '@/core/card/card';
import DictionaryCardHeader from '@/core/dictionary/card/header/dictionary-card-header';

class DictionaryCard extends Card {
  constructor(p) {
    DictionaryCard.configDefaults(p, {
      enableHeader: true,
      headerComponent: DictionaryCardHeader,
    });

    super(p);
  }
}

export default DictionaryCard;
