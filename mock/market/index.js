export default [
  {
    url: '/basic-prod/indices',
    type: 'post',
    response: _ => {
      return {
        flag: 0,
        data: {
          basicIndices: [{
            id: 'jianc',
            name: '债券简称'
          },
          {
            id: 'daim',
            name: '债券代码'
          },
          {
            id: 'liut',
            name: '流通场所'
          }],
          compIndices: [{
            id: 'jianc1212',
            name: '待尝期'
          },
          {
            id: 'daim312331',
            name: '估价净价'
          },
          {
            id: 'liut12333123',
            name: '估价凸性'
          },
          {
            id: 'liut113323123',
            name: '估价收益率'
          },
          {
            id: 'liut2323144',
            name: '估价修正期'
          }]
        }
      }
    }
  },
  {
    url: '/valuation/way',
    type: 'post',
    response: _ => {
      return {
        flag: 0,
        data: {
          datalist: [{
            id: 'jianc222',
            name: '成本法'
          },
          {
            id: 'daim22',
            name: 'DCF'
          },
          {
            id: 'liut222',
            name: '市场法'
          },
          {
            id: 'liut1222',
            name: '清算法'
          }]
        }
      }
    }
  },
  {
    url: '/batch/list',
    type: 'post',
    response: _ => {
      return {
        flag: 0,
        data: {
          datalist: [{
            batchId: 'batchId1',
            batchName: '批次1'
          },
          {
            batchId: 'batchId2',
            batchName: '批次2'
          },
          {
            batchId: 'batchId3',
            batchName: '批次3'
          },
          {
            batchId: 'batchId4',
            batchName: '批次4'
          }]
        }
      }
    }
  }
]
