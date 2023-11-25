export const formulaList = [
  {
    name: "常用函数",
    children: [
      {
        name: "CONCATENATE",
        intro:
          'CONCATENATE函数可以将多个文本合并成一个文本用法：CONCATENATE(文本1,文本2,...)</br>示例：CONCATENATE("三年二班","刘德华")会返回"三年二班刘德华"'
      },
      {
        name: "DATE",
        intro: "DATE函数可以将时间戳转换为日期对象用法：DATE(时间戳)示例：略"
      },
      {
        name: "DATEDIF",
        intro:
          'DATEDIF函数可以计算两个日期时间相差的年数、月数、天数、小时数、分钟数、秒数。用法：DATEDIF(开始时间,结束时间,[单位])，单位可以是 "y" 、"M"、"d"、"h"、"m"、"s"示例：DATEDIF(下单时间,付款时间,"h")，如果下单时间是9:00，付款时间为当天10:30，计算得到的小时差为1.5。'
      },
      {
        name: "IF",
        intro:
          'IF函数判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值</br>用法：IF(逻辑表达式,为true时返回的值,为false时返回的值)</br>示例：IF(语文成绩>60,"及格","不及格")，当语文成绩>60时返回及格，否则返回不及格。'
      },
      {
        name: "SUM",
        intro:
          "SUM函数可以获取一组数值的总和</br>用法：SUM(数字1,数字2,...)</br>示例：SUM(语文成绩,数学成绩, 英语成绩)返回三门课程的总分"
      }
    ]
  },
  {
    name: "数学函数",
    children: [
      {
        name: "ABS",
        intro: "ABS函数可以获取一个数的绝对值</br>用法：ABS(数字</br>示例：ABS(-8)可以返回8，也就是-8的绝对值"
      },
      {
        name: "AVERAGE",
        intro:
          "AVERAGE函数可以获取一组数值的算术平均值</br>用法：AVERAGE(数字1,数字2,...)</br>示例：AVERAGE(语文成绩,数学成绩, 英语成绩)返回三门课程的平均分"
      },
      {
        name: "CEILING",
        intro:
          "CEILING函数可以将数字增大到最接近原值的指定因数的倍数</br>用法：CEILING(数字,因数)</br>示例：CEILING(7,6)返回12，因为12比7大的同时，也是6的倍数中最接近7的数字"
      },
      {
        name: "COUNT",
        intro:
          "COUNT函数可以获取参数的数量</br>用法：COUNT(值,值,...)</br>示例：COUNT(小明,小王,小张,小李)返回4，也就是人员的数量"
      },
      {
        name: "COUNTIF",
        intro:
          'COUNTIF函数可以获取数组中满足条件的参数个数</br>用法：COUNTIF(数组,"条件")</br>示例：COUNTIF(子表单.性别, "女")，可得到子表单中性别填的是"女"的数据条数；COUNTIF([1,2,3,4],">2")，可得到1,2,3,4中大于2的数字数量，结果为2。'
      },
      {
        name: "FLOOR",
        intro:
          "FLOOR函数可将数字减小到最接近原值的指定因数的倍数</br>用法：FLOOR(数字,因数)</br>示例：FLOOR(7,6)返回6，因为6比7小的同时，也是6的倍数中最接近7的数字"
      },
      {
        name: "INT",
        intro: "INT函数可以获取一个数的整数部分</br>用法：INT(数字)</br>示例：INT(3.1415)返回3，也就是3.1415的整数部分"
      },
      {
        name: "LARGE",
        intro:
          'LARGE函数可以获取数据集中第k个最大值</br>用法：LARGE(数组,k)</br>示例：LARGE(学生成绩.数学成绩,1)返回子表单"学生成绩"中排名第1的"数学成绩"'
      },
      {
        name: "LOG",
        intro:
          "LOG函数可以根据指定底数返回数字的对数</br>用法：LOG(数字,底数)</br>示例：LOG(100,10)返回2，也就是以10为底数100的对数"
      },
      {
        name: "MAX",
        intro:
          "MAX函数可以获取一组数值的最大值</br>用法：MAX(数字1,数字2,...)</br>示例：MAX(语文成绩,数学成绩,英语成绩)返回三门课程中的最高分"
      },
      {
        name: "MIN",
        intro:
          "MIN函数可以获取一组数值的最小值</br>用法：MIN(数字1,数字2,...)</br>示例：MIN(语文成绩,数学成绩,英语成绩)返回三门课程中的最低分"
      },
      {
        name: "MOD",
        intro: "MOD函数可以获取两数相除的余数</br>用法：MOD(被除数,除数)</br>示例：MOD(4,3)返回1，也就是4/3的余数"
      },
      {
        name: "POWER",
        intro: "POWER函数可以获取数字乘幂的结果</br>用法：POWER(数字,指数)</br>示例：POWER(3，2)返回9，也就是3的2次方"
      },
      {
        name: "PRODUCT",
        intro:
          "PRODUCT函数可以获取一组数值的乘积</br>用法：PRODUCT(数字1,数字2,...)</br>示例：PRODUCT(单价, 数量)获取总价，也就是单价和数量的乘积"
      },
      {
        name: "RAND",
        intro: "RAND函数可返回大于等于0且小于1的均匀分布随机实数</br>用法：RAND()</br>示例：RAND()返回0.424656"
      },
      {
        name: "ROUND",
        intro: "ROUND函数可以将数字四舍五入到指定的位数</br>用法：ROUND(数字,数字位数)</br>示例：ROUND(3.1485,2)返回3.15"
      },
      {
        name: "SMALL",
        intro:
          'SMALL函数可以返回数据集中第k个最小值</br>用法：SMALL(数组,k)</br>示例：SMALL(学生成绩.数学成绩, 1)返回子表单"学生成绩"中排名倒数第一的"数学成绩"'
      },
      {
        name: "SQRT",
        intro: "SQRT函数可以获取一个数字的正平方根</br>用法：SQRT(数字)</br>示例：SQRT(9)返回3，也就是9的正平方根"
      },
      {
        name: "SUM",
        intro:
          "SUM函数可以获取一组数值的总和</br>用法：SUM(数字1,数字2,...)</br>示例：SUM(语文成绩,数学成绩, 英语成绩)返回三门课程的总分"
      },
      {
        name: "SUMPRODUCT",
        intro:
          "SUMPRODUCT函数可以将数组间对应的元素相乘，并返回乘积之和，适用于加权求和</br>用法：SUMPRODUCT(数组,数组...)</br>示例：SUMPRODUCT([1,2,3],[0.1,0.2,0.3])返回1.4，也就是 1×0.1 + 2×0.2 + 3×0.3的值"
      }
    ]
  },
  {
    name: "文本函数",
    children: [
      {
        name: "CONCATENATE",
        intro:
          'CONCATENATE函数可以将多个文本合并成一个文本</br>用法：CONCATENATE(文本1,文本2,...)</br>示例：CONCATENATE("三年二班","刘德华")会返回"三年二班刘德华"'
      },
      {
        name: "CHAR",
        intro: "CHAR函数可以将计算机字符集的数字代码转换为对应字符</br>用法：CHAR(数字)</br>示例：CHAR(10)会返回换行字符\n"
      },
      {
        name: "EXACT",
        intro:
          "EXACT函数可以比较两个文本是否完全相同，完全相同则返回true，否则返回false</br>用法：EXACT(文本1, 文本2)</br>示例：EXACT(手机号,中奖手机号)，如果两者相同，返回true，如果不相同，返回false"
      },
      {
        name: "LEFT",
        intro:
          'LEFT函数可以从一个文本的第一个字符开始返回指定个数的字符</br>用法：LEFT(文本,文本长度)</br>示例：LEFT("三年二班刘德华",2)返回"三年"，也就是"三年二班刘德华"的从左往右的前2个字符'
      },
      {
        name: "LEN",
        intro: 'LEN函数可以获取文本中的字符个数</br>用法：LEN(文本)</br>示例：LEN("朝辞白帝彩云间")返回7，因为这句诗中有7个字符'
      },
      {
        name: "LOWER",
        intro: 'LOWER函数可以将一个文本中的所有大写字母转换为小写字母</br>用法：LOWER(文本)</br>示例：LOWER("JAYZ")返回"jayz"'
      },
      {
        name: "MID",
        intro:
          'MID返回文本中从指定位置开始的指定数目的字符</br>用法：MID(文本,开始位置_数字,指定数目)</br>示例：MID("填鸭表单应用定制工具",4,6)返回"应用定制工具"'
      },
      {
        name: "REPLACE",
        intro:
          'REPLACE函数可以根据指定的字符数，将部分文本替换为不同的文本</br>用法：REPLACE(文本,开始位置,替换长度,新文本)</br>示例：REPLACE("tduck应用定制工具",4,6,"企业数据管理平台")返回"企业数据管理平台"'
      },
      {
        name: "REPT",
        intro:
          'EPT函数可以将文本重复一定次数</br>用法：REPT(文本,重复次数)</br>示例：REPT("填鸭表单",3)返回"填鸭表单填鸭表单填鸭表单"'
      },
      {
        name: "RIGHT",
        intro:
          'RIGHT函数可以获取由给定文本右端指定数量的字符构成的文本值</br>用法：RIGHT(文本,文本长度)</br>示例：RIGHT("三年二班刘德华",3)返回"刘德华"，也就是"三年二班刘德华"从右往左的前3个字符'
      },
      {
        name: "SEARCH",
        intro:
          'SEARCH函数可以获取文本1在文本2中的开始位置</br>用法：SEARCH(文本1,文本2)</br>示例：SEARCH("2016","填鸭表单2016")返回4'
      },
      {
        name: "TRIM",
        intro: 'TRIM函数可以删除文本首尾的空格</br>用法：TRIM(文本)</br>示例：TRIM(" 填鸭表单 ")返回"填鸭表单"'
      },
      {
        name: "UNION",
        intro:
          'UNION函数合并多个文本数组，重复文本只显示一次</br>用法：UNION(文本1，文本2，文本3，文本4)或UNION([数组])</br>示例：UNION("张三","李四","王五","张三","李四")返回值为["张三","李四","王五"]'
      },
      {
        name: "UPPER",
        intro: 'UPPER函数可以将一个文本中的所有小写字母转换为大写字母</br>用法：UPPER(文本)</br>示例：UPPER("jayz")返回"JAYZ"'
      },
      {
        name: "VALUE",
        intro: 'VALUE函数可以将文本转化为数字</br>用法：VALUE(文本)</br>示例：VALUE("3.1415")返回3.1415'
      }
    ]
  },
  {
    name: "日期函数",
    children: [
      {
        name: "DATE",
        intro: "DATE函数可以将时间戳转换为日期对象</br>用法：DATE(时间戳)</br>示例：略"
      },
      {
        name: "DATEDIF",
        intro:
          'DATEDIF函数可以计算两个日期时间相差的年数、月数、天数、小时数、分钟数、秒数。</br>用法：DATEDIF(开始时间,结束时间,[单位])，单位可以是 "y" 、"M"、"d"、"h"、"m"、"s"</br>示例：DATEDIF(下单时间,付款时间,"h")，如果下单时间是9:00，付款时间为当天10:30，计算得到的小时差为1.5。'
      },
      {
        name: "DAY",
        intro: "DAY函数可以获取某日期是当月的第几日</br>用法：DAY(时间戳)</br>示例：略"
      },
      {
        name: "DAYS",
        intro: "DAYS函数可以返回两个日期之间相差的天数。</br>用法：DAYS(结束日期,开始日期)</br>示例：略"
      },
      {
        name: "DAYS360",
        intro: "DAYS360按照一年 360 天的算法，返回两个日期间相差的天数</br>用法：DAYS360(结束日期,开始日期)</br>示例：略"
      },
      {
        name: "HOUR",
        intro: "HOUR函数可以返回某日期的小时数</br>用法：HOUR(时间戳)</br>示例：略"
      },
      {
        name: "ISOWEEKNUM",
        intro: "ISOWEEKNUM函数可以返回指定日期在全年中的ISO周数</br>用法：ISOWEEKNUM(指定日期)</br>示例：略"
      },
      {
        name: "MINUTE",
        intro: "MINUTE函数可以返回某日期的分钟数</br>用法：MINUTE(时间戳)</br>示例：略"
      },
      {
        name: "MONTH",
        intro: "MONTH返回某日期的月份</br>用法：MONTH(时间戳)</br>示例：略"
      },
      {
        name: "NETWORKDAYS",
        intro:
          "NETWORKDAYS可以获取两个日期之间的工作日数，工作日不包括周末和任何其他指定日期。</br>用法：NETWORKDAYS(开始日期,结束日期,[节假日1,节假日2, ...])</br>示例：略"
      },
      {
        name: "NOW",
        intro: "NOW函数可以获取当前时间</br>用法：NOW()</br>示例：略"
      },
      {
        name: "SECOND",
        intro: "SECOND函数可以返回某日期的秒数</br>用法：SECOND(时间戳)</br>示例：略"
      },
      {
        name: "TIME",
        intro: "TIME函数可以返回特定时间的十进制数字</br>用法：TIME(时_数字,分_数字,秒_数字)</br>示例：略"
      },
      {
        name: "TODAY",
        intro: "TODAY函数可以返回今天</br>用法：TODAY()</br>示例：略"
      },
      {
        name: "WEEKNUM",
        intro: "WEEKNUM函数可以返回指定日期在当年是第几周</br>用法：WEEKNUM(指定日期)</br>示例：略"
      },
      {
        name: "WORKDAY",
        intro:
          "WORKDAY函数可以获取给定日期之前或者之后指定工作日数的日期，工作日不包括周末和任何其他指定日期。</br>用法：WORKDAY(日期,工作日数,[节假日1, 节假日2, ...])</br>示例：略"
      },
      {
        name: "YEAR",
        intro: "YEAR函数可以返回某日期的年份</br>用法：YEAR(时间戳)</br>示例：略\n"
      }
    ]
  },
  {
    name: "逻辑函数",
    children: [
      {
        name: "AND",
        intro:
          "如果所有参数都为真，AND函数返回布尔值true，否则返回布尔值 false</br>用法：AND(逻辑表达式1,逻辑表达式2,...)</br>示例：AND(语文成绩>90,数学成绩>90,英语成绩>90)，如果三门课成绩都> 90，返回true，否则返回false"
      },
      {
        name: "FALSE",
        intro: "FALSE函数返回布尔值false</br>用法：FALSE()</br>示例：略"
      },
      {
        name: "IF",
        intro:
          'IF函数判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值</br>用法：IF(逻辑表达式,为true时返回的值,为false时返回的值)</br>示例：IF(语文成绩>60,"及格","不及格")，当语文成绩>60时返回及格，否则返回不及格'
      },
      {
        name: "IFS",
        intro:
          'IFS函数检查是否满足一个或多个条件，且返回符合第一个TRUE条件的值，IFS可以取代多个嵌套IF语句。</br>用法：IFS(逻辑表达式1,逻辑表达式1为true返回该值,逻辑表达式2,逻辑表达式2为true返回该值,...)</br>示例：IFS(语文成绩>90,"优秀",语文成绩>80,"良好",语文成绩>=60,"及格",语文成绩<60,"不及格")，根据成绩返回对应的评价。'
      },
      {
        name: "NOT",
        intro:
          "NOT函数返回与指定表达式相反的布尔值。</br>用法：NOT(逻辑表达式)</br>示例：NOT(语文成绩>60)，如果语文成绩大于60返回false，否则返回true"
      },
      {
        name: "OR",
        intro:
          "如果任意参数为真，OR 函数返回布尔值true；如果所有参数为假，返回布尔值false。</br>用法：OR(逻辑表达式1,逻辑表达式2,...)</br>示例：OR(语文成绩>90,数学成绩>90,英语成绩>90)，任何一门课成绩> 90，返回true，否则返回false"
      },
      {
        name: "TRUE",
        intro: "TRUE函数返回布尔值true</br>用法：TRUE()</br>示例：略"
      },
      {
        name: "XOR",
        intro:
          "XOR函数可以返回所有参数的异或值</br>用法：XOR(逻辑表达式1, 逻辑表达式2,...)</br>示例：XOR(语文成绩>90,数学成绩>90)，如果两门成绩都>90,返回false；如果两门成绩都<90，返回false；如果其中一门>90，另外一门<90，返回true"
      }
    ]
  }
];

/**
 * 获取所有函数名列表
 */
export const getFormulaFunNameList = () => {
  let funNameList = [];
  formulaList.forEach(item => {
    item.children.forEach(item => {
      funNameList.push(item.name);
    });
  });
  return funNameList;
};
