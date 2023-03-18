<template>
  <div class="accordion">
    <button
      class="accordion__toggle"
      :class="{ 'accordion__toggle--expanded': expanded }"
      @click="expanded = !expanded"
    >
      <span>{{ label }}</span>
    </button>
    <div class="accordion__container" :class="{ 'accordion__container--expanded': expanded }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  const props = defineProps({
    label: String
  })

  const expanded = ref(false)
</script>

<style lang="scss">
@import '../scss/variables';

.accordion {
  border: 1px solid $blue;
  border-radius: 4px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.10);
  padding: 0;
  overflow: hidden;

  &__toggle {
    width: 100%;
    background-color: $blue;
    color: white;
    font-family: $default-font;
    font-weight: normal;
    font-size: 18px;
    text-align: left;
    border: 0;
    margin: 0;
    padding: 8px;
    padding-right: 46px;
    cursor: pointer;
    position: relative;

    &::after {
      content: '';
      width: 32px;
      height: 32px;
      display: inline-block;
      background-image: url('../assets/icons/icon_down_white.svg');
      position: absolute;
      right: 4px;
      top: 0;
      bottom: 0;
      margin: auto;
    }

    &--expanded {
      &::after {
        background-image: url('../assets/icons/icon_up_white.svg');
      }
    }
  }

  &__container {
    display: none;

    &--expanded {
      display: block;
    }
  }
}
</style>
