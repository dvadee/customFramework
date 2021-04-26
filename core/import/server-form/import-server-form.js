import ServerForm from '@/core/server/form/server-form';
import ImportSheetTabs from '@/core/import/sheet/tabs/import-sheet-tabs';
import ImportSheetFormMixin from '../sheet/form/import-sheet-form';

class ImportServerForm extends ServerForm {
  constructor(p) {
    ImportServerForm.mergeConfig(p, {
      cls: ['card', 'd-flex', 'flex-column', 'h-100'],
      childs: [
        {
          reference: 'sheet-tabs',
          component: ImportSheetTabs,
          replaceRenderTo: true,
          cls: ['flex-fill'],
          sheets: p.modelData?.sheets || [],
          listeners: {
            headernamechange: 'onTableHeaderNameChange',
          },
        },
      ],
      viewModel: {
        data: {
          availableHeaders: p.modelData?.availableHeaders || [],
        },
      },
    });

    super(p);
  }
}

ImportServerForm.initMixins([ImportSheetFormMixin]);

export default ImportServerForm;
