import GridSettingsWidget from '@/core/grid/settings/widget/grid-settings-widget';

class RequestProductGridSettingsWidget extends GridSettingsWidget {
  constructor(p) {
    RequestProductGridSettingsWidget.mergeConfig(p, {
      buttons: [
        {
          reference: 'toggle-rows-without-offers-btn',
          listeners: {
            click: 'onToggleRowsWithoutOfferBtnClick',
          },
          renderConfig: {
            tooltip: 'Показать/Скрыть не найденное',
            icon: 'icon-eye-minus',
          },
        },
      ],
    });

    super(p);
  }

  onToggleRowsWithoutOfferBtnClick() {
    this.grid.toggleRowsWithoutOfferHidden();
  }
}

export default RequestProductGridSettingsWidget;
