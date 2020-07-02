<template>
    <v-container>
        <v-toolbar flat>
            <v-btn class="mr-5" @click="isNew = dialog = true" :color="$globals.color" :dark="$globals.dark">
                DODAJ
            </v-btn>
            <v-toolbar-title>
                Učionice
            </v-toolbar-title>
        </v-toolbar>
        <v-data-table :headers="headers"
                      :items="items"
                      :loading="loading"
                      :color="$globals.color">
            <template v-slot:item.projector="{ item }">
                <v-chip v-if="item.projector" color="success">
                    DA
                </v-chip>
                <v-chip v-else color="error">
                    NE
                </v-chip>
            </template>
            <template v-slot:item.computer="{ item }">
                <v-chip v-if="item.computer" color="success">
                    DA
                </v-chip>
                <v-chip v-else color="error">
                    NE
                </v-chip>
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
                    <v-btn text @click="onDelete(item)">
                        DA
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" width="400">
            <v-card>
                <v-card-title class="pt-0 pl-0 pr-0">
                    <v-toolbar :color="$globals.color" :dark="$globals.dark">
                        <v-toolbar-title v-if="isNew">
                            Dodaj učionicu
                        </v-toolbar-title>
                        <v-toolbar-title v-else>
                            Uredi učionicu
                        </v-toolbar-title>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field
                                v-model="item.name"
                                label="Ime"
                                :color="$globals.color"
                                :error-messages="nameErrors"
                                required
                                @input="$v.item.name.$touch()"
                                @blur="$v.item.name.$touch()"
                                outlined/>
                        <v-text-field
                                v-model="item.capacity"
                                label="Kapacitet"
                                :color="$globals.color"
                                :error-messages="capacityErrors"
                                required
                                @input="$v.item.capacity.$touch()"
                                @blur="$v.item.capacity.$touch()"
                                outlined/>
                        <v-switch
                                v-model="item.projector"
                                label="Projektor"
                                :color="$globals.color"/>
                        <v-switch
                                v-model="item.computer"
                                label="Računala"
                                :color="$globals.color"/>
                    </v-form>
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
    </v-container>
</template>
<script>
    import Layout from "../components/Layout";
    import {minValue, numeric, required} from "vuelidate/lib/validators";

    export default {
        name: "Classrooms",
        components: {Layout},
        data: function () {
            return {
                headers: [
                    {
                        text: "Ime",
                        value: "name"
                    },
                    {
                        text: "Kapacitet",
                        value: "capacity"
                    },
                    {
                        text: "Projektor",
                        value: "projector"
                    },
                    {
                        text: "Računala",
                        value: "computer"
                    },
                    {
                        value: "actions",
                        align: 'end'
                    }
                ],
                items: [],
                loading: false,
                dialog: false,
                deleteDialog: false,
                isNew: false,
                item: {
                    id: '',
                    name: '',
                    capacity: '',
                    projector: '',
                    computer: '',
                },
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
                this.$v.$touch()
                if (!this.$v.$invalid) {
                    this.loading = true;
                    if (this.isNew) {
                        this.item.group = this.$globals.group.group;
                        this.$http
                            .post('classrooms/add', this.item)
                            .then((response) => {
                                this.items.push(response.data)
                            })
                            .finally(() => {
                                this.dialog = false;
                                this.loading = false;
                            })
                    } else {
                        this.$http
                            .post('classrooms/update', this.item)
                            .then((response) => {
                                this.items.splice(this.items.findIndex(item => item.id == this.item.id), 1, response.data)
                            })
                            .finally(() => {
                                this.dialog = false;
                                this.loading = false;
                            })
                    }
                }
            },
            tryEdit: function (item) {
                this.isNew = false;
                this.item = Object.assign({}, item);
                this.dialog = true;
            },
            tryDelete: function (item) {
                this.isNew = false;
                this.item = Object.assign({}, item);
                this.dialog = true;
            },
            onDelete: function (item) {
                this.loading = true;
                this.$http
                    .post('classrooms/remove', item)
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
                .get("classrooms/all")
                .then((response) => {
                    this.items = response.data;
                    this.loading = false;
                })
        }
    };
</script>
<style>
</style>
