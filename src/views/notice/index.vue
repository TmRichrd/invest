<template>
  <div class="dashboard-container">
    <avue-form v-model="form" :option="option" @submit="submit">

    </avue-form>
  </div>
</template>
<script>
import { addNotice } from "@/api"
export default {
  data () {
    return {
      form: {
        content: ""
      },
      option: {
        size: "large",
        enter: true,
        column: [
          {
            label: "公告内容",
            prop: "content",
            type: "textarea",
            rules: [
              {
                required: true,
                message: "请输入公告内容",
                trigger: "blur"
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    submit (form, done) {
      addNotice(form.content).then(res => {
        this.$message.success(res.msg)
        done()
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