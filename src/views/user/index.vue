<template>
  <div class="dashboard-container">
    <avue-crud :option="option" :data="data" @search-reset="searchReset" @search-change="searchChange"
      :table-loading="loading" v-model="form" :page.sync="page" :search.sync="query" @on-load="onLoad"
      @refresh-change="refreshChange">
      <template slot="assets" slot-scope="{row}">
        <el-button type="text" @click="handleViewAssets(row)">查看资产</el-button>
      </template>
      <template slot="menu" slot-scope="{row}">
        <el-button icon="el-icon-s-finance" type="text" @click="handleRecharge(row)">充值</el-button>
        <el-button icon="el-icon-lock" type="text" v-if="!row.locked" @click="handleFreeze(row, true)">冻结资产</el-button>
        <el-button icon="el-icon-unlock" type="text" v-if="row.locked" @click="handleFreeze(row, false)">解冻资产</el-button>
        <el-button icon="el-icon-edit" type="text" @click="handleChangePwd(row)">修改密码</el-button>
      </template>
    </avue-crud>
    <!-- 资产情况 -->
    <el-dialog :visible.sync="visible" :before-close="handleClose">
      <el-descriptions title="资产情况" border>
        <el-descriptions-item label="资产余额">{{ currentRowAssets.usdtQty || 0 }}</el-descriptions-item>
        <el-descriptions-item label="直推奖励">{{ currentRowAssets.directkNum || 0 }}</el-descriptions-item>
        <el-descriptions-item label="间推奖励">{{ currentRowAssets.indirectNum || 0 }}</el-descriptions-item>
        <el-descriptions-item label="团队奖励">{{ currentRowAssets.teamkNum || 0 }}</el-descriptions-item>
        <el-descriptions-item label="平级奖励">{{ currentRowAssets.rangeNum || 0 }}</el-descriptions-item>
        <el-descriptions-item label="签到奖励">{{ currentRowAssets.checkNum || 0 }}</el-descriptions-item>
        <el-descriptions-item label="直推人数">{{ currentRowAssets.directPushTotal || 0 }}</el-descriptions-item>
        <el-descriptions-item label="团队人数">{{ currentRowAssets.teamTotal || 0 }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="pwdDialog" :before-close="handleClose">
      <el-tabs>
        <el-tab-pane label="修改登录密码">
          <avue-form :option="option1" ref="form1" v-model="form1" @submit="handleSubmit1"></avue-form>
        </el-tab-pane>
        <el-tab-pane label="修改交易密码">
          <avue-form :option="option2" ref="form2" v-model="form2" @submit="handleSubmit2"></avue-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, RechargeAdd, FreezeAssets, updatePassword, updatePayPassword } from "@/api"
