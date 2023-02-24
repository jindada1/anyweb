<script setup lang="ts">
import HexCard from "@/components/HexCard.vue";
import { codes } from "@/utils/global";
import { getData } from "@/api/data";
import { ref } from "vue";

const seed = ref("");
const mpri = ref("");
const mpub = ref("");
getData().then((res) => {
  if (res.code === codes.SUCCESS) {
    seed.value = res.data.seed;
    mpri.value = res.data.mpri;
    mpub.value = res.data.mpub;
  }
});
</script>

<template>
  <div class="main-body">
    <div class="router-bar">

    </div>
    <a-form layout="vertical">
      <a-form-item label="种子">
        <HexCard :content="seed" />
      </a-form-item>
      <a-form-item label="主私钥">
        <HexCard :content="mpri" />
      </a-form-item>
      <a-form-item label="主公钥">
        <HexCard :content="mpub" />
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.main-body {
  width: 520px;
  margin: auto;
}

.router-bar {
    padding: 22px 0;
}
</style>
