<template>
    <div>
        <div class="navbar is-fixed-top"></div>
        <div id="nav" class="navbar container is-fixed-top">
            <div id="navbarBasicExample" class="navbar-menu navbar-menu-custom ">
                <div class="navbar-start">
                    <router-link to="/" class="navbar-item nav-item-custom">
                        <span class="is-family-primary">Naslovnica</span>
                    </router-link>
                    <router-link to="/create" class="navbar-item nav-item-custom">
                        <span class="is-family-primary">Pozivnice</span>
                    </router-link>
                    <router-link to="/properties" class="navbar-item nav-item-custom">
                        <span class="is-family-primary">Moje učionice</span>
                    </router-link>
                    <router-link to="/browse" class="navbar-item nav-item-custom">
                        <span class="is-family-primary">Učionice</span>
                    </router-link>
                </div>
                <div class="navbar-end">
                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">
                            {{$currentUser.name}}
                        </a>
                        <div class="navbar-dropdown">
                            <a v-for="group in groups" :key="group.id" @click="setGroup(group.id)" class="navbar-item">
                                {{group.name}}
                            </a>
                            <hr v-if="groups && groups.length > 0" class="navbar-divider">
                            <a class="navbar-item">
                                Nova grupa
                            </a>
                            <a class="navbar-item" @click="logout">
                                Odjavi se
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <slot/>
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    Julijan Bago
                </p>
            </div>
        </footer>
    </div>
</template>
<script>
    export default {
        name: "Layout",
        props: {
            groups: Array
        },
        methods: {
            logout: function () {
                localStorage.removeItem("user");
                localStorage.removeItem("jwt");
                this.$router.push({name: "login"})
            },
            setGroup: function (id) {
                localStorage.setItem("group", id);
            }
        },
        mounted: function () {
            this
                .$axios
                .get("groups/all")
                .then((response) => {
                    this.groups = response.data
                })
        }
    }
</script>
<style scoped>
</style>
