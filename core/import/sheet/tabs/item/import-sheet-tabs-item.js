import TabsComponentItem from '@/core/tabs-component/item/tabs-component-item';
import ImportSheetTable from '@/core/import/sheet/table/import-sheet-table';
/**
 * @class ImportSheetTabsItem
 * @extend TabsComponentItem
 * @description содержит таблицу
 */
class ImportSheetTabsItem extends TabsComponentItem {
  constructor(p) {
    const { sheet } = p;

    ImportSheetTabsItem.mergeConfig(p, {
      items: [
        {
          reference: 'table',
          component: ImportSheetTable,
          sheet,
        },
      ],
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.table.adjustSize();
  }

  onTabShow() {
    this.table.adjustSize();
  }
}

export default ImportSheetTabsItem;
