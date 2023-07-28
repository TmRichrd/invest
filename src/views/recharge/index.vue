<template>
  <div class="dashboard-container">
    <el-tabs type="card" v-model="activeName" @tab-click="handleChangeTabs">
      <el-tab-pane label="充币查询" name="0"></el-tab-pane>
      <el-tab-pane label="提币查询" name="1"></el-tab-pane>
    </el-tabs>
    <avue-crud :option="option" :data="data" @search-reset="searchReset" @search-change="searchChange"
      :table-loading="loading" v-model="form" :page.sync="page" :search.sync="query" @on-load="onLoad"
      @refresh-change="refreshChange">

    </avue-crud>
  </div>
</template>
<script>
import { rechargeWithdraw } from "@/api"
let _that = this
export default {
  data () {
    return {
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
        menu: false,
        column: [
          {
            label: "用户id",
            prop: "userId"
          },
          {
            label: "用户名",
            prop: "name"
          },
          {
            hide: true,
            label: "手机号",
            prop: "phone",
            search: true
          },
          {
            label: this.query.type == 0 ? '充值账号' : '提币账号',
            prop: "address"
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
            label: "备注",
            prop: "comment"
          }
        ]
      }
    }
  },
  methods: {
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