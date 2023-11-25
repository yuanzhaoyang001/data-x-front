import { PosterWidget, PosterWidgetType } from "../../types/poster";

export interface QrcodeWidget extends PosterWidget {
  /**
   * 二维码内容
   */
  url: string;
  /**
   * 背景颜色
   */
  bgColor: string;

  /**
   * 二维码大小
   */
  size: number;
  /**
   * 二维码边距
   */
  margin: number;
  /**
   * 二维码等级
   */
  level: number;
}

export const qrcodeWidgetConfig: QrcodeWidget = {
  bgColor: "#ffffff",
  level: 3,
  margin: 1,
  size: 100,
  url: "https://www.baidu.com",
  center: false,
  height: 100,
  width: 100,
  x: 10,
  y: 10,
  type: PosterWidgetType.QRCODE,
  id: "",
  name: "二维码",
  alpha: 1,
  active: true
};
