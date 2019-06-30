<template>
  <div class="top-menu">
    <router-link v-if="previousPage" class="top-menu__back" :to="previousPage">
      <span class="visually-hidden">Back</span>
    </router-link>
    <h1 class="top-menu__title">{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'TopMenu',
  props: {
    previousPage: String,
    title: String
  }
}
</script>

<style lang="scss">
@import '../scss/variables';

.top-menu {
  background-color: $blue;
  display: flex;
  align-items: center;
  height: 66px;

  &__back {
    background-image: url('../assets/icons/icon_back_white.svg');
    background-position: center;
    background-repeat: no-repeat;
    width: 36px;
    height: 36px;
  }

  &__title {
    margin: auto;
    font-family: 'Karla', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 26px;
    line-height: normal;
    text-align: center;
    color: $white;
  }
}
</style>
