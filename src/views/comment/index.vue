<template>
  <el-card>
    <div slot="header">
      <span>评论管理</span>
    </div>
    <el-table :data="articles">
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
      <el-table-column label="评论粉丝数" prop="fans_comment_count"></el-table-column>
      <el-table-column label="允许评论">
        <template slot-scope="scope">
          <el-switch
            :disabled="scope.row.disabled"
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleChangeStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'ArticleComment',
  data () {
    return {
      articles: []
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    async loadArticles () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/articles',
          params: {
            response_type: 'comment'
          }
        })
        data.results.forEach(item => {
          item.disabled = false
        })
        this.articles = data.results
      } catch (err) {
        this.$message.error('加载文章列表失败')
      }
    },
    async handleChangeStatus (item) {
      try {
        item.disabled = true
        await this.$http({
          method: 'PUT',
          url: '/comments/status',
          params: {
            article_id: item.id.toString()
          },
          data: {
            allow_comment: item.comment_status
          }
        })
        this.$message({
          type: 'success',
          message: `${item.comment_status ? '启用' : '禁用'}评论状态成功`
        })
      } catch (err) {
        console.log(err)
        this.$message.error('修改评论状态失败')
        item.comment_status = !item.comment_status
      }
      item.disabled = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
