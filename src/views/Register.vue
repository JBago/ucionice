<template>
    <div class="section">
        <div id="card-container1" class="container">
            <div class="notification is-danger" v-if="error && !success">
                <p>There was an error, unable to complete registration.</p>
            </div>
            <div class="notification is-success" v-if="success">
                <p>Registration completed. You can now
                    <router-link :to="{name:'login'}">sign in.</router-link>
                </p>
            </div>
            <div class="card" v-if="!success">
                <div class="card-header">
                    <p class="card-header-title">
                        Registracija
                    </p>
                </div>
                <div class="card-content" style="padding-bottom: 2.5rem;">
                    <form id="register_form" autocomplete="off" @submit.prevent="register" method="post">
                        <div class="field">
                            <label for="name">Ime</label>
                            <div class="control">
                                <input type="text" id="name" class="input" v-model="name" required>
                            </div>
                        </div>
                        <div class="field">
                            <label for="email">E-mail</label>
                            <div class="control">
                                <input type="email" id="email" class="input" placeholder="user@example.com"
                                       v-model="email" required>
                            </div>
                        </div>
                        <div class="field">
                            <label for="password">Lozinka</label>
                            <div class="control">
                                <input type="password" id="password" class="input" v-model="password" required>
                            </div>
                        </div>
                        <button id="send" hidden type="submit"></button>
                    </form>
                </div>
                <footer class="card-footer">
                    <button @click="onSubmit" class="button is-info card-footer-item"
                            style="height: auto; border-radius: 0; padding: 0.6rem">
                        <span class="has-text-weight-medium" style="font-size: 1.15rem">Potvrdi</span>
                    </button>
                </footer>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: '',
                email: '',
                password: '',
                has_error: false,
                error: '',
                errors: {},
                success: false
            }
        },
        computed: {},
        methods: {
            onSubmit: function () {
                this.$axios
                    .post("auth/register", {
                        email: this.email,
                        name: this.name,
                        password: this.password
                    })
                    .then((response) => {
                        localStorage.setItem("jwt", response.data.token)
                    });
            }
        }
    }
</script>
<style>
    #card-container1 {
        margin-top: 3rem;
        max-width: 400px;
    }
</style>
