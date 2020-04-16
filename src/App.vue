<template>
    <div id="app">
        <router-view :groups="groups"/>
    </div>
</template>
<script>
    export default {
        components: {
            //Login
        },
        data: function () {
            return {
                loginVisible: 0,
                groups: []
            }
        },
        methods: {}

    }
</script>
<style>
</style>
