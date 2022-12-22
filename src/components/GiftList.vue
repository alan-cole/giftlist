<template>
  <div class="gift-list">
    <div class="gift-list__details">
      <NavItem type="link" :newWindow="true" :to="gift.link" :label="gift.name" :price="gift.price" />
      <ul v-if="gift.buyers" class="gift-list__buyers">
        <li
          v-for="(buyer, buyerIndex) in gift.buyers"
          :key="`${giftId}-buyer-${buyerIndex}`"
          class="gift-list__buyer"
          :class="{
            'gift-list__buyer--self': buyer.self,
            'gift-list__buyer--solid': getBuyStateLabel(buyer.state) === 'bought'
          }"
        >
          <span>{{ buyer.name }}</span>
          <span> - {{ getBuyStateLabel(buyer.state) }}</span>
        </li>
      </ul>
      <div class="gift-list__buy-state">
        <span class="gift-list__buy-state-label">{{ getCurrentBuyStateLabel(gift.buyers) }}</span>
        <BuyButton :state="getNextBuyState(gift.buyers)" :disabled="disabled" @toggle="toggleBuyState(gift)" />
      </div>
    </div>
  </div>
</template>

<script>
import NavItem from './NavItem.vue'
import BuyButton from './BuyButton.vue'
export default {
  name: 'GiftList',
  props: {
    giftId: String,
    gift: Object,
    disabled: Boolean
  },
  components: {
    NavItem,
    BuyButton
  },
  methods: {
    getSelfBuyer (buyers) {
      return buyers ? buyers.filter(buyer => buyer.self)[0] : null
    },
    getBuyStateLabel (state) {
      let rtn = ''
      switch (state) {
        case undefined:
        case 0:
        case 1:
          rtn = 'planning'
          break
        case 2:
          rtn = 'bought'
          break
        case 3:
          rtn = 'unbuy'
          break
        default:
          break
      }
      return rtn
    },
    getBuyState (state) {
      // 0 = Not buying, 1 = Planning, 2 = Bought
      return (state === undefined || state === 0) ? 0 : state
    },
    getNextBuyState (buyers) {
      const buyer = this.getSelfBuyer(buyers)
      return this.getBuyStateLabel(buyer ? buyer.state + 1 : 0)
    },
    getCurrentBuyState (buyers) {
      const buyer = this.getSelfBuyer(buyers)
      return this.getBuyStateLabel(buyer ? buyer.state : 0)
    },
    getCurrentBuyStateLabel (buyers) {
      const buyer = this.getSelfBuyer(buyers)
      let response = 'You have not bought this.'
      if (buyer) {
        switch (this.getBuyState(buyer.state)) {
          case 1:
            response = 'You are planning to buy this.'
            break
          case 2:
            response = 'You have bought this.'
            break
        }
      }
      return response
    },
    async toggleBuyState (gift) {
      const buyer = this.getSelfBuyer(gift.buyers)
      const state = buyer ? (buyer.state || 0) : 0
      this.$emit('buy', gift, buyer, state)
    }
  }
}
</script>

<style lang="scss">
@import '../scss/_variables.scss';

.gift-list {
  $root: &;
  padding: 12px 8px;
  box-sizing: border-box;
  border: 0;

  &__buyers {
    padding: 0;
    margin: 0;
    margin-top: 12px;
    margin-left: auto;
    list-style: none;
  }

  &__buyer {
    background-color: $background;
    color: $foreground;
    border: 2px solid $blue;
    padding: 4px 8px;
    margin: 4px 0;
    border-radius: 4px;
    margin-right: 8px;
    font-size: 12px;
    font-family: $default-font;
    display: inline-block;

    &--solid {
      background-color: $blue;
      color: $white;
    }

    &--self {
      border-width: 2px;
      border-color: $green;

      &#{$root}__buyer--solid {
        background-color: $green;
        color: $black;
        border-color: transparent;
      }
    }
  }

  &__buy-state {
    padding-top: 4px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  &__buy-state-label {
    font-size: 12px;
    font-family: $default-font;
    color: $foreground;
  }
}
</style>
