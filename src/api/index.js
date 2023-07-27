import request from '@/utils/request'

// 获取用户列表
export function getUserList(current,size,params) {
  return request({
    url: '/invest/usdtDetail/getList',
    method: 'get',
    params:{
      current,
      size,
      ...params
    }
  })
}
// 发布公告
export function addNotice(context) {
  return request({
    url: '/invest/announcement/add',
    method: 'post',
    data:{context}
  })
}

// 签到列表
export function getSignIn (){
  return request({
    url:"/invest/checkRecord/dayList",
    method:"get"
  })
}
// 
export function rechargeWithdraw(current,size,params) {
  return request({
    url: '/invest/rechargeWithdraw/list',
    method: 'get',
    params:{
      current,
      size,
      ...params
    }
})
}
// 投资信息列表
export function getInvestList(current,size,params) {
  return request({
    url: '/invest/investInfo/list',
    method: 'get',
    params:{
      current,
      size,
      ...params
    }
})
}
// 充值
export function RechargeAdd(type,phone,num) {
  return request({
    url: '/invest/rechargeWithdraw/add',
    method: 'post',
    data:{
      type,
      phone,
      num
    }
})
}