export default {
  data () {
    return {
      form1: {},
      form2: {},
      currentRowAssets: {

      },
      visible: false,
      pwdDialog: false,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      loading: true,
      query: {},
      data: [],
      form: {},
      option3: {
        size: "large",
        submitText: '充值',
        column: [
          {
            label: "充值USDT",
            labelWidth: "100",
            prop: "num",
            type: "number",
            min: 1,
            rules: [
              {
                required: true,
                message: "请输入充值金额",
                trigger: "blur"
              }
            ]
          }
        ]
      },
      option1: {
        size: "large",
        labelWidth: 120,
        column: [
          {
            label: "原密码",
            prop: "password",
            type: "password",
            span: 13,
            rules: [
              {
                required: true,
                message: "请输入原密码",
                trigger: "blur"
              },
              {
                max: 18,
                min: 6,
                message: "密码长度在6-18位之间",
                trigger: "blur"
              }
            ]
          },
          {
            label: "新密码",
            prop: "newPassword",
            type: "password",
            span: 13,
            rules: [
              {
                required: true,
                message: "请输入新密码",
                trigger: "blur"
              },
              {
                max: 18,
                min: 6,
                message: "密码长度在6-18位之间",
                trigger: "blur"
              }
            ]
          }
        ]
      },
      option2: {
        size: "large",
        labelWidth: 120,
        column: [
          {
            label: "原支付密码",
            prop: "payPwd",
            type: "password",
            span: 13,
            rules: [
              {
                required: true,
                message: "请输入原支付密码",
                trigger: "blur"
              },
              {
                max: 18,
                min: 6,
                message: "密码长度在6-18位之间",
                trigger: "blur"
              }
            ]
          },
          {
            label: "新支付密码",
            prop: "newPayPwd",
            type: "password",
            span: 13,
            rules: [
              {
                required: true,
                message: "请输入新支付密码",
                trigger: "blur"
              },
              {
                max: 18,
                min: 6,
                message: "密码长度在6-18位之间",
                trigger: "blur"
              }
            ]
          }
        ]
      },
      option: {
        border: false,
        index: false,
        size: 'large',
        filterBtn: false,
        headerAlign: 'center',
        align: 'center',
        dialogWidth: "40%",
        labelWidth: 140,
        searchSpan: 6,
        searchMenuSpan: 8,
        searchGutter: 40,
        searchMenuPosition: 'left',
        addBtn: false,
        columnBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 300,
        column: [
          {
            label: 'ID',
            prop: 'userId',
          },
          {
            label: "上级ID",
            prop: "lastIdentityId"
          },
          {
            label: "用户名",
            prop: "phone",
            search: true
          },
          {
            label: "邀请码",
            prop: "inviteCode"
          },
          {
            label: "是否有效用户",
            prop: "validValue"
          },
          {
            label: "代理等级",
            prop: "lever"
          },
          {
            label: "资产情况",
            prop: "assets",
            slot: true,
          },
          {
            label: "是否冻结",
            prop: "lockedValue"
          }
        ]
      }
    }
  },
  methods: {
    handleSubmit1 (form, done) {
      const model = {
        id: this.currentRowAssets.userId,
        ...form
      }
      updatePassword(model).then(res => {
        if (res.code == 200)
        {
          this.$message.success(res.msg)
          this.handleClose()
          this.$refs.form1.resetFields()
        } else
        {
          this.$message.error(res.msg)
        }
      }).finally(() => {
        done()
      })
    },
    handleSubmit2 (form, done) {
      const model = {
        id: this.currentRowAssets.userId,
        ...form
      }
      updatePayPassword(model).then(res => {
        if (res.code == 200)
        {
          this.$message.success(res.msg)
          this.handleClose()
          this.$refs.form2.resetFields()
        } else
        {
          this.$message.error(res.msg)
        }
      }).finally(() => {
        done()
      })
    },
    handleChangePwd (row) {
      this.currentRowAssets = row
      this.pwdDialog = true
    },
    handleRecharge (row) {
      this.$DialogForm.show({
        title: "充值",
        width: '30%',
        menuPosition: 'right',
        option: this.option3,
        beforeClose: (done) => {
          done()
        },
        callback: (res) => {
          RechargeAdd(0, row.phone, res.data.num, 0).then(res => {
            this.$message.success(res.msg)
            res.done()
          }).catch(err => {
            res.done()
          })
        }
      })
    },
    handleFreeze (row, locked) {
      this.$confirm(`此操作将${row.locked ? '解冻' : '冻结'}该用户资产, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        FreezeAssets(row.userId, locked).then(res => {
          if (res.code == 200)
          {
            this.$message.success(res.msg)
          }
          this.onLoad(this.page, this.query)
        })
      })
    },
    handleClose () {
      this.visible = false
      this.pwdDialog = false
      this.currentRowAssets = {}
    },
    handleViewAssets (row) {
      this.visible = true
      this.currentRowAssets = row
    },
    searchReset () {
      this.query = {};
      this.onLoad(this.page);
    },
    refreshChange () {
      this.onLoad(this.page, this.query)
    },
    searchChange (params, done) {
      this.page.currentPage = 1
      this.query = params
      this.onLoad(this.page, this.query)
      done()
    },
    onLoad (page, params = {}) {
      this.loading = true
      const model = Object.assign(params, this.query)
      Object.keys(model).forEach(key => {
        if (model[key] === '')
        {
          delete model[key];
        }
      });
      getUserList(page.currentPage, page.pageSize, model).then(res => {
        this.data = res.data.list
        this.page.total = res.data.total
        this.loading = false
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>