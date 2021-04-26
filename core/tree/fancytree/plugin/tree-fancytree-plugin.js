$.ui.fancytree.registerExtension({
  name: 'coretree',

  version: '@VERSION',

  treeInit(ctx) {
    this.coreTree = ctx.options.coreTree;

    this._superApply(arguments);
  },
});
