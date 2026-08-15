<template>
  <div class="nav-list">
    <h2 v-if="title" class="nav-list__title">{{ title }}</h2>
    <ul v-if="items.length > 0" class="nav-list__list">
      <li v-for="(item, index) in items" :key="index">
        <slot name="item" :item="item" :index="index"></slot>
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

<style>
.nav-list {
  .nav-list__title {
    color: var(--foreground);
    font-family: var(--default-font);
    font-weight: normal;
    font-size: 22px;
    margin: 0;
    margin-bottom: 8px;
  }

  .nav-list__list {
    padding: 0;
    margin: 0;
    list-style: none;

    & > li {
      padding: 8px 0;
      border-bottom: 1px solid var(--nav-border);
    }
  }

  .nav-list__details {
    font-size: 16px;
    margin-right: 12px;
    flex-grow: 1;
  }

  .nav-list__group {
    margin: 0 0 24px 0;
  }

  .nav-list__no-items {
    color: var(--foreground);
    font-family: var(--default-font);
    padding: 12px 0;
  }
}
</style>
