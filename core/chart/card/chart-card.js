import Card from '@/core/card/card';

/**
 * @class ChartCard
 * @extends Card
 * @prop {Chart} chart
 * @prop chartComponent
 * @prop chartConfig
 */
class ChartCard extends Card {
  constructor(p) {
    if (!p.chartComponent) {
      throw new Error('ChartCard - chartComponent required!');
    }

    ChartCard.configDefaults(p, {
      chartConfig: {},
      refreshable: true,
    });

    ChartCard.mergeConfig(p, {
      autoRenderBody: true,
    });

    super(p);
  }
  initComponent() {
    super.initComponent();

    this.addChildComponent(this.chartConfig);
  }

  initPluginConfig() {
    ChartCard.mergeConfig(this.chartConfig, {
      cls: ['h-100'],
      reference: 'chart',
      $renderTo: this.$body,
      component: this.chartComponent,
    });
  }

  refresh() {
    this.chart.reload();
  }
}

export default ChartCard;
