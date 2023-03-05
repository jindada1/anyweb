<script setup lang="ts">
import HexCard from "@/components/HexCard.vue";
import { Empty } from "ant-design-vue";
import { detailDI, VC } from "@/api/di";
import { createDA as createDAAPI, allDA } from "@/api/da";
import { ref, computed } from "vue";
import { message } from "ant-design-vue";
import { useRoute } from "vue-router";
import Item from "@/components/Item.vue";

const DI = ref<API.DIResponse>();

const route = useRoute();
const DIName =
  typeof route.params.name === "string"
    ? route.params.name
    : route.params.name[0];
detailDI({
  name: DIName,
}).then((res) => {
  DI.value = res.data;
});

const daList = ref<API.DAResponse[]>([]);
allDA({
  di: DIName,
}).then((res) => {
  daList.value = res.data;
});

const DACreateFormvisible = ref(false);
const rootURL = computed(() => DI.value?.route);
const DAName = ref("");
const PUID = ref("");
const PPK = ref("");

function createDA() {
  createDAAPI({
    di: DIName,
    name: DAName.value,
    puid: PUID.value,
    ppk: PPK.value,
  })
    .then((res) => {
      message.success("创建成功");
      daList.value.unshift(res.data);
    })
    .finally(() => {
      DACreateFormvisible.value = false;
    });
}

const vcList = ref<API.DIVCListResponse>([]);
VC({
  di: DIName
}).then((res) => {
  vcList.value= res.data ? [res.data] : [];
})

</script>

<template>
  <div class="main-body">
    <div class="section-card">
      <Item title="当前身份">
        <div class="section-header">
          <div class="title">{{ DI?.name }}</div>
        </div>
      </Item>
      <Item title="路由">{{ DI?.route }}</Item>
      <Item title="派生路径">{{ DI?.path }}</Item>
    </div>
<!-- 
    <div class="section-card">
      <a-form layout="vertical">
        <a-form-item label="私钥">
          <HexCard :content="DI?.pri" />
        </a-form-item>
        <a-form-item label="公钥">
          <HexCard :content="DI?.pub" />
        </a-form-item>
      </a-form>
    </div> -->

    <div class="section-card">
      <div class="section-header">
        <div class="title">当前身份凭证</div>
          <router-link :to="`/auth/${DI?.name}`">  
            <a-button type="primary"> 链上身份认证 </a-button>
          </router-link>
      </div>

      <a-list
        v-if="vcList && vcList.length > 0"
        item-layout="horizontal"
        :data-source="vcList"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <a-tag color="green"> 未过期 </a-tag>
            </template>
            <a-list-item-meta :description="item.key">
              <template #title>
                {{ item.declaration }}
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>

      <a-empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE">
        <template #description>
          <span> 没有身份凭证 </span>
        </template>
      </a-empty>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div class="title">数字账户</div>
        <a-button @click="DACreateFormvisible = true">
          创建数字账户
        </a-button>
      </div>

      <a-list
        v-if="daList && daList.length > 0"
        item-layout="horizontal"
        :data-source="daList"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <a key="list-loadmore-more"> 详情 </a>
            </template>
            <a-list-item-meta :description="item.route">
              <template #title>
                <router-link :to="`/da/${item.DAID}`">{{ item.name }}</router-link>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>

      <a-empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE">
        <template #description>
          <span> 没有数字账户 </span>
        </template>
      </a-empty>
    </div>

    <a-modal
      v-model:visible="DACreateFormvisible"
      title="创建数字账户"
      @ok="createDA"
      ok-text="创建"
      cancel-text="取消"
    >
      <a-form
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        labelAlign="left"
      >
        <a-form-item label="数字账户名">
          <a-input v-model:value="DAName" placeholder="请输入数字账户名称" />
        </a-form-item>
        <a-form-item label="路由"> {{ rootURL }}/{{ DAName }} </a-form-item>
        <a-form-item label="登录授权码">
          <a-input v-model:value="PUID" placeholder="请输入账户的登录授权码" />
        </a-form-item>
        <a-form-item label="服务商公钥">
          <a-textarea
            v-model:value="PPK"
            placeholder="请输入服务商的公钥"
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>

</style>
