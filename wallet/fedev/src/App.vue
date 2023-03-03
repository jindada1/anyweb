<template>
  <router-view></router-view>
</template>

<script setup lang="ts">

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main-body {
  width: 560px;
  margin: auto;
}

.section-card {
  margin-bottom: 18px;
  background-color: white;
  padding: 24px;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px hsla(0, 0%, 7%, 0.1);
  box-shadow: 0 1px 3px hsla(0, 0%, 7%, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
}

.section-header .title {
  flex: 1;
  font-weight: bold;
  line-height: 32px;
}

.ant-list-item-meta-description {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
