<template>
    <div style="margin: 50px">
        <Divider>普通表格</Divider>
        <p>
            size 
            <Select v-model="size" size="small" style="width:100px">
                <Option value="small">Small</Option>
                <Option value="default">Default</Option>
                <Option value="large">Large</Option>
            </Select>

            border 
            <Select v-model="border" size="small" style="width:100px">
                <Option value="noBorder">No Border</Option>
                <Option value="default">Default</Option>
                <Option value="border">Border</Option>
            </Select>

            stripe 
            <i-switch v-model="stripe" size="small" />

            highlight-row 
            <i-switch v-model="highlightRow" size="small" />
        </p>
        <div style="margin: 5px 0 20px;">
            <!-- size="small" noBorder stripe highlight-row -->
            <Table
                :size="size"
                :noBorder="border === 'noBorder'"
                :border="border === 'border'"
                :stripe="stripe"
                :highlight-row="highlightRow"
                :columns="columns1"
                :data="data1"
            />
        </div>

        <Divider>Expand</Divider>
        <p>手风琴 accordion <i-switch v-model="accordion" size="small" /></p>
        <div style="margin: 5px 0 20px;">
            <Table ref="expandTable" size="small" noBorder stripe highlight-row :columns="accordion ? columns3 : columns2" :data="data1"></Table>
        </div>

        <Divider>Select</Divider>
        <p>
            <Button size="small" @click="handleSelectAll(true)">设置全选</Button>
            <Button size="small" @click="handleSelectAll(false)">取消全选</Button>
        </p>
        <div style="margin: 5px 0 20px;">
            <Table ref="selectTable" size="small" noBorder stripe highlight-row :columns="columns4" :data="data1"></Table>
        </div>
        <div style="margin: 5px 0 20px;">
            <Table ref="selectTable2" size="small" noBorder stripe highlight-row row-key="id" :columns="columns5" :data="data2"></Table>
        </div>

        <Divider>Column Drag</Divider>
        <p>type列(type存在，不为空) 不可拖动</p>
        <div style="margin: 5px 0 20px;">
            <Table
                size="small" noBorder stripe highlight-row draggable column-draggable
                :columns="columns2"
                :data="data1"
                @on-drag-drop="odd"
                @on-column-drag-drop="(i, j) => ocdd(i, j, columns2)"
            />
        </div>
        <p>fixed列、表头分组(子表头) 不可拖动</p>
        <div style="margin: 5px 0 20px;">
            <Table
                size="small" noBorder stripe highlight-row draggable column-draggable
                :columns="columns6"
                :data="data1"
                @on-drag-drop="odd"
                @on-column-drag-drop="(i, j) => ocdd(i, j, columns6)"
            />
        </div>
    </div>
