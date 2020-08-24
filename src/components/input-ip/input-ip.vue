<template>
    <div :class="wrapClasses">
        <div :class="inputWrapClasses">
            <input
                :id="elementId"
                :class="inputClasses"
                :disabled="itemDisabled"
                autocomplete="off"
                spellcheck="false"
                :autofocus="autofocus"
                @focus="focus"
                @blur="blur"
                @keydown.stop="keyDown"
                @input="change"
                @mouseup="preventDefault"
                @change="change"
                :readonly="readonly || !editable"
                :name="name"
                :value="currentValue"
                ref='ipInput'
                :placeholder="placeholder">
        </div>
    </div>
</template>
<script>
    import { oneOf, findComponentUpward } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';
    import mixinsForm from '../../mixins/form';

    const prefixCls = 'ivu-input-ip';
    const iconPrefixCls = 'ivu-icon';

    export default {
        name: 'InputIp',
        mixins: [ Emitter, mixinsForm ],
        props: {
            max: {
                type: Number,
                default: 255
            },
            min: {
                type: Number,
                default: 0
            },
            activeChange: {
                type: Boolean,
                default: true
            },
            value: {
                type: Number,
                default: 1
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                },
                default () {
                    return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size;
                }
            },
            disabled: {
                type: Boolean,
                default: false
            },
            autofocus: {
                type: Boolean,
                default: false
            },
            readonly: {
                type: Boolean,
                default: false
            },
            editable: {
                type: Boolean,
                default: true
            },
            name: {
                type: String
            },
            elementId: {
                type: String
            },
            placeholder: {
                type: String,
                default: ''
            },
        },
        data () {
            return {
                focused: false,
                currentValue: this.value
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-${this.size}`]: !!this.size,
                        [`${prefixCls}-disabled`]: this.itemDisabled,
                        [`${prefixCls}-focused`]: this.focused
                    }
                ];
            },
            inputWrapClasses () {
                return `${prefixCls}-input-wrap`;
            },
            inputClasses () {
                return `${prefixCls}-input`;
            },
        },
        methods: {
            preventDefault (e) {
                e.preventDefault();
            },
            setValue (val) {
                // 如果 step 是小数，且没有设置 precision，是有问题的
                const {min, max} = this;
                if (val!==null) {
                    if (val > max) {
                        val = max;
                    } else if (val < min) {
                        val = min;
                    }
                }
                this.$nextTick(() => {
                    this.currentValue = val;
                    this.$emit('input', val);
                    this.$emit('on-change', val);
                    this.dispatch('FormItem', 'on-form-change', val);
                    if (`${val}`.length === 3) {
                        this.$emit('dotClick')
                    }
                });
            },
            focus (event) {
                this.focused = true;
                this.$emit('on-focus', event);
            },
            blur () {
                this.focused = false;
                this.$emit('on-blur');
                if (!findComponentUpward(this, ['DatePicker', 'TimePicker', 'Cascader', 'Search'])) {
                    this.dispatch('FormItem', 'on-form-blur', this.currentValue);
                }
            },
            keyDown (e) {
                if (e.keyCode === 190) {
                    e.preventDefault();
                    this.$emit('dotClick')
                } else if (e.keyCode === 8) {
                    if (!this.currentValue && typeof this.currentValue !== 'number') {
                        this.$emit('backPrevInput')
                    }
                }
            },
            change (event) {
                if (event.type == 'change' && this.activeChange) return;

                if (event.type == 'input' && !this.activeChange) return;
                let val = event.target.value.trim();
                if (this.parser) {
                    val = this.parser(val);
                }

                const isEmptyString = val.length === 0;
                if(isEmptyString){
                    this.setValue(null);
                    return;
                }
                if (event.type == 'input' && val.match(/^\-?\.?$|\.$/)) return; // prevent fire early if decimal. If no more input the change event will fire later

                val = Number(val);

                if (!isNaN(val)) {
                    this.currentValue = val;
                    this.setValue(val);
                } else {
                    event.target.value = this.currentValue;
                }
            },
            changeVal (val) {
                // val = Number(val);
            },
            setFocus () {
                this.$refs.ipInput.focus()
            }
        },
        mounted () {
            this.changeVal(this.currentValue);
        },
        watch: {
            value (val) {
                this.currentValue = val;
            },
            currentValue (val) {
                this.changeVal(val);
            },
            min () {
                this.changeVal(this.currentValue);
            },
            max () {
                this.changeVal(this.currentValue);
            }
        }
    };
</script>
