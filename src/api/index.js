import request from "@/utils/request";

// 获取用户列表
export function getUserList(pageNum, pageSize, params) {
  return request({
    url: "/invest/usdtDetail/getList",
    method: "get",
    params: {
      pageNum,
      pageSize,
      ...params,
    },
  });
}
// 发布公告
export function addNotice(context) {
  return request({
    url: "/invest/announcement/add",
    method: "post",
    data: { context },
  });
}

// 签到列表
export function getSignIn() {
  return request({
    url: "/invest/checkRecord/dayList",
    method: "get",
  });
}
//
export function rechargeWithdraw(pageNum, pageSize, params) {
  return request({
    url: "/invest/rechargeWithdraw/list",
    method: "get",
    params: {
      pageNum,
      pageSize,
      ...params,
    },
  });
}
// 投资信息列表
export function getInvestList(pageNum, pageSize, params) {
  return request({
    url: "/invest/investInfo/list",
    method: "get",
    params: {
      pageNum,
      pageSize,
      ...params,
    },
  });
}
// 充值
export function RechargeAdd(type, phone, num) {
  return request({
    url: "/invest/rechargeWithdraw/add",
    method: "post",
    data: {
      type,
      phone,
      num,
    },
  });
}

// 解冻/冻结资产
export function FreezeAssets(id, locked) {
  return request({
    url: "/invest/userInfo/fundLocked",
    method: "post",
    data: {
      id,
      locked,
    },
  });
}

// 修改登录密码
export function updatePassword(data) {
  return request({
    url: "/invest/userInfo/updatePass",
    method: "post",
    data,
  });
}
// 修改支付密码
export function updatePayPassword(data) {
  return request({
    url: "/invest/userInfo/updatePayPwd",
    method: "post",
    data,
  });
}