</template>
<script>
    import expandRow from './table-expand.vue';
    export default {
        components: { expandRow },
        data () {
            return {
                columns: [
                    {
                        title: 'Date',
                        key: 'date',
                        width: 180,
                    },
                    {
                        title: 'Name',
                        key: 'name',
                        tree: true
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        key: 'address'
                    }
                ],
                columns1: [
                    {
                        title: 'Date',
                        key: 'date',
                        sortable: true,
                        resizable: true,
                        width: 180,
                    },
                    {
                        title: 'Name',
                        key: 'name',
                        resizable: true,
                        width: 180,
                    },
                    {
                        title: 'Age',
                        key: 'age',
                        sortable: true,
                        resizable: true,
                        width: 180,
                        filters: [
                            {
                                label: 'Greater than 25',
                                value: 1
                            },
                            {
                                label: 'Less than 25',
                                value: 2
                            }
                        ],
                        filterMultiple: true,
                        filterMethod (value, row) {
                            console.log('filterMethod', value, row)
                            if (value === 1) {
                                return row.age > 25;
                            } else if (value === 2) {
                                return row.age < 25;
                            }
                        },
                        // filteredValue: [1],
                        filterRemote: (values, key, column) => {
                            console.log(values, key, column)
                        }
                    },
                    {
                        title: 'Address',
                        key: 'address',
                        filters: [
                            {
                                label: 'New York',
                                value: 'New York'
                            },
                            {
                                label: 'London',
                                value: 'London'
                            },
                            {
                                label: 'Sydney',
                                value: 'Sydney'
                            }
                        ],
                        filterMethod (value, row) {
                            return row.address.indexOf(value) > -1;
                        }
                    }
                ],
                columns2: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: 'Date',
                        key: 'date',
                        width: 180,
                    },
                    {
                        title: 'Name',
                        key: 'name',
                        width: 180,
                    },
                    {
                        title: 'Age',
                        key: 'age',
                        width: 180,
                    },
                    {
                        title: 'Address',
                        key: 'address',
                    }
                ],
                columns3: [
                    {
                        type: 'expand',
                        accordion: true,
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: 'Date',
                        key: 'date',
                        width: 180,
                    },
                    {
                        title: 'Name',
                        key: 'name',
                        width: 180,
                    },
                    {
                        title: 'Age',
                        key: 'age',
                        width: 180,
                    },
                    {
                        title: 'Address',
                        key: 'address',
                    }
                ],
                columns4: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'Date',
                        key: 'date',
                        width: 180,
                    },
                    {
                        title: 'Name',
                        key: 'name',
                        width: 180,
                    },
                    {
                        title: 'Age',
                        key: 'age',
                        width: 180,
                    },
                    {
                        title: 'Address',
                        key: 'address',
                    }
                ],
                columns5: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'Name',
                        key: 'name',
                        tree: true
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        key: 'address'
                    }
                ],
                columns6: [
                    {
                        title: 'Name',
                        key: 'name',
                        align: 'center',
                        width: 200,
                        fixed: 'left',
                    },
                    {
                        title: 'Other',
                        align: 'center',
                        children: [
                            {
                                title: 'Age',
                                key: 'age',
                                align: 'center',
                                width: 200,
                            },
                            {
                                title: 'Address',
                                key: 'address',
                                align: 'center',
                                width: 200,
                            }
                        ]
                    },
                    {
                        title: 'Company',
                        align: 'center',
                        children: [
                            {
                                title: 'Company Address',
                                key: 'caddress',
                                align: 'center',
                                width: 200
                            },
                            {
                                title: 'Company Name',
                                key: 'cname',
                                align: 'center',
                                width: 200
                            }
                        ]
                    },
                    {
                        title: 'Gender',
                        key: 'gender',
                        align: 'center',
                        width: 200,
                        fixed: 'right'
                    }
                ],
                data1: [
                    {
                        name: 'John Brown 1',
                        age: 1,
                        address: 'Lake Park 1',
                        caddress: 'Lake Street 1',
                        cname: 'SoftLake Co 1',
                        gender: 'M 1',
                        date: '2016-10-01',
                    },
                    {
                        name: 'John Brown 2',
                        age: 2,
                        address: 'Lake Park 2',
                        caddress: 'Lake Street 2',
                        cname: 'SoftLake Co 2',
                        gender: 'M 2',
                        date: '2016-10-02',
                    },
                    {
                        name: 'John Brown 3',
                        age: 3,
                        address: 'Lake Park 3',
                        caddress: 'Lake Street 3',
                        cname: 'SoftLake Co 3',
                        gender: 'M 3',
                        date: '2016-10-03',
                    },
                    {
                        name: 'John Brown 4',
                        age: 4,
                        address: 'Lake Park 4',
                        caddress: 'Lake Street 4',
                        cname: 'SoftLake Co 4',
                        gender: 'M 4',
                        date: '2016-10-04',
                    },
                ],
                data2: [
                    {
                        id: '100',
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                    },
                    {
                        id: '101',
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        children: [
                            {
                                id: '10100',
                                name: 'John Brown',
                                age: 18,
                                address: 'New York No. 1 Lake Park'
                            },
                            {
                                id: '10101',
                                name: 'Joe Blackn',
                                age: 30,
                                address: 'Sydney No. 1 Lake Park'
                            },
                            {
                                id: '10102',
                                name: 'Jon Snow',
                                age: 26,
                                address: 'Ottawa No. 2 Lake Park',
                                children: [
                                    {
                                        id: '1010200',
                                        name: 'Jim Green',
                                        age: 24,
                                        address: 'New York No. 1 Lake Park'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: '102',
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                    },
                    {
                        id: '103',
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                    }
                ],
                size: 'small',
                border: 'noBorder',
                stripe: true,
                highlightRow: true,
                accordion: false,
            }
        },
        methods: {
            odd (index1, index2) {
                console.log('odd', index1, index2);
                this.data1.splice(index2, 0, this.data1.splice(index1, 1)[0]);
            },
            ocdd (index1, index2, columns) {
                console.log('ocdd', index1, index2);
                columns.splice(index2, 0, columns.splice(index1, 1)[0]);
            },
            handleSelectAll (status) {
                this.$refs.selectTable.selectAll(status);
                this.$refs.selectTable2.selectAll(status);
            }
        },
        mounted() {
            this.$refs.expandTable.toggleExpand(2);
            this.$refs.selectTable.toggleSelect(2);
            this.$refs.selectTable2.toggleSelect(2);
            this.$refs.selectTable2.toggleSelect(1, '10101');
        },
    }
</script>
