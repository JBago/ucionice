<template>
    <layout>
        <div class="container">
            <div class="box" style="padding: 1rem; margin-top: 100px; margin-bottom: 100px">
                <div v-bind:key="item.id" v-for="item in list">
                    {{item.name}}
                </div>
            </div>
        </div>
    </layout>
</template>
<script>
    import Layout from "../components/Layout";

    export default {
        name: "Classrooms",
        components: {Layout},
        data: function () {
            return {
                list: []
            }
        },
        mounted: function () {
            this
                .$axios
                .get("classrooms/all")
                .then((response) => {
                    this.list = response.data;
                })
        }
    };
</script>
<style>
</style>
