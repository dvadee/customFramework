import Component from '@/core/component';

class LayoutRow extends Component {
  constructor(p) {
    LayoutRow.mergeConfig(p, {
      baseCls: 'row',
    });

    LayoutRow.configDefaults(p, {
      renderable: true,
    });

    super(p);
  }
}

LayoutRow.initMixins(['renderable']);

export default LayoutRow;
