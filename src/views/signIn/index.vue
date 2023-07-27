<template>
  <div class="dashboard-container">
    <avue-crud :option="option" :data="data" @search-reset="searchReset" @search-change="searchChange"
      :table-loading="loading" v-model="form" :page.sync="page" :search.sync="query" @on-load="onLoad"
      @refresh-change="refreshChange">
    </avue-crud>
  </div>
</template>

<script>
import { getSignIn } from "@/api"
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
            label: '用户id',
            prop: 'userId',
          },
          {
            label: '用户名',
            prop: "name",
          },
          {
            label: "签到时间",
            prop: "checkTime",
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
      getSignIn().then(res => {
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