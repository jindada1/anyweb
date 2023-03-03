<script setup lang="ts">
import HexCard from "@/components/HexCard.vue";
import { Empty } from "ant-design-vue";
import { codes } from "@/utils/global";
import { getData } from "@/api/data";
import { createDI as createDIAPI, allDI } from "@/api/di";
import { ref, computed, reactive } from "vue";
import { useStore } from "@/store";
import { message } from "ant-design-vue";

const store = useStore();
const rootURL = computed(() => store.state.config.baseRoute);

// const searchNodeURL = ref("");

const walletData = reactive({
  seed: "",
  mpri: "",
  mpub: "",
});
getData().then((res) => {
  if (res.code === codes.SUCCESS) {
    walletData.seed = res.data.seed;
    walletData.mpri = res.data.mpri;
    walletData.mpub = res.data.mpub;
  }
});

const diList = ref<API.DIResponse[]>([]);

allDI().then((res) => {
  diList.value = res.data;
});

const DICreateFormvisible = ref(false);
const DIName = ref("");

function createDI() {
  createDIAPI({
    name: DIName.value,
  })
    .then((res) => {
      message.success("创建成功");
      diList.value.unshift(res.data);
    })
    .finally(() => {
      DICreateFormvisible.value = false;
    });
}
</script>

<template>
  <div class="main-body">
    <!-- <div class="section-card">
      <a-input-search
        v-model:value="searchNodeURL"
        placeholder="请输入节点路由"
        :addon-before="rootURL"
        enter-button
      />
    </div> -->

    <div class="section-card">
      <a-form layout="vertical">
        <a-form-item label="种子">
          <HexCard :content="walletData.seed" />
        </a-form-item>
        <a-form-item label="主私钥">
          <HexCard :content="walletData.mpri" />
        </a-form-item>
        <a-form-item label="主公钥">
          <HexCard :content="walletData.mpub" />
        </a-form-item>
      </a-form>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div class="title">数字身份</div>
        <a-button @click="DICreateFormvisible = true"
          >创建数字身份</a-button
        >
      </div>

      <a-list
        v-if="diList.length > 0"
        item-layout="horizontal"
        :data-source="diList"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <router-link :to="`/di/${item.name}`"> 详情 </router-link>
            </template>
            <a-list-item-meta :description="item.route">
              <template #title>
                <router-link :to="`/di/${item.name}`">{{ item.name }}</router-link>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>

      <a-empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE">
        <template #description>
          <span> 没有数字身份 </span>
        </template>
      </a-empty>
    </div>

    <a-modal
      v-model:visible="DICreateFormvisible"
      title="创建数字身份"
      @ok="createDI"
      ok-text="创建"
      cancel-text="取消"
    >
      <a-form
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        labelAlign="left"
      >
        <a-form-item label="数字身份名">
          <a-input v-model:value="DIName" placeholder="请输入数字身份名称" />
        </a-form-item>
        <a-form-item label="路由"> {{ rootURL }}{{ DIName }} </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>

</style>
