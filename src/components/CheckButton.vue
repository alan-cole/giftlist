<template>
  <button @click="onClick" :class="{
    'check-button': true,
    'check-button--left': true,
    'check-button--checked': isChecked,
    'check-button--unchecked': !isChecked
  }">{{ label }}</button>
</template>

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    checked: Boolean,
    label: String
  })

  const emit = defineEmits(['click'])

  const isChecked = ref(props.checked)

  watch(
    () => props.checked,
    (val) => {
      isChecked.value = val
    }
  )

  function onClick () {
    emit('click')
  }
</script>

<style lang="scss">
@import '../scss/_variables.scss';

.check-button {
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
