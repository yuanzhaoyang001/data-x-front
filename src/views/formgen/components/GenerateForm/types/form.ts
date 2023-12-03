export interface FormConfigType {
  title?: string; // 表单标题
  description?: string; // 表单描述
  // 表单字段
  fields: BasicComponent[];
  logicShowRules: any; // 逻辑规则
  formKey: string; // 项目唯一标识
  formRef: string; // 表单 ref名称
  size: string; // 表单组件大小
  labelPosition: string; // 表单标签位置
  labelWidth: number | null; // 表单标签宽度
  formRules: string; // 表单校验规则
  gutter: number; // 表单间隔
  disabled: boolean; // 表单是否禁用
  span: number; // 表单列数
  formBtns: boolean; // 提交按钮是否显示
  resetBtn: boolean; // 重置按钮是否显示
  submitBtnColor: string; // 提交按钮颜色
  unFocusedComponentBorder: boolean; // 是否去除组件聚焦时的边框
  hiddenFormItemIds: string[]; // 逻辑没成立的被隐藏的题目列表
  pageSeqNoObj?: any; // 分页题目的序号
  perPageFields?: any; // 当存在分页功能 每页的数据
  startSeqNo?: number; // 分页题目的起始序号
  currentPage?: number; // 当前页 分页切换时赋值
  setting?: any; // 表单设置
}

export interface FormThemeType {
  // 表单主题
  headImgUrl: string;
  logoImgUrl: string;
  logoImg: string;
  backgroundColor: string;
  backgroundImg: string;
  logoPosition: string;
  showSubmitBtn: boolean;
  showFormTitle: boolean;
  showFormDescribe: boolean;
  showFootDescription?: boolean;
  showTopUserInfo: boolean;
  footDescription?: string;
  showSupport?: boolean;
  // 开启水印
  watermark: boolean;
  // 水印文字
  watermarkText: string;
  // 是否显示用户名为水印
  watermarkUserName: boolean;
}

// 字段id和index的映射
export interface FieldIdIndexType {
  [fieldId: string]: number;
}

// FormModel
export interface FormModelType {
  [key: string]: any;
}

// 通用key-value 对象
export interface KeyValueType {
  [key: string]: any;
}

// 基础类型对象
export interface BasicComponent {
  typeId: string;
  description: string;
  key?: string;
  config: {
    label: string;
    labelWidth: number | null;
    showLabel: boolean;
    changeTag: boolean;
    tag: string;
    tagIcon: string;
    defaultValue: any;
    required: boolean;
    span: number;
    showRegList: boolean;
    regList: any[];
    formId: string;
    [key: string]: any; // 其他组件字段
  };
  vModel: string;
  placeholder: string;
  style: any;

  [key: string]: any; // 其他组件字段
  // 考试配置
  examConfig?: ExamConfig;
}

export interface ExamConfig {
  // 考试字段  是否显示答案 不会保存到数据库
  showAnswer?: boolean;
  // 评分类型
  scoringType: number;
  // 分值
  score: number;
  // 是否启用分值
  enableScore: boolean;
  // 答案
  answer: string | any;
  // 答案解析
  answerAnalysis: string;
}

// 表单设置查询
export interface FormPublicSetting {
  /**
   * 自定义显示类型 1 系统默认 2 自定义页面 使用 submitShowCustomPageContent 内容
   */
  submitShowType: number;
  /**
   * 自定义显示内容
   */
  submitShowCustomPageContent: string;
  submitJump: boolean;
  submitJumpUrl: string;

  /**
   * 显示分享图片
   */
  shareWxImg: boolean;
  /**
   * 分享图片地址
   */
  shareWxImgUrl: string;
  /**
   * 显示分享标题
   */
  shareWxTitle: boolean;
  /**
   * 分享标题内容
   */
  shareWxTitleContent: string;
  /**
   * 开启分享描述
   */
  shareWxDesc: boolean;
  /**
   * 分享描述内容
   */
  shareWxDescContent: string;

  /**
   * 开启邮件通知
   */
  emailNotify: boolean;
  /**
   * 邮件通知账号
   */
  newWriteNotifyEmail: string;
  wxNotify: boolean;
  newWriteNotifyWx: string;

  /**
   * 公开回复
   */
  openReply: boolean;

  /**
   * 提交跳转逻辑
   */
  commitJumpLogicList: any; // You can replace 'any' with a more specific type if needed

  /**
   * 可查看已提交内容
   */
  showSubmitContentBtn: boolean;

  /**
   * 可以修改已经提交的内容
   */
  updateSubmitContentBtn: boolean;

  /**
   * 是否启用白名单
   */
  enableWhiteList: boolean;

  /**
   * 白名单类型
   */
  whiteListType: number;

  /**
   * 每页一题的配置
   */
  onePageOneQuestion: {
    /**
     * 开启一页一题
     */
    enableOnePageOneQuestion: boolean;

    /**
     * 启用最短停留
     */
    enableShortestStay: boolean;

    /**
     * 最短停留时间 秒
     */
    shortestStayTime: number | null; // Use 'null' if the value can be absent

    /**
     * 启用最长停留
     */
    enableLongestStay: boolean;

    /**
     * 最长停留时间
     */
    longestStayTime: number | null; // Use 'null' if the value can be absent

    /**
     * 选择后自动进入下一题
     */
    autoNext: boolean;
  };
}
