import Card from '@/core/card/card';
import MixinManager from '@/core/mixin/manager';
import ServerFormOwner from '@/core/server/form/owner/server-form-owner';

class ServerFormCard extends Card {
  initComponent() {
    super.initComponent();

    this.$formCt.addClass('overflow-auto');
  }

  get $formCt() {
    return this.$containerEl;
  }

  processLoadData(data) {
    this.initForm(data);
  }
}

MixinManager.applyMixin(ServerFormCard.prototype, ServerFormOwner);

export default ServerFormCard;
