export default [
  {
    url: '/curveProduct/curve',
    type: 'post',
    response: config => {
      return {
        flag: 0,
        data: {
          dataList: [{
            id: 'curve1',
            name: '曲线一'
          },
          {
            id: 'curve2',
            name: '曲线二'
          },
          {
            id: 'curve3',
            name: '曲线三'
          },
          {
            id: 'curve4',
            name: '曲线四'
          }]
        }
      }
    }
  }
]
