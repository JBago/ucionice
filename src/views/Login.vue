<template>
    <v-app>
        <v-main style="background: url('https://picsum.photos/1920/1080')">
            <v-container class="fill-height">
                <v-row align="center" justify="center">
                    <v-col lg="4" md="5" sm="6" cols="10">
                        <v-card :loading="loading">
                            <v-card-title class="display-1">
                                Prijava
                            </v-card-title>
                            <v-card-text>
                                <v-form :disabled="loading">
                                    <v-text-field
                                            label="E-mail"
                                            v-model="email"
                                            :error-messages="emailErrors"
                                            required
                                            @input="$v.email.$touch()"
                                            @blur="$v.email.$touch()"
                                            outlined/>
                                    <v-text-field
                                            label="Password"
                                            v-model="password"
                                            :error-messages="passwordErrors"
                                            type="password"
                                            required
                                            @input="$v.password.$touch()"
                                            @blur="$v.password.$touch()"
                                            @keypress.enter="onSubmit"
                                            outlined/>
                                    <div class="text-right">
                                        <router-link :to="{name: 'register'}">
                                            Nemate račun?
                                        </router-link>
                                    </div>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn block color="primary" :disabled="loading" @click="onSubmit">
                                    LOGIN
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <v-snackbar v-model="snackbar" right>
            {{snackbarText}}
        </v-snackbar>
    </v-app>
</template>
<script>
    import {email, minLength, required} from "vuelidate/lib/validators";
    import {setUser} from "../plugins/globals";

    export default {
        name: 'Login',
        data() {
            return {
                loading: false,
                email: null,
                password: null,
                snackbar: false,
                snackbarText: ""
            }
        },
        validations: {
            email: {required, email},
            password: {required, minLength: minLength(8)}
        },
        computed: {
            emailErrors() {
                const errors = []
                if (!this.$v.email.$dirty) return errors
                !this.$v.email.email && errors.push('Mora biti pravilan e-mail')
                !this.$v.email.required && errors.push('E-mail je obavezan')
                return errors
            },
            passwordErrors() {
                const errors = []
                if (!this.$v.password.$dirty) return errors
                !this.$v.password.minLength && errors.push('Mora biti minimalno 8 znakova')
                !this.$v.password.required && errors.push('Password je obavezan')
                return errors
            },
        },
        methods: {
            onSubmit: function () {
                this.$v.$touch()
                if (!this.$v.$invalid) {
                    this.loading = true;
                    this.$http
                        .post("auth/login", {
                            email: this.email,
                            password: this.password
                        })
                        .then((response) => {
                            localStorage.setItem("jwt", response.data.token);
                            setUser(response.data.user);
                            this.$router.push({name: "home"})
                            this.loading = false;
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                this.snackbarText = "Pogrešna šifra ili e-mail"
                                this.snackbar = true;
                            }
                            this.loading = false;
                        });
                }
            }
        }
    }
</script>
