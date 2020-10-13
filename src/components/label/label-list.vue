<template>
  <div :class="wrapClasses">
    <ul :class='ulClasses'>
      <li v-for='tag,index in labelModel' :key='tag.name' :class="liClasses">
        <span :class='["tag", `tag-${tag.color}`]'>
          <span class="tag-name">{{ tag.name }}</span>
        </span>
        <Icon type="ios-close-circle"
          @click="deleteChoosedTagByIdx(tag, index)"
          :class='["remove-tag-handler", `remove-tag-handler-${tag.color}`]' />
      </li>
      <li :class="addClasses" v-if='!viewMode'>
        <Dropdown trigger="custom" :visible='visible'
          @on-clickoutside='clickOutSideHandle'
          placement="bottom-start">
          <Button type="text" @click="showLabelListHandle" size='small'
            v-show='labelModel && labelModel.length == 0'
            class="add-label-text-btn">添加标签</Button>
          <Icon type="ios-add-circle"
            v-show='labelModel && labelModel.length > 0'
            @click.native="showLabelListHandle"
            class="add-label-icon-btn" />
          <DropdownMenu slot="list" ref='customDropdown'>
            <div v-show='!showCreateMode' class="dropdown-custom-wrapper">
              <div class="dropdown-custom-cont">
                <Input v-model="labelSearchModel" :maxlength="20" :placeholder="getQuickAddModeStatus ? '输入标签' : '搜索标签'" class="search-label-ipt" />
                <div class="btn-in-input">
                  <Icon type="ios-add-circle-outline" @click="showCreateHandle" class="add-label-item-icon" />
                </div>
              </div>
              <div class="dropdown-custom-list-cont">
                <DropdownItem v-for='tag,idx in labelList'
                  :key='tag.name'
                  :name='tag.name'
                  v-show='tag.name.indexOf(labelSearchModel) != -1'
                  @click.native='chooseTagHandle(tag)'
                  class="dropdown-custom-list-item">
                  <i :class="['dropdown-custom-list-circle', `dropdown-custom-list-circle-${tag.color}`]"></i>
                  <span class="dropdown-custom-list-value">{{ tag.name }}</span>
                  <span class="dropdown-custom-list-edit" @click.stop="editLabelHandle(tag, idx)">
                    <Icon type="md-create" class="dropdown-custom-list-edit-icon" />
                  </span>
                  <Icon type="md-checkmark" v-show='choosedLabelsStatus[tag.name]' class="dropdown-custom-list-choosed" />
                </DropdownItem>
              </div>
            </div>
            <create-label v-show='getCreateStatus'
              ref='createLabel'
              :createMode='createMode'
              :labelList='labelList'
              :editRow='editRow'
              :editRowIdx='editRowIdx'
              :quickAddMode='getQuickAddModeStatus'
              @backListHandle='backListHandle'
              @createNewHandle='createNewHandle'
              @quickCreateLabelHandle='quickCreateLabelHandle'
              @deleteLabel='deleteLabel'
              @closeHandle='closeHandle'></create-label>
          </DropdownMenu>
        </Dropdown>
      </li>
    </ul>
  </div>
</template>

<script>
  import CreateLabel from './create';
  const prefixCls = 'ivu-label-list';
