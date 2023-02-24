<script setup lang="ts">
import { ref } from "vue";
import { init } from "@/api/init";
import { codes } from "@/utils/global";
import router from "@/router";

const needCreate = ref(false);
const loading = ref(true);
const danger = ref(false);
const btnText = ref("读取数据中");

// 初始化 App
init()
  .then((res) => {
    // 没有种子就去初始化
    if (res.code === codes.NULL) {
      needCreate.value = true;
    }
    // 如果已经有种子，就跳转至主页
    else {
      router.push({
        name: "home",
      });
    }
  })
  .catch(() => {
    btnText.value = "出错了";
    danger.value = true;
  })
  .finally(() => {
    loading.value = false;
  });

function gotoCreate() {
  router.push({
    name: "create",
  });
}
</script>

<template>
  <div class="wow">
    <div class="title">Anyweb</div>
    <div class="image-holder">
      <img alt="Vue logo" src="@/assets/logo.png" />
    </div>

    <a-button
      v-if="needCreate"
      type="primary"
      shape="round"
      @click="gotoCreate"
    >
      初始化钱包
    </a-button>
    <a-button
      v-else
      type="primary"
      shape="round"
      ghost
      :danger="danger"
      :loading="loading"
    >
      {{ btnText }}
    </a-button>
  </div>
</template>

<style scoped>
.wow {
  text-align: center;
  color: #2c3e50;
}                                                
.title {
  font-weight: bold;
  font-size: medium;
  line-height: 50px;
  padding-top: 50px;
}

.image-holder {
  width: 100%;
  align-items: center;
}

.image-holder img {
  width: 80%;
  max-width: 260px;
}
</style>
