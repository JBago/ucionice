<template>
    <v-container class="fill-height flex-column justify-start align-stretch">
        <v-card class="d-flex flex-column grow" :loading="loading">
            <v-card-title class="shrink">
                <v-btn icon @click="$refs.calendar.prev()">
                    <v-icon>chevron_left</v-icon>
                </v-btn>
                <v-spacer/>
                <v-btn icon @click="$refs.calendar.next()">
                    <v-icon>chevron_right</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="grow" :style="{height: '300px'}">
                <v-calendar ref="calendar" v-model="model" type="week" :events="appointments"
                            :event-color="$globals.color"
                            event-category="classroom.id" :event-name="eventName"
                            event-start="startDate" event-end="endDate" :color="$globals.color"/>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
    export default {
        name: 'Home',
        components: {},
        data() {
            return {
                model: null,
                loading: false,
                appointments: [],
            }
        },
        methods: {
            eventName: function (event) {
                return event.input.classroom.name
            }
        },
        watch: {
            "$globals.group": function () {
                this.loading = true;
                Promise
                    .all([
                        this.$http.get("appointments/ongoing"),
                        this.$http.get("classrooms/all"),
                    ])
                    .then((response) => {
                        this.appointments = response[0].data;
                        this.classrooms = response[1].data;
                        this.loading = false;
                    })
                    .catch(() => {
                        this.loading = false;
                    })
            }
        },
        mounted() {
            this.loading = true;
            Promise
                .all([
                    this.$http.get("appointments/ongoing"),
                    this.$http.get("classrooms/all"),
                ])
                .then((response) => {
                    this.appointments = response[0].data;
                    this.classrooms = response[1].data;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                })
        }
    }
</script>
