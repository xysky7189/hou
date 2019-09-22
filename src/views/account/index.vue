<template>
  <el-card>
    <div slot="header">
      <span>账户设置</span>
    </div>
    <el-row>
      <el-col :span="10">
        <el-form v-loading="loading">
          <el-form-item label="媒体名称">
            <el-input v-model="user.name"></el-input>
          </el-form-item>
          <el-form-item label="媒体简介">
            <el-input v-model="user.intro"></el-input>
          </el-form-item>
          <el-form-item label="头条号ID">
            <el-input disabled :value="user.id"></el-input>
          </el-form-item>
          <el-form-item label="绑定手机">
            <el-input disabled :value="user.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSave">保存更新</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="2" :span="10">
        <p>头像设置</p>
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
          :show-file-list="false"
          :http-request="handleUpload">
          <!-- 用来预览上传的图片 -->
          <img v-if="user.photo" :src="user.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p>点击上传头像</p>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'AccountSettings',
  data () {
    return {
      user: {},
      loading: false
    }
  },
  created () {
    this.loadUser()
  },
  methods: {
    async loadUser () {
      this.loading = true
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/profile'
        })
        this.user = data
      } catch (err) {
        this.$message.error('加载账户信息失败')
      }
      this.loading = false
    },
    async handleSave () {
      try {
        const { name, intro, email } = this.user
        const data = await this.$http({
          method: 'PATCH',
          url: '/user/profile',
          data: {
            name,
            intro,
            email
          }
        })
        this.$message({
          type: 'success',
          message: '保存修改成功'
        })
        this.$store.commit('changeUser', data)
      } catch (err) {
        this.$message.error('保存修改失败')
      }
    },
    async handleUpload (uploadConfig) {
      try {
        const formData = new FormData()
        formData.append('photo', uploadConfig.file)
        const data = await this.$http({
          method: 'PATCH',
          url: '/user/photo',
          data: formData
        })
        this.user.photo = data.photo
        this.$store.commit('changeUser', this.user)
        this.$message({
          type: 'success',
          message: '修改媒体头像成功'
        })
      } catch (err) {
        this.$message.error('修改媒体头像失败')
      }
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style lang="less" scoped>
</style>
