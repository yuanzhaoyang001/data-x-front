<template>
  <div>
    <el-dialog
      v-if="!isMobile"
      title="支付"
      v-model="dialogVisible"
      width="30%"
    >
      <div style="text-align: center">
        <div
          class="text-danger"
          style="font-size: 12px; margin-bottom: 10px"
        >
          * 使用微信扫码支付，支付中不要关闭弹窗，支付完成之后自动提交
        </div>
        <div>{{ payParams.goodsDesc }}</div>
        <h2 class="text-danger">￥{{ payParams.totalPrice }}</h2>
        <vue-qr
          v-if="payParams.codeUrl"
          :text="payParams.codeUrl"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 移动端/-->
    <van-popup
      v-if="isMobile"
      v-model:show="dialogVisible"
      round
      position="bottom"
      :style="{ height: '30%' }"
    >
      <div style="margin: 20px">
        <div
          class="text-danger"
          style="font-size: 12px; margin-bottom: 10px"
        >
          * 点击后跳转至微信支付页面，支付完成后回到页面并自动提交
        </div>
        <h2 class="text-center">
          {{ payParams.goodsDesc }}
        </h2>
      </div>
      <van-submit-bar
        :price="payParams.totalPrice * 100"
        button-text="去支付"
        @submit="jumpMWebPay"
      />
    </van-popup>
  </div>
</template>

<script>
import { isMobile, getQueryString } from "@/views/formgen/utils";
import request from "@/utils/request";
import { isWxEnv } from "../hooks/wx";
import { Dialog, Popup, SubmitBar } from "vant";
import "vant/lib/popup/style";
import "vant/lib/submit-bar/style";
import "vant/lib/dialog/style";
import { getFormData, removeFormData, saveFormData } from "@/views/formgen/utils/db";
import loadWXJs from "@/views/formgen/utils/loadWxSdk";
import vueQr from "vue-qr/src/packages/vue-qr.vue";

