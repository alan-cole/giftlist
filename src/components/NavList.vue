<template>
  <div class="nav-list">
    <h2 v-if="title" class="nav-list__title">{{ title }}</h2>
    <ul v-if="items.length > 0" class="nav-list__list">
      <li v-for="(item, index) in items" :key="index">
        <slot name="item" :item="item" :index="index">
          dwdwdw
        </slot>
      </li>
    </ul>
    <div v-else class="nav-list__no-items">{{ noItems }}</div>
  </div>
</template>

<script>
export default {
  name: 'NavList',
  props: {
    title: String,
    noItems: String,
    items: Array
  }
}
</script>

<style lang="scss">
@import '../scss/_variables.scss';

.nav-list {
  &__title {
    color: $foreground;
    font-family: $default-font;
    font-weight: normal;
    font-size: 22px;
    margin: 0;
    margin-bottom: 8px;
  }

  &__list {
    padding: 0;
    margin: 0;
    list-style: none;

    & > li {
      padding: 8px 0;
      border-bottom: 1px solid $nav-border;
    }
  }

  &__details {
    font-size: 16px;
    margin-right: 12px;
    flex-grow: 1;
  }

  &__group {
    margin: 0 0 24px 0;
  }

  &__no-items {
    color: $foreground;
    font-family: $default-font;
    padding: 12px 0;
  }
}
</style>
