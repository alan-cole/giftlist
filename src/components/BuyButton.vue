<template>
  <button class="small-button" :class="btnClass" @click="click" :disabled="disabled">
    {{ label }}
  </button>
</template>

<script>
export default {
  name: 'BuyButton',
  props: {
    state: String,
    disabled: Boolean,
    label: String
  },
  computed: {
    btnClass () {
      return {
        'small-button--solid': (this.state === 'bought'),
        'small-button--warn': (this.state === 'unbuy')
      }
    }
  },
  methods: {
    click () {
      this.$emit('toggle')
    }
  }
}
</script>

<style lang="scss">
@import '../scss/_variables.scss';

.small-button {
  cursor: pointer;
  font-family: $button-font;
  background-color: $background;
  background-image: $foreground-arrow-next;
  background-size: 18px;
  background-repeat: no-repeat;
  background-position: 2px center;
  color: $foreground;
  border: 2px solid $green;
  padding: 4px 4px 4px 24px;
  border-radius: 4px;
  box-size: border-box;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.5;
  }

  &--solid {
    background-color: $green;
    color: $black;
    background-image: url('../assets/icons/icon_next_black.svg');
    border-color: transparent;
  }

  &--warn {
    background-color: $red;
    color: $white;
    background-image: url('../assets/icons/icon_next_white.svg');
    border-color: transparent;
  }
}
</style>
