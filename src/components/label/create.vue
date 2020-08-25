<template>
  <div class="create-new-label-cont">
    <div v-show='!quickAddMode' class="create-new-label-header">
      <Icon type="ios-arrow-back" @click="$emit('backListHandle')" class="back-btn" />
      <span class="title-name">{{ createMode ? '新建标签' : '编辑标签' }}</span>
      <Icon type="md-close" @click="$emit('closeHandle')" class="close-btn" />
    </div>
    <div class="create-new-label-wrapper">
      <Input v-model="newLabelName"
        v-show='!quickAddMode'
        :maxlength="20"
        @on-enter="createNewLabelHandle"
        class="create-new-label-input" maxlength="20" placeholder="标签名称"></Input>
      <div v-if='showErrorInfo' class="error-info">{{ errorInfo }}</div>
      <div class="color-pick-cont">
        <Icon type='md-checkmark'
          v-for='color,index in themeList'
          :key='color'
          @click="choosedIdx = index"
          :class="['color-pick-item', `color-pick-item-${color}`, choosedIdx == index ? 'choosed' : '']"></Icon>
      </div>
      <div class="create-new-label-footer">
        <Button type="error"
          v-if='editRow'
          @click.stop="deleteLabelHandle"
          ghost>删除</Button>
        <Button type="primary"
          @click.stop="editLabelHandle"
          :disabled='!newLabelName'
          v-if='editRow'
          long>完成</Button>
        <Button type="primary"
          @click.stop="createNewLabelHandle"
          :disabled='!newLabelName'
          v-if='!editRow && !quickAddMode'
          long>创建</Button>
        <Button type="primary"
          @click.stop="quickCreateHandle"
          v-if='quickAddMode'
          long>创建</Button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      editRow: {
        type: [Object, null]
      },
      editRowIdx: {
        type: [Number, null]
      },
      labelList: {
        type: Array
      },
      createMode: {
        type: Boolean
      },
      quickAddMode: {
        type: Boolean
      }
    },
    data() {
      return {
        newLabelName: '',
        choosedIdx: 0,
        showErrorInfo: false,
        errorInfo: '',
        themeList: ['primary', 'success', 'default', 'warning', 'danger']
      }
    },
    watch: {
      editRow (newVal) {
        if (newVal && newVal.name && newVal.color) {
          this.newLabelName = newVal.name
          this.choosedIdx = this.themeList.indexOf(newVal.color)
        } else {
          this.newLabelName = ''
          this.choosedIdx = 0
        }
      }
    },
    created () {
      if (this.editRow) {
        this.newLabelName = this.editRow.name
        this.choosedIdx = this.themeList.indexOf(this.editRow.color)
      }
    },
    methods: {
      createNewLabelHandle () {
        if (!this.newLabelName) {
          return
        }
        // 判断是否存在同名标签
        const matched = this.labelList.filter(item => item.name === this.newLabelName)
        // 标签名一样
        if (matched.length > 0) {
          this.errorInfo = '标签名称已存在'
          this.showErrorInfo = true
          return
        }
        const newTag = {
          name: this.newLabelName,
          color: this.themeList[this.choosedIdx]
        }
        this.$emit('createNewHandle', {
          newTag,
          editRowIdx: this.editRowIdx
        })
        this.reset()
      },
      quickCreateHandle () {
        this.$emit('quickCreateLabelHandle', {
          color: this.themeList[this.choosedIdx]
        })
      },
      editLabelHandle () {
        if (!this.newLabelName) {
          return
        }
        // 判断是否存在同名标签
        const matched = this.labelList.filter(item => item.name === this.newLabelName)
        if (this.editRow && this.newLabelName === this.editRow.name
          && this.editRow.color === this.themeList[this.choosedIdx]) {
          // 颜色 & 名称一样，仅关闭
          this.$emit('backListHandle')
        } else {
          const newTag = {
            name: this.newLabelName,
            color: this.themeList[this.choosedIdx]
          }
          this.$emit('createNewHandle', {
            newTag,
            editRowIdx: this.editRowIdx
          })
        }
        this.reset()
      },
      deleteLabelHandle () {
        this.$emit('deleteLabel')
      },
      reset () {
        this.newLabelName = ''
        this.choosedIdx = 0
        this.errorInfo = ''
        this.showErrorInfo = false
      }
    }
  }
</script>