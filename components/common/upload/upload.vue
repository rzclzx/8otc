<template>
  <div class="upload" @click="handleClick">
    <input type="file" ref="input" @change="handleChange" />
  </div>
</template>

<script>
  export default {
    name: 'upload',
    props: {
      beforeUpload: {
        type: Function
      },
      afterUpload: {
        type: Function
      },
      range: {
        type: Function
      },
      k: {
        type: String
      }
    },
    data () {
      return {
        speed: 140
      }
    },
    methods: {
      handleClick () {
        this.$refs.input.value = null
        this.$refs['input'].click()
      },
      handleChange (e) {
        const files = e.target.files
        if (!files) {
          return false
        }
        this.afterUpload && this.afterUpload(e)
        this.upload(files)
      },
      upload (file) {
        const before = this.beforeUpload(file[0])
        if (before) {
          let rg = this.$props.k
          this.$props.range('block', this.speed + 'px', rg)
          this.toolsApi.getOssToken(file[0].name)
            .then(res => {
              // 构造空对象，下面用append 方法赋值
              let formData = new FormData()
              formData.append('key', res.data.fileName)
              formData.append('OSSAccessKeyId', res.data.form.accessid)
              formData.append('policy', res.data.form.policy)
              formData.append('Signature', res.data.form.signature)
              formData.append('file', file[0])
              // 配置formData请求头
              let config = {
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (e) => {
                  let dis = this.speed - this.speed * (e.loaded / e.total)
                  this.$props.range('block', dis + 'px', rg)
                }
              }
              this.toolsApi.uploadOss(res.data.form.host, formData, config)
                .then(res => {
                  this.$props.range('block', '0px', rg)
//                  console.log(res)
                })
              this.$emit('fileName', res.data.fileName, rg)
              this.$emit('upLoadStatus', false)
            })
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .upload {
    position: absolute;
    z-index: 100;
    width: 100%;
    height: 100%;
    cursor: pointer;
    input[type="file"] {
      display: none;
      visibility: visible;
    }
  }
</style>
