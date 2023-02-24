<script setup lang="ts">
import { defineProps } from "vue";

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
