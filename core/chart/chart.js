import echarts from 'echarts';
import Component from '../component';

const renderTpl = '<div></div>';

/**
 * @class Chart
 * @extends Component
 */
class Chart extends Component {
  /**
   *
   * @param {Object} p
   * @param {Object} p.chartConfig
   */
  constructor(p) {
    Chart.configDefaults(p, {
      cls: ['h-100'],
      renderTpl,
    });

    super(p);
  }

  initComponent() {
    super.initComponent();

    const { config } = this;

    const chart = echarts.init(this.domEl);

    chart.setOption(config);

    this.chart = chart;
  }

  initEvents() {
    $(document).on({
      'dashboard.sidebartoggle': () => this.resize(),
      'custom.resize': () => this.resize(),
    });

    $(window).on({
      resize: () => this.resize(),
    });
  }

  initPluginConfig() {
    const cfg = {
      textStyle: {
        fontFamily: 'Roboto, Arial, Verdana, sans-serif',
        fontSize: 10,
      },
      animationDuration: 750,
      legend: {
        itemHeight: 8,
        itemGap: 10,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: [25, 10],
        textStyle: {
          fontSize: 10,
          fontFamily: 'Roboto, sans-serif',
        },
      },
      grid: {
        left: 0,
        right: 40,
        top: 35,
        bottom: 0,
        containLabel: true,
      },
    };

    this.config = cfg;

    return cfg;
  }

  setLoading(loading) {
    const { chart } = this;

    chart[loading ? 'showLoading' : 'hideLoading']();
  }
  /**
   *
   * @param {Object} p
   * @param {Object} p.xAxis
   * @param {Object} p.yAxis
   */
  setData({ xAxis, yAxis, series }) {
    this.chart.setOption({
      xAxis,
      yAxis,
      series,
    });
  }

  resize(p) {
    this.chart.resize(p);
  }

  /**
   *
   * @param {Object} p
   * @param {Number} p.dataZoomIndex optional; index of dataZoom component; useful for are multiple dataZoom components; 0 by default
   * @param {Number} p.start percentage of starting position; 0 - 100
   * @param {Number} p.end percentage of ending position; 0 - 100
   * @param {Number} p.startValue data value at starting location
   * @param {Number} p.endValue data value at ending location
   */

  zoom(params) {
    if (!params) {
      throw new Error('Chart.zoom - params argument required!');
    }

    params.type = 'dataZoom';

    this.chart.dispatchAction(params);
  }
}

Chart.initMixins(['renderable']);

export default Chart;
