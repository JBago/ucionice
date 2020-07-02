<template>
    <v-container>
        <v-toolbar flat>
            <v-btn v-if="$globals.group.role === 'OWNER' || $globals.group.role === 'MANAGER'" class="mr-5"
                   @click="isNew = dialog = true"
                   :color="$globals.color" :dark="$globals.dark">
                DODAJ
            </v-btn>
            <v-toolbar-title>
                Korisnici
            </v-toolbar-title>
        </v-toolbar>
        <v-data-table :headers="headers"
                      :items="items"
                      :loading="loading"
                      :color="$globals.color">
            <template v-slot:item.approved="{ item }">
                <v-chip v-if="item.approved" color="success">
                    ODOBRENO
                </v-chip>
                <v-chip v-else color="error">
                    NIJE ODOBRENO
                </v-chip>
            </template>
            <template v-slot:item.time="{ item }">
                {{item.startDate | moment('dd.MM.YYYY HH:mm')}} - {{item.endDate | moment('dd.MM.YYYY HH:mm')}}
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn icon @click="tryEdit(item)">
                    <v-icon dense>
                        edit
                    </v-icon>
                </v-btn>
                <v-btn icon @click="tryDelete(item)">
                    <v-icon dense>
                        delete
                    </v-icon>
                </v-btn>
            </template>
        </v-data-table>
        <v-dialog v-model="deleteDialog" width="500">
            <v-card>
                <v-card-title class="headline">
                    Jeste li sigurni da želite izbrisati?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="deleteDialog = false">
                        NE
                    </v-btn>
                    <v-btn text @click="onDelete">
                        DA
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" width="400">
            <v-card>
                <v-card-title class="pt-0 pl-0 pr-0">
                    <v-toolbar :color="$globals.color" :dark="$globals.dark">
                        <v-toolbar-title>
                            Pozovi korisnika
                        </v-toolbar-title>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-autocomplete
                            v-model="search.selected"
                            label="Korisnik"
                            :search-input.sync="search.query"
                            placeholder="Pronađi korisnika"
                            :loading="search.loading"
                            item-text="name"
                            :items="search.items"
                            :color="$globals.color"
                            return-object
                            required
                            outlined/>
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn @click="dialog = false" text>
                        PONIŠTI
                    </v-btn>
                    <v-btn @click="onSubmit" text>
                        SPREMI
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="roleDialog" width="400">
            <v-card>
                <v-card-title class="pt-0 pl-0 pr-0">
                    <v-toolbar :color="$globals.color" :dark="$globals.dark">
                        <v-toolbar-title>
                            Uredi korisnika
                        </v-toolbar-title>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-select
                            v-model="role"
                            label="Rola"
                            :items="roles"
                            :color="$globals.color"
                            return-object
                            required
                            outlined/>
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn @click="roleDialog = false" text>
                        PONIŠTI
                    </v-btn>
                    <v-btn @click="onSubmitRole" text>
                        SPREMI
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    import Layout from "../components/Layout";
    import {minValue, numeric, required} from "vuelidate/lib/validators";

    export default {
        name: "Appointments",
        components: {Layout},
        data: function () {
            return {
                headers: [
                    {
                        text: "Rola",
                        value: "role"
                    },
                    {
                        text: "Ime",
                        value: "user.name"
                    },
                    {
                        value: "actions",
                        align: 'end'
                    }
                ],
                items: [],
                loading: false,
                search: {
                    loading: false,
                    query: null,
                    selected: null,
                    items: []
                },
                role: null,
                dialog: false,
                deleteDialog: false,
                roleDialog: false,
                item: {
                    id: '',
                    name: '',
                    capacity: '',
                    projector: '',
                    computer: '',
                },
                roles: ["USER", "MANAGER"],
            }
        },
        validations: {
            item: {
                name: {required},
                capacity: {required, numeric, minValue: minValue(2)},
            }
        },
        watch: {
            dialog: function (value) {
                if (!value) {
                    this.item.name = '';
                    this.item.capacity = '';
                    this.item.projector = '';
                    this.item.computer = '';
                    this.$v.$reset();
                }
            },
            'search.query': function (value) {
                if (this.search.loading) {
                    return
                }
                this.search.loading = true;
                this.$http
                    .post('users/find', value)
                    .then((response) => {
                        this.search.items = response.data;
                        this.search.loading = false;
                    })
                    .finally(() => {
                        this.search.loading = false;
                    })
            }
        },
        computed: {
            nameErrors() {
                const errors = []
                if (!this.$v.item.name.$dirty) return errors
                !this.$v.item.name.required && errors.push('Ime je obavezno')
                return errors
            },
            capacityErrors() {
                const errors = []
                if (!this.$v.item.capacity.$dirty) return errors
                !this.$v.item.capacity.numeric && errors.push('Mora biti broj')
                !this.$v.item.capacity.minValue && errors.push('Broj mora biti veći od 1')
                !this.$v.item.capacity.required && errors.push('Kapacitet je obavezan')
                return errors
            },
        },
        methods: {
            onSubmit: function () {
                if (this.search.selected) {
                    this.loading = true;
                    this.$http
                        .post('groups/invite', this.search.selected)
                        .finally(() => {
                            this.dialog = false;
                            this.loading = false;
                        })
                }
            },
            onSubmitRole: function () {
                if (this.role) {
                    this.loading = true;
                    this.$http
                        .post('groups/users/role', {
                            role: this.role,
                            user: this.item.user
                        })
                        .then((response) => {
                            this.items.splice(this.items.findIndex(el => el.id == this.item.id), 1, response.data)
                        })
                        .finally(() => {
                            this.roleDialog = false;
                            this.loading = false;
                        })
                }
            },
            tryEdit: function (item) {
                this.isNew = false;
                this.item = Object.assign({}, item);
                this.role = this.item.role;
                this.roleDialog = true;
            },
            tryDelete: function (item) {
                this.item = Object.assign({}, item);
                this.deleteDialog = true;
            },
            onDelete: function () {
                this.loading = true;
                this.$http
                    .post('groups/users/remove', this.item.user)
                    .then(() => {
                        this.items.splice(this.items.findIndex(item => item.id == this.item.id), 1)
                    })
                    .finally(() => {
                        this.deleteDialog = false;
                        this.loading = false;
                    })
            }
        },
        mounted: function () {
            this.loading = true;
            this
                .$http
                .get("groups/users")
                .then((response) => {
                    this.items = response.data;
                    this.loading = false;
                })
        }
    };
</script>
<style>
</style>
