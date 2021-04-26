import Container from '@/core/container/container';
/**
 * @class TabsComponentBody
 * @extend Component
 *
 */
class TabsComponentBody extends Container {
  constructor(p) {
    TabsComponentBody.configDefaults(p, {
      baseCls: 'tab-content',
    });

    super(p);
  }
}

export default TabsComponentBody;
