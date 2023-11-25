export function getCodeDesc(val) {
  if (!val) {
    return "";
  }
  const { code, usedStatus } = val;
  return `核销码${code},${usedStatus == 1 ? "已使用" : "未使用"}`;
}
