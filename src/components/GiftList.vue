<template>
  <div class="gift-list">
    <div class="gift-list__details">
      <NavItem
        type="link"
        :newWindow="true"
        :to="gift.link"
        :label="gift.name"
        :price="gift.price"
      >
        <template #after>
          <BuyButton
            :label="buttonLabel(gift.buyers)"
            :theme="buttonTheme(gift.buyers)"
            :disabled="disabled"
            @toggle="toggleBuyState(gift)"
          />
        </template>
      </NavItem>
      <ul v-if="gift.buyers" class="gift-list__buyers">
        <li
          v-for="(buyer, buyerIndex) in gift.buyers"
          :key="`${giftId}-buyer-${buyerIndex}`"
          class="gift-list__buyer"
          :class="{
            'gift-list__buyer--self': buyer.self,
            'gift-list__buyer--solid': (buyer.state === 2)
          }"
        >
          <span>{{ buyer.name }}</span>
          <span> - {{ getBuyStateLabel(buyer.state) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import NavItem from './NavItem.vue'
  import BuyButton from './BuyButton.vue'

  const props = defineProps({
    giftId: String,
    gift: Object,
    disabled: Boolean
  })

  const emit = defineEmits(['buy'])

  function getSelfBuyer (buyers) {
    return buyers ? buyers.filter(buyer => buyer.self)[0] : null
  }

  function getBuyStateLabel (state) {
    let rtn = ''
    switch (state) {
      case undefined:
      case 0:
      case 1:
        rtn = 'Planning'
        break
      case 2:
        rtn = 'Bought'
        break
      default:
        break
    }
    return rtn
  }

  function buyState (buyers) {
    const buyer = getSelfBuyer(buyers)
    return getBuyStateLabel(buyer ? buyer.state + 1 : 0)
  }

  function buttonLabel (buyers) {
    const buyer = getSelfBuyer(buyers)
    switch (buyer?.state) {
      case undefined:
      case 0:
        return 'Plan'
      case 1:
        return 'Buy'
      case 2:
        return 'Clear'
      default:
        break
    }
  }

  function buttonTheme (buyers) {
    const buyer = getSelfBuyer(buyers)
    return buyer?.state === 2 ? 'red' : 'default'
  }

  async function toggleBuyState (gift) {
    const buyer = getSelfBuyer(gift.buyers)
    const state = buyer ? (buyer.state || 0) : 0
    emit('buy', gift, buyer, state)
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
}
</style>
