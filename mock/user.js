
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      // const { token } = config.query
      // const info = users[token]

      // mock error
      // if (!info) {
      //   return {
      //     code: 50008,
      //     message: 'Login failed, unable to get user details.'
      //   }
      // }

      return {
        'data': {
          'createdTs': '2019-01-14 10:30:26',
          'createdBy': 'admin',
          'lastUpdTs': '2019-09-16 20:22:03',
          'lastUpdBy': 'ANONYMOUS',
          'tenantId': null,
          'userId': 'admin',
          'empId': null,
          'userCode': 'admin',
          'mobilePhone': null,
          'weixCode': null,
          'userPass': 'ddbcfe94f08537e96133b213d75b9ffb3e405281eae546f644f298a27e9065f7',
          'userType': '01',
          'userHeadId': null,
          'userHeadImg': null,
          'userName': '管理员',
          'userStatus': '01',
          'pwdInitFlag': 'N',
          'pwdErrNum': 0,
          'unlockTs': null,
          'lastLoginTs': 1568702309000,
          'macCode': null,
          'ipAddr': null,
          'effectDt': null,
          'expireDt': null,
          'userOrgName': null,
          'menus': [
            'Valuation',
            'ValuationProdList',
            'ValuationRecCurve',
            'ValuationCurveRelationList',
            'ValuationMandatoryList',
            'ValuationBondsNonpList',
            'ValuationDateSetList',
            'ValuationTaskAllocationList',
            'Curve',
            'CurveProduct',
            'FlowDifference',
            'CurveProductDef',
            'CurveSetHisIndex',
            'QueryValuation',
            'OrderInfoList',
            'QueryCountValuation'
          ]
        },
        'msg': null,
        'flag': 0,
        'com': null
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
