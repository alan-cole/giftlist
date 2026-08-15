<template>
  <div class="top-menu" :class="{ 'top-menu--has-back': previousPage }">
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

<style>
.top-menu {
  background-color: var(--blue);
  display: flex;
  align-items: center;
  height: 66px;

  &.top-menu--has-back {
    padding-right: 36px;
  }

  .top-menu__back {
    background-image: url('../assets/icons/icon_back_white.svg');
    background-position: center;
    background-repeat: no-repeat;
    width: 36px;
    height: 36px;
  }

  .top-menu__title {
    margin: auto;
    font-family: var(--default-font);
    font-style: normal;
    font-weight: normal;
    font-size: 22px;
    line-height: normal;
    text-align: center;
    color: var(--white);
  }
}
</style>
