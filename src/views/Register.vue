<template>
    <v-app>
        <v-main style="background: url('https://picsum.photos/1920/1080')">
            <v-container class="fill-height">
                <v-row align="center" justify="center">
                    <v-col lg="4" md="5" sm="6" cols="10">
                        <v-card :loading="loading">
                            <v-card-title class="display-1">
                                Registracija
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
                                            label="Ime i prezime"
                                            v-model="name"
                                            :error-messages="nameErrors"
                                            required
                                            @input="$v.name.$touch()"
                                            @blur="$v.name.$touch()"
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
                                        <router-link :to="{name: 'login'}">
                                            Već imate račun?
                                        </router-link>
                                    </div>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn block color="primary" :disabled="loading" @click="onSubmit">
                                    REGISTRACIJA
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

    export default {
        name: 'Register',
        data() {
            return {
                loading: false,
                email: null,
                name: null,
                password: null,
                snackbar: false,
                snackbarText: ""
            }
        },
        validations: {
            email: {required, email},
            name: {required},
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
            nameErrors() {
                const errors = []
                if (!this.$v.name.$dirty) return errors
                !this.$v.name.required && errors.push('Ime je obavezan')
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
                        .post("auth/register", {
                            email: this.email,
                            name: this.name,
                            password: this.password
                        })
                        .then(() => {
                            this.$router.push({name: "login"})
                            this.loading = false;
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                this.snackbarText = "E-mail se već koristi"
                                this.snackbar = true;
                            } else {
                                this.snackbarText = "Greška prilikom registracije"
                                this.snackbar = true;
                            }
                            this.loading = false;
                        });
                }
            }
        }
    }
</script>