//   const iconPrefixCls = 'ivu-icon';

  export default {
      name: '',
      components: {
          CreateLabel
      },
      model: {
          prop: 'labelModel',
          event: 'change'
      },
      props: {
          labelModel: {
              type: Array,
          },
          viewMode: {
              type: Boolean,
              default: false
          },
          labelList: {
              type: Array,
              default: () => []
          }
      },
      data() {
          return {
              visible: false,
              labelSearchModel: '', // 标签搜索
              showCreateMode: false, // 创建模式
              createMode: true,
              choosedLabelsStatus: {},
              editRow: null,
              editRowIdx: null
          };
      },
      computed: {
          wrapClasses () {
              return [
                  `${prefixCls}`
              ];
          },
          ulClasses () {
              return [
                  `${prefixCls}-ul`
              ];
          },
          liClasses () {
              return [
                  `${prefixCls}-li`,
                  this.viewMode ? '' : `${prefixCls}-li-removeable`
              ];
          },
          addClasses () {
              return [
                  `${prefixCls}-add`
              ];
          },
          getQuickAddModeStatus () {
              return (this.getMatchTagList.length === 0 && !!this.labelSearchModel) ||
          (!this.labelSearchModel && this.labelList.length === 0);
          },
          getMatchTagList () {
              return this.labelList.filter(item => item.name.indexOf(this.labelSearchModel) !== -1);
          },
          getCreateStatus () {
              return this.showCreateMode || (this.getMatchTagList.length === 0 && this.labelSearchModel)
          || (!this.labelSearchModel && this.labelList.length === 0);
          }
      },
      watch: {
          labelList (newVal) {
              this.$emit('onLabelListChange', newVal, this.labelModel);
          },
          labelModel (newVal, oldVal) {
              const oldKey = oldVal.map(item => item.name);
              const newKey = newVal.map(item => item.name);
              newVal.forEach(item => {
                  this.choosedLabelsStatus[item.name] = true;
              });
        // 旧项取消选中
              oldKey.forEach(labelName => {
                  if (newKey.indexOf(labelName) === -1) {
                      this.choosedLabelsStatus[labelName] = false;
                  }
              });
              this.$emit('onLabelSelectedChange', newVal);
          }
      },
      created () {
          if (this.labelModel && this.labelModel.length > 0) {
              this.labelModel.forEach(item => {
                  this.choosedLabelsStatus[item.name] = true;
              });
          }
      },
      methods: {
          showLabelListHandle () {
              this.labelSearchModel = '';
              this.showCreateMode = false;
              this.visible = true;
          },
          showCreateHandle () {
              if (this.getMatchTagList.length === 0 && !!this.labelSearchModel) {
        // 快捷创建模式
                  this.$refs.createLabel.quickCreateHandle();
              } else {
                  this.showCreateMode = true;
                  this.createMode = true;
              }
          },
          chooseTagHandle (tag) {
              const matched = this.labelModel.filter(item => item.name === tag.name);
              if (matched.length === 0) {
                  this.labelModel.push(tag);
                  this.choosedLabelsStatus[tag.name] = true;
              } else {
                  this.labelModel.forEach((item, index) => {
                      if (item.name === tag.name) {
                          this.labelModel.splice(index, 1);
                          this.choosedLabelsStatus[tag.name] = false;
                          return;
                      }
                  });
              }
          },
          deleteChoosedTagByIdx (tag, index) {
              if (typeof index !== 'number') {
                  return;
              }
              const deleteItem = this.labelModel.splice(index, 1);
              this.$emit('change', this.labelModel);
              this.$emit('onLabelDelete', deleteItem);
              this.choosedLabelsStatus[tag.name] = false;
          },
          clickOutSideHandle ($event) {
              const dropdownDom = this.$refs.customDropdown.$el;
              if (!dropdownDom.contains($event.target)) {
                  this.visible = false;
        // reset create form
              }
          },
          backListHandle () {
              this.labelSearchModel = '';
              this.showCreateMode = false;
              this.editRow = null;
              this.editRowIdx = null;
          },
          closeHandle () {
        // reset create form
              this.visible = false;
              this.editRow = null;
              this.editRowIdx = null;
          },
          createNewHandle (params) {
              const { newTag, editRowIdx } = params;
              if (typeof editRowIdx === 'number') {
        // 编辑模式
                  const oldTag = Object.assign({}, this.labelList[editRowIdx]);
                  this.labelModel.forEach((item, index) => {
                      if (item.name === oldTag.name) {
                          this.labelModel.splice(index, 1, newTag);
                      }
                  });
                  this.labelList.splice(editRowIdx, 1, newTag);
                  this.choosedLabelsStatus[newTag.name] = this.choosedLabelsStatus[oldTag.name];
                  if (newTag.name !== oldTag.name) {
                      delete this.choosedLabelsStatus[oldTag.name];
                  }
              } else {
                  this.labelList.push(newTag);
                  this.labelModel.push(newTag);
                  this.choosedLabelsStatus[newTag.name] = true;
              }
              this.backListHandle();
          },
          quickCreateLabelHandle (params) {
              const { color } = params;
              const name = this.labelSearchModel;
              if (!name || name.trim().length === 0) {
                  return;
              }
              const newTag = {
                  name,
                  color
              };
              this.labelList.push(newTag);
              this.labelModel.push(newTag);
              this.choosedLabelsStatus[newTag.name] = true;
              this.backListHandle();
          },
          editLabelHandle (tag, index) {
              this.editRow = tag;
              this.editRowIdx = index;
              this.createMode = false;
              this.showCreateMode = true;
          },
          deleteLabel () {
              this.labelModel.forEach((item, index) => {
                  if (item.name === this.editRow.name) {
                      this.labelModel.splice(index, 1);
                  }
              });
              this.labelList.splice(this.editRowIdx, 1);
              delete this.choosedLabelsStatus[this.editRow.name];
              this.backListHandle();
          }
      }
  };
</script>