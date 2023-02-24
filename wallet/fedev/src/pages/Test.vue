<script setup lang="ts">
import { ref } from 'vue'
import { test } from "@/api/test";
import { debounce } from "@/utils/debounce";

const count = ref('')

const testRequest = debounce(() => {
  test().then((res) => {
    count.value = res.data
  })
}, 500)
</script>

<template>
  <div>{{ count }}</div>
  <a-button type="primary" @click="testRequest">测试请求</a-button>
</template>

<style scoped>
</style>
