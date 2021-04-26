import assert from 'assert';
import { isFunction, assign, defaults, chain } from 'lodash';
import { createRefName } from '@/core/util/identifier';
import Component from '../../component';
import CardHeaderTool from '@/core/card/header/tool/card-header-tool';
import renderTpl from './card-header.pug';

/**
 * @class CardHeader
 * @extend Component
 * @prop {Object[]|Object} tools
 * @prop {String} collapseToolExpandedStateCls
 * @prop {String} toolsType - 'tool', 'button'
 * @prop {Card} card
 */
class CardHeader extends Component {
  constructor(p) {
    const { card } = p;

    CardHeader.configDefaults(p, {
      scopedChildsReferences: true,
      tools: [],
      toolsType: 'tool',
      collapsed: false,
      renderTpl,
    });

    CardHeader.mergeConfig(p, {
      scopedChildsReferences: true,
      childs: ['title', 'tools-list-el', 'header-elements-ct'],
      prepend: true,
      collapseToolExpandedStateCls: 'rotate-180',
      props: {
        title: undefined,
      },
    });

    const { tools } = p;

    if (card.collapsible) {
      tools.push({
        reference: 'collapse-tool',
        icon: 'icon-arrow-down12',
        action: 'toggleCollapsed',
        cls: card.collapsed ? p.collapseToolExpandedStateCls : '',
      });
    }

    if (card.refreshable) {
      tools.push({
        reference: 'refresh-tool',
        icon: 'icon-sync',
        action: 'refresh',
        title: 'Обновить',
      });
    }

    if (card.maximizable) {
      tools.push({
        reference: 'full-screen-tool',
        icon: 'icon-screen-full',
        action: 'toggleFullscreen',
        title: 'Во весь экран',
      });
    }

    if (card.closable) {
      tools.push({
        reference: 'close-tool',
        icon: 'icon-cross2',
        action: 'close',
        title: 'Закрыть',
      });
    }

    super(p);
  }

  get $headerElementsCt() {
    return this.childs.$headerElementsCt;
  }

  get $toolsListEl() {
    return this.childs.$toolsListEl;
  }

  get $containerEl() {
    return this.$headerElementsCt;
  }

  initComponent() {
    super.initComponent();

    this.initTools();

    this.initToolsList();
  }

  initEvents() {
    this.card.on({
      collapse: this.onCardCollapse.bind(this),
      expand: this.onCardExpand.bind(this),
      minimize: this.onCardMinimize.bind(this),
      maximize: this.onCardMaximize.bind(this),
    });
  }

  onToolClick(tool, e) {
    e.stopPropagation();
    e.preventDefault();

    const { card } = this;
    const { action, event } = tool;

    if (event) {
      card.triggerHeaderToolEvent(event);
    } else if (isFunction(action)) {
      action();
    } else {
      card[action]();
    }
  }

  initTools() {
    this.tools = chain(this.tools)
      .map((tool, i) => defaults(tool, { weight: i }))
      .sortBy('weight')
      .reduce((obj, toolConfig) => {
        const name = createRefName(toolConfig.reference);

        obj[name] = this.addTool(toolConfig);

        return obj;
      }, {})
      .value();
  }

  addTool(toolConfig) {
    const { toolsType, $toolsListEl } = this;

    assert.ok(!!toolConfig.reference, 'ToolConfig - reference required!');

    defaults(toolConfig, {
      toolType: toolsType,
    });

    assign(toolConfig, {
      component: CardHeaderTool,
      $renderTo: $toolsListEl,
      handler: this.onToolClick.bind(this),
    });

    return this.addChildComponent(toolConfig);
  }

  initToolsList() {
    const { toolsType } = this;
    const cls = toolsType === 'button' ? 'btn-group' : 'list-icons';

    this.$toolsListEl?.addClass(cls);
  }

  onCardCollapse() {
    const { collapseTool } = this.tools;

    if (collapseTool) {
      collapseTool.addCls(this.collapseToolExpandedStateCls);
    }
  }

  onCardExpand() {
    const { collapseTool } = this.tools;

    if (collapseTool) {
      collapseTool.removeCls(this.collapseToolExpandedStateCls);
    }
  }

  onCardMinimize() {
    const { fullScreenTool } = this.tools;

    if (fullScreenTool) {
      fullScreenTool.icon = 'icon-screen-full';
      fullScreenTool.title = 'На весь экран';
    }
  }

  onCardMaximize() {
    const { fullScreenTool } = this.tools;

    if (fullScreenTool) {
      fullScreenTool.icon = 'icon-screen-normal';
      fullScreenTool.title = 'Восстановить размер';
    }
  }

  getRenderData() {
    const { card } = this;

    return {
      title: card.title,
    };
  }

  updateTitle(text) {
    const { $title } = this.childs;

    $title.text(text);
    $title.attr('title', text);
  }
}

CardHeader.initMixins(['renderable']);

export default CardHeader;