export default {
  name: "GoodsPay",
  components: {
    vueQr,
    [Popup.name]: Popup,
    [SubmitBar.name]: SubmitBar
  },
  emits: ["paySuccess"],
  data() {
    return {
      dialogVisible: false,
      randKey: "",
      payParams: {
        codeUrl: "",
        goodsDesc: "",
        totalPrice: "",
        mwebUrl: ""
      },
      isMobile: isMobile(),
      //交易id
      transactionId: "",
      payStatusTimer: null,
      // 临时存储 做个标记
      tempFormModel: {},
      formKey: ""
    };
  },
  created() {
    let source = this.$route.query.source;
    this.randKey = this.$route.query.randKey;
    this.formKey = this.$route.params.key;
    this.tempFormModel = { formModel: getFormData(this.formKey) };
    // 微信内jsapi支付需要先获取openid
    if (source === "pay" && this.isMobile && getFormData(this.formKey)) {
      Dialog.confirm({
        title: "提示",
        confirmButtonText: "完成",
        cancelButtonText: "放弃",
        message: "您的微信支付是否已经完成？"
      })
        .then(() => {
          this.openIntervalQueryPayStatus();
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  unmounted() {
    clearInterval(this.payStatusTimer);
  },
  methods: {
    /**
     * 是否使用jsapi支付
     */
    wxJsApiPay() {
      // 非微信环境
      if (!isWxEnv()) {
        return;
      }
      // 非小程序里面
      if (this.$parent.isMiniAppWebview) {
        return;
      }
      // 判断是否在微信环境内
      let fields = this.$parent.$refs.bizProjectFormRef.formConf?.fields;
      if (fields) {
        let haveGoods = fields.filter(item => item.vModel.indexOf("goods_select") > -1).length > 0;
        if (haveGoods && !getQueryString("code")) {
          // location.href = this.$parent.wxAuthorizationUrl
        }
      }
    },
    openPay(submitFormData, formKey) {
      if (this.transactionId) {
        this.transactionId = "";
        return false;
      }
      // 随机5位数字 生成随机Id
      this.randKey = this.getOrderNoRandKey();
      const formModel = submitFormData.originalData;
      let payComs = [];
      Object.keys(formModel).forEach(key => {
        if (key.indexOf("goods_select") > -1) {
          if (formModel[key] && Object.keys(formModel[key]).length !== 0) {
            // formModel[key] 是个对象 里面是商品的id和数量 {id001: 1, id002: 1} value加起来必须大于0
            // 累加对象的value  {id001: 1, id002: 1}
            let total = Object.keys(formModel[key]).reduce((total, gKey) => {
              return total + formModel[key][gKey];
            }, 0);
            if (total) {
              payComs.push({ key: key, value: formModel[key] });
            }
          }
        }
      });
      // 微信公众号的openId
      let openId = this.$parent.wxUserInfo ? this.$parent.wxUserInfo.openid : "";
      if (payComs.length !== 0) {
        this.tempFormModel = submitFormData.originalData;
        this.tempFormModel.payRandKey = this.randKey;
        request
          .post("/form/ext/createGoodsPay", {
            formKey: formKey,
            randKey: this.randKey,
            isMobile: isMobile(),
            isMiniAppWebview: this.$parent.isMiniAppWebview,
            openId: openId,
            goodsList: payComs,
            extData: submitFormData
          })
          .then(res => {
            this.payParams = res.data;
            if (!this.isMobile) {
              this.openIntervalQueryPayStatus();
            }
          })
          .catch(err => {
            this.dialogVisible = false;
          });
        this.dialogVisible = true;
        return true;
      }
      return false;
    },
    /**
     * 开启定时查询支付状态
     */
    openIntervalQueryPayStatus() {
      this.queryPayStatus();
      let that = this;
      if (this.payStatusTimer) {
        return;
      }
      this.payStatusTimer = setInterval(() => {
        that.queryPayStatus();
      }, 3000);
    },
    queryPayStatus() {
      request
        .get("/form/ext/queryPayStatus", {
          params: {
            randKey: this.randKey
          }
        })
        .then(res => {
          if (res.data) {
            this.transactionId = res.data;
            this.$message({
              message: "支付成功",
              type: "success"
            });
            this.dialogVisible = false;
            removeFormData(this.formKey);
            clearInterval(this.payStatusTimer);
            this.$emit("paySuccess", res.data);
          }
        });
    },
    // 移动端支付
    jumpMWebPay() {
      // 在微信小程序里面 回掉小程序发起支付
      if (this.$parent.isMiniAppWebview) {
        this.handleWxMiniAppPay();
        return;
      }
      // 微信里面使用jsapi支付
      if (isWxEnv()) {
        this.handleJsApiPay();
        return;
      }
      if (!this.payParams.mwebUrl) {
        return;
      }
      // 其他浏览器使用H5支付
      saveFormData(this.tempFormModel, this.formKey);
      // 获取当前域名 去除?后面的参数
      let url = window.location.href.split("?")[0];
      let redirectUrl = `${url}?source=pay&randKey=${this.randKey}`;
      window.location.href = this.payParams.mwebUrl + "&redirect_url=" + encodeURIComponent(redirectUrl);
    },
    handleWxMiniAppPay() {
      // 拉起小程序 把参数携带给他
      loadWXJs(wx => {
        // 获取当前域名的全部参数json对象 然后encoding到url里面
        let payDataStr = encodeURIComponent(JSON.stringify(this.payParams));
        const url = `/pages/form/pay/index?payDataStr=${payDataStr}`;
        wx.miniProgram.navigateTo({
          url: url
        });
      });
    },
    handleJsApiPay() {
      let that = this;
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener("WeixinJSBridgeReady", that.onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", that.onBridgeReady);
          document.attachEvent("onWeixinJSBridgeReady", that.onBridgeReady);
        }
      } else {
        this.onBridgeReady();
      }
    },
    onBridgeReady() {
      let that = this;
      // 调用获取支付签名接口
      let { appId, timeStamp, nonceStr, packageValue, signType, paySign } = this.payParams;
      // eslint-disable-next-line no-undef
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId, // 微信的appid
          timeStamp, //时间戳
          nonceStr, //随机串
          package: packageValue, // 订单号
          signType, //微信签名方式：
          paySign //微信签名
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            that.openIntervalQueryPayStatus();
          }
        }
      );
    },
    /**
     *  获取随机订单号
     */
    getOrderNoRandKey() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      return `${year}${month}${day}${hours}${minutes}${seconds}` + Math.floor(Math.random() * 90000) + 10000;
    }
  }
};
</script>
