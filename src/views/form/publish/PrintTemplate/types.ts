/**
 * 字段类型
 */
export enum PrintCellType {
  /**
   * 基础字段
   */
  COLUMN = 1,
  /**
   * 图片
   */
  IMAGE = 2,
  /**
   * 条形码
   */
  BARCODE = 3,
  /**
   * 二维码
   */
  QRCODE = 4
}

export const printCellTypeArray: number[] = Object.keys(PrintCellType)
  .filter((key: any) => !isNaN(Number(PrintCellType[key])))
  .map((key: any) => Number(PrintCellType[key]));
