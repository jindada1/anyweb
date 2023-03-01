<script setup lang="ts">
import { genSeed, confirmSeed } from "@/api/seed";
import { ref, reactive } from "vue";
import type { UnwrapRef } from "vue";
import { debounce } from "@/utils/debounce";
import HexCard from "@/components/HexCard.vue";
import { codes } from "@/utils/global";
import router from "@/router";

interface FormState {
  sentence: string;
}

const sForm: UnwrapRef<FormState> = reactive({
  sentence: "",
});

const activeKey = ref("1");
const seedFromSentence = ref("");

/**
 * 用户输入的同时，实时请求后端生成种子
 */
const userInput = debounce(() => {
  let sentence = sForm.sentence;
  sentence = sentence.replace(/\ +/g, ""); // 去掉空格
  sentence = sentence.replace(/[\r\n]/g, ""); // 去掉换行
  if (sentence.length > 0) {
    genSeed({
      sentence,
    }).then((res) => {
      // console.log(res);
      seedFromSentence.value = res.data;
    });
  }
}, 1000);

const seedRandomGenerated = ref("");

const randomGen = debounce(() => {
  genSeed({
    sentence: Math.random().toString(),
  }).then((res) => {
    // console.log(res);
    seedRandomGenerated.value = res.data;
  });
}, 1000);

randomGen();

function useSeed(t: number) {
  const seed = t === 0 ? seedFromSentence.value : seedRandomGenerated.value;
  confirmSeed({ seed }).then((res) => {
    if (res.code === codes.SUCCESS) {
      // console.log(res);
      router.push({
        name: "init",
      });
    } else {
      console.log("出错了");
    }
  });
}
</script>

<template>
  <div class="card-holder">
    <a-card style="width: 100%">
      <a-tabs v-model:activeKey="activeKey" centered>
        <a-tab-pane key="1" tab="根据助记语创建">
          <a-form layout="vertical" :model="sForm">
            <a-form-item label="助记语（诗句，名言）">
              <a-textarea
                v-model:value="sForm.sentence"
                placeholder="请输入助记语"
                :auto-size="{ minRows: 2, maxRows: 5 }"
                @change="userInput"
              />
            </a-form-item>
            <a-form-item label="↓">
              <HexCard :content="seedFromSentence" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="useSeed(0)" :disabled="seedFromSentence.length === 0">
                将上述哈希作为种子
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="随机生成">
          <a-form-item label="随机生成的种子为">
            <HexCard :content="seedRandomGenerated" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="randomGen">刷新</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="useSeed(1)" :disabled="seedRandomGenerated.length === 0">
              将上述哈希作为种子
            </a-button>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<style scoped>
.card-holder {
  width: 420px;
  margin: auto;
  padding-top: 150px;
}
</style>
