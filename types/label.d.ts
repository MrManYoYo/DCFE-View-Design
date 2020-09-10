import Vue, { VNode } from 'vue';

type LabelItem = {
  name: string;
  color: string;
}

export declare class Label extends Vue {
  /**
   * 绑定的值，可使用 v-model 双向绑定
   * @default 空
   */
  value?: LabelItem[];
  /**
   * 标签选项列表
   * @default 空
   */
  labelList: LabelItem[];
  /**
   * 预览模式，不可创建/删除
   * @default false
   */
  viewMode?: boolean;
  /**
   * 当标签选项列表发生变化
   */
  $emit(eventName: 'onListChange', labelList: LabelItem[], selected: LabelItem[]): this;
  /**
   * 当标签已选列表发生变化
   */
  $emit(eventName: 'onSelectedChange', selected: LabelItem[]): this;
  /**
   * 当标签删除时
   */
  $emit(eventName: 'onLabelDelete', deleteItem: LabelItem): this;
}
