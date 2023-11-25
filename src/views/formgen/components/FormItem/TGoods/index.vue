<template>
  <div ref="tGoods">
    <div class="goods-list">
      <div
        v-for="goods in goodsList"
        :key="goods.id"
        class="goods"
      >
        <el-card
          style="border-radius: 10px; padding: 10px"
          :body-style="{ padding: ' 5px' }"
        >
          <el-carousel
            v-if="showGoodsPhoto"
            height="150px"
            direction="vertical"
          >
            <el-carousel-item
              v-for="goodsImg in goods.imgList"
              :key="goodsImg.url"
            >
              <el-image
                class="goods-img"
                :src="goodsImg.url"
              >
                <template #error>
                  <div class="goods-image-slot">
                    <el-icon>
                      <ele-Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </el-carousel-item>
          </el-carousel>
          <div class="pl5">
            {{ goods.goodsName }}
          </div>
          <div class="goods-desc">
            {{ goods.description }}
          </div>
          <div
            :style="{ visibility: showInventory ? 'hidden' : '' }"
            class="goods-desc mt100"
          >
            {{ $t("formgen.goodsConfig.inventory") }}:
            <span class="inventory">{{ goods.remainInventory !== undefined ? goods.remainInventory : goods.inventory }}</span>
          </div>
          <el-row
            type="flex"
            justify="center"
            align="middle"
          >
            <el-col :span="9">
              <div class="price">
                <span class="currency">￥</span>
                <span class="value">
                  {{ getPrice(goods) }}
                </span>
              </div>
            </el-col>
            <el-col :span="15">
              <el-input-number
                v-model="goods.count"
                :max="goods.remainInventory ? goods.remainInventory : 100"
                :min="0"
                class="goods-count"
                size="small"
                @input="handleChangeGoodsNum(goods)"
              />
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="TGoods">
import { onMounted, useAttrs } from "vue";
import { formEmits, formItemProps, useFormItem } from "@/views/formgen/components/FormItem/hooks/useFormItemHook";
import { getRequest } from "@/api/baseRequest";
import { useRoute } from "vue-router";

const props = defineProps({
  ...formItemProps,
  goodsList: {
    type: Array,
    default: () => {
      return [];
    }
  },
  showInventory: {
    type: Boolean,
    default: true
  },
  showGoodsPhoto: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(formEmits);

const formItemHook = useFormItem(props, emits);

const { changeValue } = formItemHook;

const route = useRoute();
const attrs = useAttrs();

const queryGoodsSellQuantity = () => {
  getRequest("/form/ext/queryGoodsSellQuantity", {
    formKey: route.params.key,
    formItemId: attrs.vModel
  }).then(res => {
    let data = res.data;
    props.goodsList.forEach((goods: any, index) => {
      let remainInventory = goods?.inventory;
      if (data[goods?.id]) {
        remainInventory = goods.inventory - data[goods.id];
      }
      goods.remainInventory = remainInventory;
      props.goodsList[index] = goods;
    });
  });
};

const getPrice = (goods: any) => {
  return (goods.count * goods.price).toFixed(2);
};

const handleChangeGoodsNum = (goods: any) => {
  goods["finalPrice"] = goods.count * goods.price;
  changeValue.value[goods.id] = goods.count;
};

onMounted(() => {
  // 非表达设计情况下
  if ("design" !== attrs.mode) {
    queryGoodsSellQuantity();
  }
});
</script>

<style>
.goods-list {
  display: flex;
  flex-wrap: wrap;
}

.edit-form-item .goods {
  width: 35%;
}

.goods {
  width: 35%;
  margin: 5px;
}

.goods-img {
  width: 100%;
  height: 100%;
}

.goods .el-card__body {
  padding: 0;
}

.goods-image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.goods-desc {
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  color: #999;
  display: -webkit-box;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  margin: 0;
  overflow: hidden;
  position: relative;
  white-space: pre-wrap;
}

.inventory {
  color: #000000;
}

.price {
  color: #e34152;
}

@media screen and (max-width: 500px) {
  .goods {
    width: 100% !important;
  }

  .goods-count {
    margin-right: 20px !important;
  }
}
</style>
