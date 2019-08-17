export const calc = {
  /*
       函数，加法函数，用来得到精确的加法结果
       说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
       参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
       调用：Calc.Add(arg1,arg2,d)
       返回值：两数相加的结果
       */
  Add: function (arg1, arg2) {
    arg1 = arg1.toString()
    arg2 = arg2.toString()
    var arg1Arr = arg1.split('.')
    var arg2Arr = arg2.split('.')
    var d1 = arg1Arr.length == 2 ? arg1Arr[1] : ''
    var d2 = arg2Arr.length == 2 ? arg2Arr[1] : ''
    var maxLen = Math.max(d1.length, d2.length)
    var m = Math.pow(10, maxLen)
    var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen))
    var d = arguments[2]
    return typeof d === 'number' ? Number((result).toFixed(d)) : result
  },
  /*
       函数：减法函数，用来得到精确的减法结果
       说明：函数返回较为精确的减法结果。
       参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
       调用：Calc.Sub(arg1,arg2)
       返回值：两数相减的结果
       */
  Sub: function (arg1, arg2) {
    return this.Add(arg1, -Number(arg2), arguments[2])
  },
  /*
       函数：乘法函数，用来得到精确的乘法结果
       说明：函数返回较为精确的乘法结果。
       参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
       调用：Calc.Mul(arg1,arg2)
       返回值：两数相乘的结果
       */
  Mul: function (arg1, arg2) {
    var r1 = arg1.toString()
    var r2 = arg2.toString()
    var m
    var resultVal
    var d = arguments[2]
    m = (r1.split('.')[1] ? r1.split('.')[1].length : 0) + (r2.split('.')[1] ? r2.split('.')[1].length : 0)
    resultVal = Number(r1.replace('.', '')) * Number(r2.replace('.', '')) / Math.pow(10, m)
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
  },
  /*
       函数：除法函数，用来得到精确的除法结果
       说明：函数返回较为精确的除法结果。
       参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
       调用：Calc.Div(arg1,arg2)
       返回值：arg1除于arg2的结果
       */
  Div: function (arg1, arg2) {
    var r1 = arg1.toString()
    var r2 = arg2.toString()
    var m
    var resultVal
    var d = arguments[2]
    m = (r2.split('.')[1] ? r2.split('.')[1].length : 0) - (r1.split('.')[1] ? r1.split('.')[1].length : 0)
    resultVal = Number(r1.replace('.', '')) / Number(r2.replace('.', '')) * Math.pow(10, m)
    return typeof d !== 'number' ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)))
  },
  /*
       函数：hash函数，用来得到字符hash值
       说明：。
       参数：input 需要被hash的值
       调用：Calc.Hash(input)
       返回值：hash后的值
  */
  I64BIT_TABLE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split(''),

  Hash: function (input) {
    try {
      if (typeof input == 'object') input = JSON.stringify(input)
    } catch (e) {

    }
    var hash = 5381;
    var i = input.length - 1;
    if (typeof input == 'string') {
      for (; i > -1; i--)
        hash += (hash << 5) + input.charCodeAt(i);
    } else {
      for (; i > -1; i--)
        hash += (hash << 5) + input[i];
    }
    var value = hash & 0x7FFFFFFF;
    var retValue = '';
    do {
      retValue += this.I64BIT_TABLE[value & 0x3F];
    }
    while (value >>= 6);
    return retValue;
  }
}
