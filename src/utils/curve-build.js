// 曲线编制时使用的纯函数

// 生成曲线参考区
// curves: 参考曲线数组 [{ standSlip: 0.08, todayYield: 1.22, yesterdayYield: 1.23 }]
// mainCurve: 当前曲线 { standSlip: 0.08, adjResult: 1.22, lastYield: 1.23 }
// lfr: 基准利率
// 返回参数为 { standSlip: 0.08, yesterdayYield: 1.23, todayYield: 1.22, rateChange: 0.01, yDiff: 1.22, tDiff: 1.23, diffChange: 0.01, tax: 0 }
// 返回参数分别为: 期限、昨日收益率、今日收益率、两日变动、昨日点差、今日点差、两日点差变动、税收效应
export function makeReferCurve(curves, mainCurve, lfr) {
}

// 生成曲线关系模板区
// type: 类型，分别为: 1. 其他点差 2. 其他点差和利差 3. 自身点差 4. 自身点差倒挂
// curves: 关系曲线数组 [{ curveId: 'curve_id', list: [{ standSlip: 0.08, todayYield: 1.22, yesterdayYield: 1.23 }, referFlag: true, nowOrderFlag: true, nowOrderFlagBySpread: true]}]
// curveId为曲线ID，referFlag为是否为族系区，nowOrderFlag批次是否为当前批次，nowOrderFlagBySpread利差批次是否为当前批次
// 默认 yesterdayYield 是 曲线该批次收益率，todayYield 是 利差关系时使用的利差批次收益率
// curves是包括当前曲线本身的, 但是批次可能不一样
// mainCurve: 当前曲线 { standSlip: 0.08, adjResult: 1.22, lastYield: 1.23 }
// slips: 关系模板使用的关键期限
// lfr: 基准利率
// 返回参数为 [{ standSlip: 0.08, 'curve_id': 1.11, 'curve_id': 1.22, ..., 'curve_id_1': 1.01, 'curve_id_1': 1.02, ... }]
// 返回参数分别为: 期限、曲线1的ID、曲线2的ID等等，如果是其他点差和利差，还需要包括曲线1的ID + '_1'、曲线2的ID + '_1'
export function makeRelationCurve(type, curves, mainCurve, slips, lfr) {

}

// 行情选点
// obj: 行情选点的参数 { standSlip: 0.08, bondNo: '111', bondName: '债券', slip: 0.10, yield: 1.29, deviations: 20, curveId: 'curve_id', itemName: '收益率', isMultiple: true }
// 如果选择的是收益率，yield有值，deviations不存在，如果是偏差值，yield不存在，deviations有值
// credit: 是否为信用线标识，信用线为true，利率线为false
// lfr: 基准利率
// 返回参数为
export function marketSelected(obj, credit, lft) {
}

// 计算曲线
export function calcCurve() {
}
