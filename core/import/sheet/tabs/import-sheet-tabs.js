import TabsComponent from '@/core/tabs-component/tabs-component';
import ImportSheetTabsItem from '@/core/import/sheet/tabs/item/import-sheet-tabs-item';

/**
 * @class ImportSheetTabs
 * @extend TabsComponent
 * @prop sheets - табы
 * @prop headers - заголовки в селект th
 */
class ImportSheetTabs extends TabsComponent {
  constructor(p) {
    ImportSheetTabs.configDefaults(p, {
      fitContent: true,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    this.header.addCls('nav-tabs-bottom', 'mb-0');

    this.initSheets();
  }

  getSheets() {
    return this.body.getItems();
  }

  setSheets(sheets = []) {
    sheets.forEach((sheet, index) => {
      sheet.index = index;
    });

    const items = sheets.map((sheet) => ({
      component: ImportSheetTabsItem,
      title: `Вкладка ${sheet.index + 1}`,
      sheet,
    }));

    this.setItems(items);
  }

  initSheets() {
    const { sheets } = this;

    if (sheets && sheets.length > 0) {
      this.setSheets(sheets);
    }
  }

  getSheetsParams() {
    return this.getSheets().map(({ table }) => table.getSheetMarkup());
  }

  getHeaders() {
    return this.getSheets().map(({ table }) => table.headers);
  }
}

export default ImportSheetTabs;
