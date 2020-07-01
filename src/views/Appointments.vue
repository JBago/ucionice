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
                <v-dialog v-if="$globals.group.role !== 'USER'" v-model="moveDialog" width="400">
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-icon dense>
                                sync_alt
                            </v-icon>
                        </v-btn>
                    </template>
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
                            <v-btn @click="onMove(item)" text>
                                SPREMI
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-if="$globals.group.role !== 'USER' && !item.approved" v-model="approveDialog" width="400">
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-icon dense>
                                check
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="headline">
                            Jeste li sigurni da želite odobriti ovaj događaj?
                        </v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text @click="approveDialog = false">
                                NE
                            </v-btn>
                            <v-btn text @click="onApprove(item)">
                                DA
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-if="$globals.group.role !== 'USER' && item.approved" v-model="approveDialog" width="400">
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-icon dense>
                                close
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="headline">
                            Jeste li sigurni da želite poništiti ovaj događaj?
                        </v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text @click="approveDialog = false">
                                NE
                            </v-btn>
                            <v-btn text @click="onCancel(item)">
                                DA
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </template>
        </v-data-table>
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
                                        v-model="item.date"
                                        v-on="on"
                                        label="Datum"
                                        readonly
                                        prepend-inner-icon="event"
                                        required
                                        :rules="rules.date"
                                        outlined/>
                            </template>
                            <v-date-picker v-model="item.date"
                                           :min="new Date().toISOString()"
                                           width="350"
                                           :color="$globals.color"/>
                        </v-menu>
                        <v-row>
                            <v-col>
                                <v-menu ref="start"
                                        :close-on-content-click="false"
                                        :return-value.sync="item.start">
                                    <template v-slot:activator="{on}">
                                        <v-text-field
                                                v-model="item.start"
                                                v-on="on"
                                                label="Početak"
                                                readonly
                                                prepend-inner-icon="schedule"
                                                required
                                                :rules="rules.start"
                                                outlined/>
                                    </template>
                                    <v-time-picker v-model="item.start"
                                                   width="350"
                                                   format="24hr"
                                                   :color="$globals.color"
                                                   :max="item.end"
                                                   @click:minute="$refs.start.save(item.start)"/>
                                </v-menu>
                            </v-col>
                            <v-col>
                                <v-menu ref="end"
                                        :close-on-content-click="false"
                                        :return-value.sync="item.end">
                                    <template v-slot:activator="{on}">
                                        <v-text-field
                                                v-model="item.end"
                                                v-on="on"
                                                label="Kraj"
                                                readonly
                                                prepend-inner-icon="schedule"
                                                required
                                                :rules="rules.end"
                                                outlined/>
                                    </template>
                                    <v-time-picker v-model="item.end"
                                                   width="350"
                                                   format="24hr"
                                                   :color="$globals.color"
                                                   :min="item.start"
                                                   @click:minute="$refs.end.save(item.end)"/>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-select
                                v-model="item.classroom"
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
        <v-snackbar v-model="error">
            {{error}}
        </v-snackbar>
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
                item: {
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
                error: null
            }
        },
        watch: {
            dialog: function (value) {
                if (!value) {
                    this.item.date = '';
                    this.item.start = '';
                    this.item.end = '';
                    this.item.classroom = null;
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
                            classroom: this.item.classroom,
                            startDate: `${this.item.date} ${this.item.start}`,
                            endDate: `${this.item.date} ${this.item.end}`
                        })
                        .then((response) => {
                            this.items.push(response.data)
                            this.dialog = false;
                            this.loading = false;
                        })
                        .catch(() => {
                            this.error = "Greška prilikom spremanja";
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
                            this.moveDialog = false;
                            this.loading = false;
                        })
                        .catch(() => {
                            this.error = "Greška prilikom spremanja";
                            this.loading = false;
                        })
                }
            },
            onApprove: function (item) {
                this.$http
                    .post('appointments/approve', item)
                    .then((response) => {
                        this.items.splice(this.items.findIndex(el => el.id == item.id), 1, response.data)
                        this.approveDialog = false;
                    })
                    .catch(() => {
                        this.error = "Greška prilikom spremanja";
                    })
            },
            onCancel: function (item) {
                this.$http
                    .post('appointments/cancel', item)
                    .then((response) => {
                        this.items.splice(this.items.findIndex(el => el.id == item.id), 1, response.data)
                        this.approveDialog = false;
                    })
                    .catch(() => {
                        this.error = "Greška prilikom spremanja";
                    })
            }
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
