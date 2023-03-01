<script setup lang="ts">
defineProps({
  content: String,
});
</script>

<template>
  <div class="hex-holder">
    {{ content }}
  </div>
</template>

<style scoped>
.hex-holder {
  word-break: break-all;
}
</style>
