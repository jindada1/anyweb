<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { message, Empty } from "ant-design-vue";
import { PlusOutlined } from '@ant-design/icons-vue';
import Item from "@/components/Item.vue";
import { Dayjs } from "dayjs";
import { authDI, VCList } from "@/api/di";

const route = useRoute();
const DIName =
  typeof route.params.name === "string"
    ? route.params.name
    : route.params.name[0];

const vcList = ref<API.DIVCListResponse>([]);

VCList({
  di: DIName
}).then((res) => {
  vcList.value = res.data
})

interface FormState {
  exp: Dayjs;
}
const declareState = reactive({} as FormState);
const declareJson = ref("");
const declareEncoded = ref("");

function expChanged() {
  const decObj = {
    exp: declareState.exp.unix(),
  };
  declareJson.value = JSON.stringify(decObj, null, 2);
  declareEncoded.value = btoa(unescape(encodeURIComponent(declareJson.value)));
}

function authOnChain() {
  if (declareEncoded.value.length === 0) {
    message.error('请选择过期时间')
    return;
  }
  authDI({
    di: DIName,
    declaration: declareEncoded.value
  }).then((res) => {
    message.success('认证成功')
    vcList.value.unshift(res.data);
  })
}
</script>

<template>
  <div class="main-body">
    <div class="section-card">
      <Item title="当前身份">
        <div class="section-header">
          <div class="title">{{ DIName }}</div>
        </div>
      </Item>
    </div>

    <div class="section-card">
      <a-form
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        labelAlign="left"
      >
        <a-form-item name="date-time-picker" label="有效期至">
          <a-date-picker
            show-time
            placeholder="请设置此次认证的过期时间"
            style="width: 100%"
            v-model:value="declareState.exp"
            format="YYYY-MM-DD HH:mm:ss"
            @change="expChanged"
          />
        </a-form-item>
        <div style="margin-bottom: 24px;">
          <a-button type="dashed" block>
            <PlusOutlined />
            新增自定义字段
          </a-button>
        </div>
        <a-form-item label="声明">
          <a-textarea
            disabled
            v-model:value="declareJson"
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-item>
        <a-form-item label="声明编码">
          <a-textarea
            disabled
            v-model:value="declareEncoded"
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-item>
        <a-button style="width: 100%" type="primary" @click="authOnChain"
          >进行链上身份认证</a-button
        >
      </a-form>
    </div>

    <div class="section-card">
      <div class="section-header">
        <div class="title">已有凭证</div>
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
                <a href="/#">{{ item.declaration }}</a>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>

      <a-empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE">
        <template #description>
          <span> 当前数字身份还未认证过 </span>
        </template>
      </a-empty>
    </div>
  </div>
</template>

<style scoped>

</style>
