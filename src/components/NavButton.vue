<template>
  <button
    v-if="type === 'button'"
    class="nav-button"
    :class="classes"
    @click="onClick"
    :disabled="disabled"
  >{{ label }}</button>
  <router-link
    v-else-if="type === 'link'"
    class="nav-button"
    :class="classes"
    :to="to"
    :disabled="disabled"
  >{{ label }}</router-link>
</template>

<script>
export default {
  name: 'NavButton',
  props: {
    type: String,
    variation: String,
    label: String,
    disabled: Boolean,
    to: Object
  },
  computed: {
    classes () {
      return {
        'nav-button--add': this.variation === 'add',
        'nav-button--edit': this.variation === 'edit',
        'nav-button--delete': this.variation === 'delete'
      }
    }
  },
  methods: {
    onClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
@import '../scss/_variables.scss';

.nav-button {
  border: 0;
  padding: 0;
  margin: 0;
  width: 32px;
  height: 32px;
  background-color: transparent;
  background-size: 26px;
  background-repeat: no-repeat;
  background-position: center;
  margin-left: auto;
  font-size: 0;
  cursor: pointer;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.5;
  }

  &--left {
    margin-left: 0;
    margin-right: 8px;
  }

  &--edit {
    background-image: url('../assets/icons/icon_edit_blue.svg');
  }

  &--delete {
    background-image: url('../assets/icons/icon_delete_red.svg');
  }

  &--add {
    background-image: url('../assets/icons/icon_add_blue.svg');
  }

  &--unchecked,
  &--checked {
    background-color: $background-alt;
    border: 2px solid $blue;
    border-radius: 4px;
    margin-top: 6px;
    width: 22px;
    height: 22px;
  }

  &--checked {
    background-image: url('../assets/icons/icon_check_blue.svg');
  }
}
</style>
