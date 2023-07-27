<template>
  <div class="dashboard-container">
    <avue-crud :option="option" :data="data" @search-reset="searchReset" @search-change="searchChange"
      :table-loading="loading" v-model="form" :page.sync="page" :search.sync="query" @on-load="onLoad"
      @refresh-change="refreshChange">
      <template slot="assets" slot-scope="{row}">
        <el-button type="text" @click="handleViewAssets(row)">查看资产</el-button>
      </template>
      <template slot="menu" slot-scope="{row}">
        <el-button icon="el-icon-lock" type="text" @click="handleRecharge(row)">充值</el-button>
        <el-button icon="el-icon-lock" type="text" @click="handleFreeze(row)">冻结资产</el-button>
        <el-button icon="el-icon-edit" type="text">修改密码</el-button>
      </template>
    </avue-crud>
    <el-dialog :visible.sync="visible" :before-close="handleClose">
      <el-descriptions title="资产情况" border>
        <el-descriptions-item label="资产余额">{{ currentRowAssets.usdtQty || 0 }}</el-descriptions-item>
        <el-descriptions-item label="直推奖励">{{ currentRowAssets.directkNum || 0 }}</el-descriptions-item>
        <el-descriptions-item label="间推奖励">{{ currentRowAssets.indirectNum || 0 }}</el-descriptions-item>
        <el-descriptions-item label="团队奖励">{{ currentRowAssets.teamkNum || 0 }}</el-descriptions-item>
        <el-descriptions-item label="平级奖励">{{ currentRowAssets.rangeNum || 0 }}</el-descriptions-item>
        <el-descriptions-item label="签到奖励">{{ currentRowAssets.checkNum || 0 }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, RechargeAdd } from "@/api"
export default {
  data () {
    return {
      currentRowAssets: {

      },
      visible: false,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      loading: true,
      query: {},
      data: [],
      form: {},
      option1: {
        size: "large",
        submitText: '充值',
        column: [
          {
            label: "充值金额",
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
            prop: 'id',
          },
          {
            label: '用户名',
            prop: "name",
          },
          {
            label: "手机号",
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
          }
        ]
      }
    }
  },
  methods: {
    handleRecharge (row) {
      this.$DialogForm.show({
        title: "充值",
        width: '30%',
        menuPosition: 'right',
        option: this.option1,
        beforeClose: (done) => {
          done()
        },
        callback: (res) => {
          RechargeAdd(0, row.phone, res.data.num).then(res => {
            this.$message.success(res.msg)
            res.done()
          }).catch(err => {
            res.done()
          })
        }
      })
    },
    handleFreeze () {
      this.$confirm('此操作将冻结该用户资产, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '冻结成功!'
        });
      })
    },
    handleClose () {
      this.visible = false
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
      getUserList(page.current, page.size, Object.assign(params, this.query)).then(res => {
        this.data = res.data
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