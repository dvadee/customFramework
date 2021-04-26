import Form from '@/core/form/form';
import ImportSheetFormMixin from '../sheet/form/import-sheet-form';
import ImportSheetTabs from '@/core/import/sheet/tabs/import-sheet-tabs';

/**
 * @class ImportForm
 * @extends Form
 * @prop {ImportSheetTabs} sheetTabs
 */
class ImportForm extends Form {
  constructor(p) {
    ImportForm.mergeConfig(p, {
      cls: ['card', 'd-flex', 'flex-column', 'h-100'],
      childs: [
        {
          reference: 'sheet-tabs',
          component: ImportSheetTabs,
          sheets: [],
          replaceRenderTo: true,
          cls: ['flex-fill'],
          listeners: {
            headernamechange: 'onTableHeaderNameChange',
          },
        },
      ],
      viewModel: {
        data: {
          availableHeaders: [],
        },
      },
    });

    super(p);
  }

  setFormData(data) {
    super.setFormData(data);

    const { availableHeaders, sheets } = data;

    this.viewModel.set({
      availableHeaders,
    });

    this.sheetTabs.setSheets(sheets);
  }
}

ImportForm.initMixins(['renderable', ImportSheetFormMixin]);

export default ImportForm;
