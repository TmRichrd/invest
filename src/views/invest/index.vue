<template>
  <div class="dashboard-container">
    <avue-crud :option="option" :data="data" @search-reset="searchReset" @search-change="searchChange"
      :table-loading="loading" v-model="form" :page.sync="page" :search.sync="query" @on-load="onLoad"
      @refresh-change="refreshChange">
    </avue-crud>
  </div>
</template>

<script>
import { getInvestList } from "@/api"
export default {
  data () {
    return {

      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      loading: true,
      query: {},
      data: [],
      form: {},
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
        menu: false,
        column: [
          {
            label: '投资时间',
            prop: 'investTime',
          },
          {
            label: '投资类型',
            prop: "type",
            dicData: [
              {
                label: "贵宾厅一",
                value: 1
              },
              {
                label: "贵宾厅一",
                value: 2
              },
              {
                label: "贵宾厅三",
                value: 3
              },
            ]
          },
          {
            label: "份额",
            prop: "share"
          },
          {
            label: "收益",
            prop: "profit",
          },
          {
            label: "投资状态",
            prop: "status",
            type: "select",
            search: true,
            dicData: [
              {
                label: "投资中",
                value: true
              },
              {
                label: "已结束",
                value: false
              }
            ]
          },
          {
            label: "用户名",
            prop: "phone",
          },
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
      this.query = params
      this.onLoad(this.page, this.query)
      done()
    },
    onLoad (page, params = {}) {
      this.loading = true
      getInvestList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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