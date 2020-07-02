<template>
    <v-container>
        <v-toolbar flat>
            <v-btn v-if="$globals.group.role === 'USER'" class="mr-5" @click="isNew = dialog = true"
                   :color="$globals.color" :dark="$globals.dark">
                DODAJ
            </v-btn>
            <v-toolbar-title>
                Događaji
            </v-toolbar-title>
        </v-toolbar>
        <v-data-table :headers="headers"
                      :items="items"
                      :item-key="'id'"
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
                {{item.startDate | moment('DD.MM.YYYY')}} {{item.startDate | moment('HH:mm')}} - {{item.endDate |
                moment('HH:mm')}}
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn v-if="$globals.group.role !== 'USER' && !item.approved" icon @click="tryMove(item)">
                    <v-icon dense>
                        sync_alt
                    </v-icon>
                </v-btn>
                <v-btn v-if="$globals.group.role !== 'USER'" icon @click="tryApprove(item)">
                    <v-icon v-if="item.approved" dense>
                        close
                    </v-icon>
                    <v-icon v-else dense>
                        check
                    </v-icon>
                </v-btn>
            </template>
        </v-data-table>
        <v-dialog v-if="$globals.group.role !== 'USER' && !selected.approved" v-model="moveDialog" width="400">
            <v-card>
                <v-card-title class="pt-0 pl-0 pr-0">
                    <v-toolbar :color="$globals.color" :dark="$globals.dark">
                        <v-toolbar-title>
                            Pomjeri događaj
                        </v-toolbar-title>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form v-model="moveDialogValid" ref="moveform">
                        <v-menu>
                            <template v-slot:activator="{on}">
                                <v-text-field
                                        v-model="move.date"
                                        v-on="on"
                                        label="Datum"
                                        readonly
                                        prepend-inner-icon="event"
                                        required
                                        :rules="rules.date"
                                        outlined/>
                            </template>
                            <v-date-picker v-model="move.date"
                                           :min="new Date().toISOString()"
                                           width="350"
                                           :color="$globals.color"/>
                        </v-menu>
                        <v-row>
                            <v-col>
                                <v-menu ref="startmove"
                                        :close-on-content-click="false"
                                        :return-value.sync="move.start">
                                    <template v-slot:activator="{on}">
                                        <v-text-field
                                                v-model="move.start"
                                                v-on="on"
                                                label="Početak"
                                                readonly
                                                prepend-inner-icon="schedule"
                                                required
                                                :rules="rules.start"
                                                outlined/>
                                    </template>
                                    <v-time-picker v-model="move.start"
                                                   width="350"
                                                   format="24hr"
                                                   :color="$globals.color"
                                                   :max="move.end"
                                                   @click:minute="$refs.startmove.save(move.start)"/>
                                </v-menu>
                            </v-col>
                            <v-col>
                                <v-menu ref="endmove"
                                        :close-on-content-click="false"
                                        :return-value.sync="move.end">
                                    <template v-slot:activator="{on}">
                                        <v-text-field
                                                v-model="move.end"
                                                v-on="on"
                                                label="Kraj"
                                                readonly
                                                prepend-inner-icon="schedule"
                                                required
                                                :rules="rules.end"
                                                outlined/>
                                    </template>
                                    <v-time-picker v-model="move.end"
                                                   width="350"
                                                   format="24hr"
                                                   :color="$globals.color"
                                                   :min="move.start"
                                                   @click:minute="$refs.endmove.save(move.end)"/>
                                </v-menu>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn @click="moveDialog = false" text>
                        PONIŠTI
                    </v-btn>
                    <v-btn @click="onMove(selected)" text>
                        SPREMI
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-if="$globals.group.role !== 'USER'" v-model="approveDialog" width="400">
            <v-card>
                <v-card-title v-if="selected.approved" class="headline">
                    Jeste li sigurni da želite poništiti ovaj događaj?
                </v-card-title>
                <v-card-title v-else class="headline">
                    Jeste li sigurni da želite odobriti ovaj događaj?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="approveDialog = false">
                        NE
                    </v-btn>
                    <v-btn text @click="onApprove(selected)">
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
                            Dodaj događaj
                        </v-toolbar-title>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form v-model="dialogValid" ref="form">
                        <v-menu>
                            <template v-slot:activator="{on}">
                                <v-text-field
                                        v-model="selected.date"
                                        v-on="on"
                                        label="Datum"
                                        readonly
                                        prepend-inner-icon="event"
                                        required
                                        :rules="rules.date"
                                        outlined/>
                            </template>
                            <v-date-picker v-model="selected.date"
                                           :min="new Date().toISOString()"
                                           width="350"
                                           :color="$globals.color"/>
                        </v-menu>
                        <v-row>
                            <v-col>
                                <v-menu ref="start"
                                        :close-on-content-click="false"
                                        :return-value.sync="selected.start">
                                    <template v-slot:activator="{on}">
                                        <v-text-field
                                                v-model="selected.start"
                                                v-on="on"
                                                label="Početak"
                                                readonly
                                                prepend-inner-icon="schedule"
                                                required
                                                :rules="rules.start"
                                                outlined/>
                                    </template>
                                    <v-time-picker v-model="selected.start"
                                                   width="350"
                                                   format="24hr"
                                                   :color="$globals.color"
                                                   :max="selected.end"
                                                   @click:minute="$refs.start.save(selected.start)"/>
                                </v-menu>
                            </v-col>
                            <v-col>
                                <v-menu ref="end"
                                        :close-on-content-click="false"
                                        :return-value.sync="selected.end">
                                    <template v-slot:activator="{on}">
                                        <v-text-field
                                                v-model="selected.end"
                                                v-on="on"
                                                label="Kraj"
                                                readonly
                                                prepend-inner-icon="schedule"
                                                required
                                                :rules="rules.end"
                                                outlined/>
                                    </template>
                                    <v-time-picker v-model="selected.end"
                                                   width="350"
                                                   format="24hr"
                                                   :color="$globals.color"
                                                   :min="selected.start"
                                                   @click:minute="$refs.end.save(selected.end)"/>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-select
                                v-model="selected.classroom"
                                label="Učionica"
                                :items="classrooms"
                                item-text="name"
                                required
                                :rules="rules.classroom"
                                return-object
                                outlined/>
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

    export default {
        name: "Appointments",
        components: {Layout},
        data: function () {
            return {
                headers: [
                    {
                        text: "Status",
                        value: "approved"
                    },
                    {
                        text: "Vrijeme",
                        value: "time"
                    },
                    {
                        text: "Učionica",
                        value: "classroom.name"
                    },
                    {
                        text: "Korisnik",
                        value: "user.name"
                    },
                    {
                        value: "actions",
                        align: 'end'
                    }
                ],
                items: [],
                classrooms: [],
                loading: false,
                dialog: false,
                dialogValid: false,
                moveDialog: false,
                moveDialogValid: false,
                approveDialog: false,
                deleteDialog: false,
                isNew: false,
                selected: {
                    id: '',
                    date: '',
                    start: '',
                    end: '',
                    classroom: null
                },
                move: {
                    date: '',
                    start: '',
                    end: '',
                },
                rules: {
                    date: [
                        v => !!v || "Datum je obavezan"
                    ],
                    start: [
                        v => !!v || "Početak je obavezan"
                    ],
                    end: [
                        v => !!v || "Kraj je obavezan"
                    ],
                    classroom: [
                        v => !!v || "Učionica je obavezna"
                    ],
                },
            }
        },
        watch: {
            dialog: function (value) {
                if (!value) {
                    this.selected.date = '';
                    this.selected.start = '';
                    this.selected.end = '';
                    this.selected.classroom = null;
                    this.$refs.form.reset()
                }
            },
            moveDialog: function (value) {
                if (!value) {
                    this.move.date = '';
                    this.move.start = '';
                    this.move.end = '';
                    this.$refs.moveform.reset()
                }
            }
        },
        methods: {
            onSubmit: function () {
                this.$refs.form.validate()
                if (this.dialogValid) {
                    this.loading = true;
                    this.$http
                        .post('appointments/request', {
                            classroom: this.selected.classroom,
                            startDate: `${this.selected.date} ${this.selected.start}`,
                            endDate: `${this.selected.date} ${this.selected.end}`
                        })
                        .then((response) => {
                            this.items.push(response.data)
                        })
                        .finally(() => {
                            this.dialog = false;
                            this.loading = false;
                        })
                }
            },
            onMove: function (item) {
                this.$refs.moveform.validate()
                if (this.moveDialogValid) {
                    this.loading = true;
                    this.$http
                        .post('appointments/move', {
                            appointment: item,
                            startDate: `${this.move.date} ${this.move.start}`,
                            endDate: `${this.move.date} ${this.move.end}`
                        })
                        .then((response) => {
                            this.items.splice(this.items.findIndex(el => el.id == item.id), 1, response.data)
                        })
                        .finally(() => {
                            this.moveDialog = false;
                            this.loading = false;
                        })
                }
            },
            tryApprove: function (item) {
                this.selected = Object.assign({}, item);
                this.approveDialog = true;
            },
            tryMove: function (item) {
                this.move = {
                    date: item.startDate.substr(0, 10),
                    start: item.startDate.substr(11, 16),
                    end: item.endDate.substr(11, 16),
                }
                this.selected = Object.assign({}, item);
                this.moveDialog = true;
            },
            onApprove: function (item) {
                this.loading = true;
                if (item.approved) {
                    this.$http
                        .post('appointments/cancel', item)
                        .then((response) => {
                            this.items.splice(this.items.findIndex(el => el.id == item.id), 1, response.data)
                        })
                        .finally(() => {
                            this.loading = false;
                            this.approveDialog = false;
                        })
                } else {
                    this.$http
                        .post('appointments/approve', item)
                        .then((response) => {
                            this.items.splice(this.items.findIndex(el => el.id == item.id), 1, response.data)
                        })
                        .finally(() => {
                            this.loading = false;
                            this.approveDialog = false;
                        })
                }
            },
        },
        mounted: function () {
            this.loading = true;
            Promise
                .all([
                    this.$http.get("appointments/all"),
                    this.$http.get("classrooms/all"),
                ])
                .then((response) => {
                    this.items = response[0].data;
                    this.classrooms = response[1].data;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                })
        }
    };
</script>
<style>
</style>
