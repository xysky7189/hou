<template>
  <el-card>
    <div slot="header">
      <span>素材管理</span>
    </div>
    <div class="action">
      <el-radio-group v-model="active">
        <el-radio-button label="全部" @click.native="loadImages(false)"></el-radio-button>
        <el-radio-button label="收藏" @click.native="loadImages(true)"></el-radio-button>
      </el-radio-group>
      <el-upload
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="{ Authorization: `Bearer ${$store.state.user.token}` }"
        name="image"
        :on-success="handleUploadSuccess"
        :show-file-list="false">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>
    <el-row :gutter="20">
      <el-col :span="4" v-for="item in images" :key="item.id" style="margin-bottom: 10px;">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.url" class="image" style="max-width: 100%;">
          <div style="padding: 10px;">
            <div class="bottom clearfix">
              <el-button
                plain
                type="primary"
                :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
                circle
                @click="handleCollect(item)"
              ></el-button>
              <el-button
                plain
                type="primary"
                icon="el-icon-delete"
                circle
                @click="handleDelete(item)"
              ></el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'MediaList',
  data () {
    return {
      active: '全部',
      images: []
    }
  },
  created () {
    this.loadImages()
  },
  methods: {
    async loadImages (collect = false) {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/images',
          params: {
            collect,
            page: 1,
            per_page: 10
          }
        })
        this.images = data.results
      } catch (err) {
        console.log(err)
        this.$message.error('加载图片列表失败')
      }
    },
    async handleCollect (item) {
      const collect = !item.is_collected
      try {
        const data = await this.$http({
          method: 'PUT',
          url: `/user/images/${item.id}`,
          data: {
            collect
          }
        })
        item.is_collected = data.collect
        this.$message({
          type: 'success',
          message: `${collect ? '' : '取消'}收藏成功`
        })
      } catch (err) {
        console.log(err)
        this.$message.error('收藏失败')
      }
    },
    async handleDelete (item) {
      try {
        await this.$http({
          method: 'DELETE',
          url: `/user/images/${item.id}`
        })
        this.loadImages()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      } catch (err) {
        this.$message.error('删除失败')
      }
    },
    handleUploadSuccess () {
      this.loadImages()
    }
  }
}
</script>

<style lang="less" scoped>
.action {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.botton {
  display: flex;
  justify-content: center;
}
</style>
