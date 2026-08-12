<template>
  <button class="small-button" :class="btnClass" @click="click" :disabled="disabled">
    {{ label }}
  </button>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    label: String,
    theme: { type: String, default: 'default' },
    disabled: Boolean
  })

  const emit = defineEmits(['toggle'])

  const btnClass = computed(() => ({
    'small-button--red': (props.theme === 'red')
  }))

  function click () {
    emit('toggle')
  }
</script>

<style lang="scss">
@use '../scss/_variables.scss';

.small-button {
  cursor: pointer;
  font-family: variables.$button-font;
  background-color: variables.$blue;
  background-image: url('../assets/icons/icon_next_white.svg');
  background-size: 18px;
  background-repeat: no-repeat;
  background-position: 2px center;
  color: variables.$white;
  border: 2px solid variables.$blue;
  padding: 4px 4px 4px 24px;
  border-radius: 4px;
  box-size: border-box;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.5;
  }

  &--red {
    background-color: variables.$red;
    border-color: transparent;
  }
}
</style>
