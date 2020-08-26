<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">Date: </span>
                <span class="expand-value">{{ row.date }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">Name: </span>
                <span class="expand-value">{{ row.name }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">Age: </span>
                <span class="expand-value">{{ row.age }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <span class="expand-key">Address: </span>
                <span class="expand-value">{{ row.address }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>