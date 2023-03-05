<script setup lang="ts">
import HexCard from "@/components/HexCard.vue";
import { Empty } from "ant-design-vue";
import { detailDA, authDA, VC as getDAVC } from "@/api/da";
import { ref } from "vue";
import { message } from "ant-design-vue";
import { useRoute } from "vue-router";
import Item from "@/components/Item.vue";

const DA = ref<API.DAResponse>();

const route = useRoute();
const daid =
  typeof route.params.daid === "string"
    ? route.params.daid
    : route.params.daid[0];

detailDA({
  daid,
}).then((res) => {
  DA.value = res.data;
});

const vcList = ref<API.DAVC[]>();

function authDAHandler() {
  authDA({
    daid,
  }).then((res) => {
    vcList.value = res.data ? [res.data] : [];
    message.success("认证成功");
  });
}

getDAVC({
  daid,
}).then((res) => {
  vcList.value = res.data ? [res.data] : [];
});
</script>

<template>
  <div class="main-body">
    <div class="section-card">
      <Item title="当前账户">
        <div class="section-header">
          <div class="title">{{ DA?.name }}</div>
        </div>
      </Item>
      <Item title="所属身份">{{ DA?.di }}</Item>
      <Item title="路由">{{ DA?.route }}</Item>
      <Item title="派生路径">{{ DA?.path }}</Item>
    </div>

    <div class="section-card">
      <a-form layout="vertical">
        <a-form-item label="哈希">
          <HexCard :content="DA?.DAID" />
        </a-form-item>
        <a-form-item label="私钥">
          <HexCard :content="DA?.pri" />
        </a-form-item>
        <a-form-item label="公钥">
          <HexCard :content="DA?.pub" />
        </a-form-item>
        <a-form-item label="TokenURI">
          <HexCard :content="DA?.tokenUri" />
        </a-form-item>
        <a-form-item label="PUID">
          <HexCard :content="DA?.PUID" />
        </a-form-item>
      </a-form>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div class="title">当前账户凭证</div>
        <a-button type="primary" @click="authDAHandler"> 生成凭证 </a-button>
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
                {{ item.Rpuid }}
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>

      <a-empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE">
        <template #description>
          <span> 暂无凭证 </span>
        </template>
      </a-empty>
    </div>
  </div>
</template>

<style scoped>

</style>
