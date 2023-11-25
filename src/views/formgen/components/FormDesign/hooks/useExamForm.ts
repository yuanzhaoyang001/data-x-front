export function useExamForm() {
  // 获取题目总分
  const getTotalScore = (list: any[]): number => {
    let total = 0;
    list.forEach((item: any) => {
      if (item.examConfig && item.examConfig.enableScore) {
        total += item.examConfig.score ? Number(item.examConfig.score) : 0;
      }
    });
    // 如果有小数 保留一位小数-
    if (Number.isInteger(total)) {
      return total;
    } else {
      return new Number(Math.fround(total).toFixed(2)) as number;
    }
  };

  return {
    getTotalScore
  };
}
