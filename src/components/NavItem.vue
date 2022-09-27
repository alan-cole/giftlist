<template>
  <div
    class="nav-item"
    :class="{ 'nav-item--forward' : decal === 'arrow' }"
  >
    <slot name="before"></slot>
    <div class="nav-item__body">
      <button
        v-if="type === `button`"
        class="nav-item__link nav-item__link--clickable"
        @click="click"
      >{{ label }}</button>
      <a
        v-else-if="newWindow && to && type === `link`"
        :href="to"
        target="_blank"
        class="nav-item__link nav-item__link--clickable"
      >{{ label }}</a>
      <router-link
        v-else-if="!newWindow && to && type === `link`"
        :to="to"
        class="nav-item__link nav-item__link--clickable"
      >{{ label }}</router-link>
      <span
        v-else
        class="nav-item__link"
      >{{ label }}</span>
      <div v-if="subItem" class="nav-item__sub">
        <span>{{ subItem }}</span>
      </div>
    </div>
    <slot name="after"></slot>
  </div>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
    type: String,
    to: String,
    label: String,
    newWindow: Boolean,
    subItem: String,
    click: Function,
    decal: String
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/_variables.scss';

.nav-item {
  display: block;
  width: 100%;
  display: flex;
  align-items: flex-start;

  &__body {
    flex-grow: 1;
  }

  &__link {
    background-color: transparent;
    margin: 0;
    padding: 0;
    margin-top: 6px;
    margin-bottom: 6px;
    border: 0;
    display: inline-block;
    font-family: $default-font;
    font-size: 16px;
    text-decoration: none;
    color: $foreground;

    &--clickable {
      cursor: pointer;
      text-decoration: underline;

      &:hover, &:focus {
        color: $blue;
      }
    }
  }

  &--forward {
    &::after {
      content: '';
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      background-size: 26px;
      background-repeat: no-repeat;
      background-position: center;
      margin-left: auto;
      background-image: url('../assets/icons/icon_next_blue.svg');
    }
  }

  &__sub {
    color: $foreground;
    font-size: 14px;
    font-family: $default-font;
  }
}
</style>
