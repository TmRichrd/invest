<template>
  <div class="dashboard-container">
    <el-tabs type="card" v-model="activeName" @tab-click="handleChangeTabs">
      <el-tab-pane label="充币查询" name="0"></el-tab-pane>
      <el-tab-pane label="提币查询" name="1"></el-tab-pane>
    </el-tabs>
    <avue-crud :option="option" :data="data" @search-reset="searchReset" @search-change="searchChange"
      :table-loading="loading" v-model="form" :page.sync="page" :search.sync="query" @on-load="onLoad"
      @refresh-change="refreshChange">
      <template slot="menu" slot-scope="{row}">
        <el-button type="text" icon="el-icon-s-claim" v-show="row.status == 4" @click="handleEdit(row)">审核</el-button>
      </template>
    </avue-crud>
    <el-dialog title="审核" :visible.sync="examineDialog">
      <avue-form :defaults.sync="defaults" ref="defaultForm" @submit="handleExamine" :option="option1"
        v-model="defaultForm"></avue-form>
    </el-dialog>
  </div>
</template>
<script>

import { rechargeWithdraw, ExamineStatus } from "@/api"
export default {
  data () {
    return {
      row: {},
      defaults: {},
      defaultForm: {
        status: 3,
        comment: ""
      },
      option1: {
        size: "large",
        column: [
          {
            label: "审核状态",
            prop: "status",
            type: "radio",
            span: 13,
            rules: [{ required: true, message: "请选择审核状态", trigger: "change" }],
            dicData: [
              {
                label: "审核通过",
                value: 3
              },
              {
                label: "审核不通过",
                value: 5
              }
            ]
          },
          {
            label: "失败原因",
            prop: "comment",
            span: 13,
            type: "textarea",
            display: false,
          }
        ]
      },
      examineDialog: false,
      activeName: '0',
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      loading: true,
      query: {
        type: 0,
        phone: ""
      },
      data: [],
      form: {},
    }
  },
  watch: {
    'defaultForm.status' (val) {
      if (val == 3)
      {
        this.defaults.comment.display = false
      } else
      {
        this.defaults.comment.display = true
      }
    }
  },
  computed: {
    option () {
      return {
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
        menu: this.query.type == 0 ? false : true,
        column: [
          {
            label: "用户id",
            prop: "userId"
          },
          {
            label: "用户名",
            prop: "phone",
            search: true
          },
          {
            label: this.query.type == 0 ? '充值人' : '提币账号',
            prop: "updateName"
          },
          {
            label: this.query.type == 0 ? '已充值金额' : '提币数量',
            prop: "num"
          },
          {
            label: this.query.type == 0 ? '充值时间' : '提币时间',
            prop: "time"
          },
          {
            label: this.query.type == 0 ? '充值状态' : '提币状态',
            prop: "statusValue"
          },
          {
            label: "失败原因",
            prop: "comment"
          }
        ]
      }
    }
  },
  methods: {
    // 审核
    handleExamine (form, done) {
      const model = {
        ...this.row,
        status: form.status,
        comment: form.comment
      }
      ExamineStatus(model).then(res => {
        if (res.code == 200)
        {
          this.$message.success(res.msg)
        } else
        {
          this.$message.error(res.msg)
        }
      }).finally(() => {
        done()
        this.handleClose()
        this.onLoad(this.page, this.query)
      })
    },
    handleClose () {
      this.examineDialog = false
      this.$refs.defaultForm.resetFields()
      this.row = {}
    },
    handleEdit (row) {
      const model = {
        id: row.id,
        userId: row.userId,
        num: row.num,
        type: row.type,
        address: row.address
      }
      this.examineDialog = true
      this.row = model
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
      rechargeWithdraw(page.currentPage, page.pageSize, model).then(res => {
        this.data = res.data.list
        this.page.total = res.data.total
        this.loading = false
      })
    },
    handleChangeTabs (e) {
      this.query.type = Number(e.name)
      this.onLoad(this.page, this.query)
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