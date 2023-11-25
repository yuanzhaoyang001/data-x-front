<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="$t('formgen.treeNodeDialog.add')"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @open="onOpen"
      @close="onClose"
    >
      <el-row :gutter="0">
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          label-width="130px"
        >
          <el-col :span="24">
            <el-form-item
              :label="$t('formgen.treeNodeDialog.optionName')"
              prop="label"
            >
              <el-input
                v-model="formData.label"
                style="width: 500px"
                :placeholder="$t('formgen.treeNodeDialog.placeholder')"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!--            <el-form-item-->
            <!--              label="选项值"-->
            <!--              prop="value"-->
            <!--            >-->
            <!--              <el-input-->
            <!--                v-model="formData.value"-->
            <!--                placeholder="请输入选项值"-->
            <!--                clearable-->
            <!--              >-->
            <!--                <el-select-->
            <!--                  slot="append"-->
            <!--                  v-model="dataType"-->
            <!--                  :style="{width: '100px'}"-->
            <!--                >-->
            <!--                  <el-option-->
            <!--                    v-for="(item, index) in dataTypeOptions"-->
            <!--                    :key="index"-->
            <!--                    :label="item.label"-->
            <!--                    :value="item.value"-->
            <!--                    :disabled="item.disabled"-->
            <!--                  />-->
            <!--                </el-select>-->
            <!--              </el-input>-->
            <!--            </el-form-item>-->
          </el-col>
        </el-form>
      </el-row>
      <template #footer>
        <div>
          <el-button
            type="primary"
            size="default"
            @click="handelConfirm"
          >
            {{ $t("formI18n.all.confirm") }}
          </el-button>
          <el-button
            size="default"
            @click="close"
          >
            {{ $t("formI18n.all.cancel") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { isNumberStr } from "../../utils";
import { generateId } from "@/utils";

export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:visible", "commit"],
  data() {
    return {
      dialogVisible: this.visible,
      formData: {
        label: undefined,
        value: undefined
      },
      rules: {
        label: [
          {
            required: true,
            message: "",
            trigger: "blur"
          }
        ],
        value: [
          {
            required: true,
            message: "",
            trigger: "blur"
          }
        ]
      },
      dataType: "string",
      dataTypeOptions: [
        {
          label: "字符串",
          value: "string"
        },
        {
          label: "数字",
          value: "number"
        }
      ]
    };
  },
  computed: {},
  watch: {
    "formData.value": function (val) {
      this.dataType = isNumberStr(val) ? "number" : "string";
    },
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    }
  },
  created() {},
  mounted() {},
  methods: {
    onOpen() {
      this.formData = {
        label: undefined,
        value: undefined
      };
    },
    onClose() {},
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return;
        this.formData.id = generateId();
        // + 避免过快重复
        this.formData.value = generateId();
        this.$emit("commit", this.formData);
        this.close();
      });
    }
  }
};
</script>
