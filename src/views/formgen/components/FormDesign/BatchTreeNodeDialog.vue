<template>
  <div>
    <div>
      <p>{{ $t("formgen.batchTreeNode.tips") }}</p>
    </div>
    <br />
    <el-row :gutter="0">
      <el-input
        type="textarea"
        :rows="10"
        v-model="value"
      />
    </el-row>
    <br />
    <div style="font-size: 12px; color: #979797">
      {{ $t("formgen.batchTreeNode.text1") }}
      <div>
        {{ $t("formgen.batchTreeNode.text2") }}
        <br />
        {{ $t("formgen.batchTreeNode.text3") }}
        <br />
        {{ $t("formgen.batchTreeNode.text4") }}
      </div>
    </div>
  </div>
</template>

<script>
import { getTreeNodeId, saveTreeNodeId } from "../../utils/db";
import { generateId } from "@/utils";

/**
 * 普通数组去重 可以去NaN，不能去重复杂数组类型
 * @param arr
 * @returns []
 */
export function simpleUnique(arr) {
  const map = new Map();
  const newArr = [];
  arr.forEach(item => {
    if (!map.has(item)) {
      map.set(item, 1);
      newArr.push(item);
    }
  });
  return newArr;
}

function inheriltClassAndStyle() {
  const attrs = this.$attrs;
  attrs.class && this.$el.classList.add(attrs.class);
  attrs.style &&
    Object.entries(attrs.style).forEach(([k, v]) => {
      this.$el.style[k] = v;
    });
}

const id = getTreeNodeId();

export default {
  name: "BatchTreeNodeDialog",
  components: {},
  inheritAttrs: false,
  props: ["treeData"],
  emits: ["close"],
  data() {
    return {
      id,
      value: ""
    };
  },
  watch: {
    id(val) {
      saveTreeNodeId(val);
    }
  },
  mounted() {
    inheriltClassAndStyle.call(this);
  },
  created() {
    this.getDefaultValue();
  },
  methods: {
    getKeys(arr, value) {
      const length = value.length;
      const a = arr.findIndex(e => e.label === value[0]);
      const b = a > -1 && arr[a].children ? arr[a].children.findIndex(e => e.label === value[1]) : -1;
      const c = b > -1 && arr[a].children[b].children ? arr[a].children[b].children.findIndex(e => e.label === value[2]) : -1;

      if (length === 2) {
        return [a];
      }
      if (length === 3) {
        return [a, b];
      }
      if (length === 4) {
        return [a, b, c];
      }
      return [];
    },
    handelConfirm() {
      const options = [];
      const arr = simpleUnique(this.value.split(/[(\r\n)]+/));

      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const optionsArr = item.split("/");

        const isNull = optionsArr.filter(e => {
          return e === "" || e === null;
        });

        if (isNull.length) {
          continue;
        }

        const obj = {
          id: this.id++,
          value: generateId(),
          label: optionsArr[optionsArr.length - 1],
          level: 0
        };

        const keys = this.getKeys(options, optionsArr);

        const isE = keys.filter(e => {
          return e === -1;
        });

        if (isE.length) {
          continue;
        }

        switch (optionsArr.length) {
          case 1:
            options.push(obj);
            break;
          case 2:
            if (!Object.prototype.hasOwnProperty.call(options[keys[0]], "children")) {
              options[keys[0]].children = [];
            }
            options[keys[0]].children.push(obj);
            break;
          case 3:
            if (!Object.prototype.hasOwnProperty.call(options[keys[0]].children[keys[1]], "children")) {
              options[keys[0]].children[keys[1]].children = [];
            }
            options[keys[0]].children[keys[1]].children.push(obj);
            break;
          case 4:
            if (!Object.prototype.hasOwnProperty.call(options[keys[0]].children[keys[1]].children[keys[2]], "children")) {
              options[keys[0]].children[keys[1]].children[keys[2]].children = [];
            }
            options[keys[0]].children[keys[1]].children[keys[2]].children.push(obj);
            break;
          default:
        }
      }

      this.$emit("close", options);
    },
    getDefaultValue() {
      const arr = [];

      const handelData = item => {
        arr.push(item);

        if (item.children) {
          item.children.forEach(cItem => {
            handelData(cItem);
          });
        }
      };

      this.treeData.forEach(item => {
        handelData(item);
      });

      const getItem = (level, id) => {
        return arr.find(e => {
          return e.level === level && e.id === id;
        });
      };

      const labelArr = [];

      arr.forEach(item => {
        const { level, parentId, label } = item;

        const b = parentId > 0 ? getItem(level - 1, parentId) : "";
        const c = b ? getItem(b.level - 1, b.parentId) : "";
        const d = c ? getItem(c.level - 1, c.parentId) : "";

        switch (item.level) {
          case 2:
            labelArr.push(`${b.label}/${label}`);
            break;
          case 3:
            labelArr.push(`${c.label}/${b.label}/${label}`);
            break;
          case 4:
            labelArr.push(`${d.label}/${c.label}/${b.label}/${label}`);
            break;
          default:
            labelArr.push(label);
        }
      });

      this.value = labelArr.join("\r\n");
    }
  }
};
</script>
