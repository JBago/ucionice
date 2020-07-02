<template>
    <v-app v-if="loaded">
        <v-app-bar app fixed dark :color="$globals.color" :dark="$globals.dark">
            <v-app-bar-nav-icon v-if="$globals.group" @click.stop="drawer = !drawer">
                <v-icon>menu</v-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title>
                <v-icon left>school</v-icon>
                Učionice
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu v-if="$globals.user" offset-y nudge-width="280">
                <template v-slot:activator="{on , attrs}">
                    <v-badge class="mr-5"
                             :value="invitations.length"
                             :content="invitations.length"
                             bordered
                             overlap>
                        <v-btn
                                rounded
                                icon
                                v-bind="attrs"
                                v-on="on">
                            <v-icon>notifications</v-icon>
                        </v-btn>
                    </v-badge>
                </template>
                <v-list v-if="invitations.length">
                    <v-list-item
                            v-for="(invitation, index) in invitations"
                            :key="index">
                        <v-list-item-title>{{invitation.group.name}}</v-list-item-title>
                        <v-list-item-action>
                            <v-btn icon @click="onAcceptInvitation(invitation)">
                                <v-icon>check</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
                <v-sheet v-else class="pa-5">
                    Nemate pozivnica
                </v-sheet>
            </v-menu>
            <v-menu v-if="$globals.user" offset-y>
                <template v-slot:activator="{on , attrs}">
                    <v-btn rounded
                           outlined
                           v-bind="attrs"
                           v-on="on">
                        {{$globals.user.name}}
                        <v-icon right>expand_more</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                            v-for="(group, index) in groups"
                            :key="index"
                            @click="onSelectGroup(group)">
                        <v-list-item-title>{{group.group.name}}</v-list-item-title>
                    </v-list-item>
                    <v-divider v-if="groups.length"/>
                    <v-list-item @click="addGroup = true">
                        <v-list-item-icon>
                            <v-icon dense>add</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Dodaj grupu
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="$globals.group && $globals.group.role != 'OWNER'" @click="leaveGroup = true">
                        <v-list-item-icon>
                            <v-icon dense>exit_to_app</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Napusti grupu
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="onLogout">
                        <v-list-item-icon>
                            <v-icon dense>lock</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Odjavi se
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>
        <v-navigation-drawer v-if="$globals.group" v-model="drawer" app temporary>
            <v-list nav>
                <v-list-item-group :color="$globals.color">
                    <v-list-item @click="$router.push({name: 'home'})">
                        <v-list-item-icon>
                            <v-icon>dashboard</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Početna
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="$globals.group.role == 'OWNER'"
                                 @click="$router.push({name: 'classrooms'})">
                        <v-list-item-icon>
                            <v-icon>meeting_room</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Učionice
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="$router.push({name: 'appointments'})">
                        <v-list-item-icon>
                            <v-icon>event</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Događaji
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="$globals.group.role == 'OWNER'"
                                 @click="$router.push({name: 'users'})">
                        <v-list-item-icon>
                            <v-icon>people</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Korisnici
                        </v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <v-container class="fill-height justify-start align-stretch" fluid>
                <router-view v-if="groups.length > 0 && $globals.group"/>
                <v-card v-if="groups.length > 0 && !$globals.group" class="ma-auto" max-width="500">
                    <v-card-title class="title">
                        Odaberi grupu
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item
                                    v-for="(group, index) in groups"
                                    :key="index"
                                    @click="onSelectGroup(group)">
                                <v-list-item-title>{{group.group.name}}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
                <v-card v-if="groups.length === 0" class="ma-auto" max-width="500">
                    <v-card-text class="title">
                        Niste član niti jedne grupe, dodajte novu ili privhatite pozivnicu
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="addGroup = true" text color="primary">
                            DODAJ
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-container>
        </v-main>
        <v-dialog v-model="addGroup" width="400">
            <v-card>
                <v-card-title class="pt-0 pl-0 pr-0">
                    <v-toolbar :color="$globals.color" :dark="$globals.dark">
                        <v-toolbar-title>
                            Nova Grupa
                        </v-toolbar-title>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form :disabled="groupForm.loading" ref="form">
                        <v-text-field
                                v-model="groupForm.name"
                                label="Ime"
                                required
                                :rules="[v => !!v || 'Ime je obavezno']"
                                outlined/>
                        <v-menu ref="color"
                                :close-on-content-click="false"
                                :return-value.sync="groupForm.color"
                                offset-y>
                            <template v-slot:activator="{on}">
                                <v-text-field
                                        v-model="groupForm.color"
                                        v-on="on"
                                        label="Boja"
                                        readonly
                                        required
                                        prepend-inner-icon="palette"
                                        :rules="[v => !!v || 'Boja je obavezna']"
                                        outlined>
                                    <template v-slot:prepend-inner>
                                        <v-card text outlined
                                                :style="{
                                                'background-color': groupForm.color,
                                                'height': '1.5em',
                                                'width': '1.5em',
                                                'border-radius': '50%'
                                        }">
                                        </v-card>
                                    </template>
                                </v-text-field>
                            </template>
                            <v-sheet>
                                <v-color-picker
                                        width="350"
                                        v-model="groupForm.color"/>
                                <v-btn :color="$globals.color" :dark="$globals.dark" @click="$refs.color.save(groupForm.color)" block>
                                    Odaberi
                                </v-btn>
                            </v-sheet>
                        </v-menu>
                        <v-card outlined>
                        </v-card>
                    </v-form>
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn @click="addGroup = false" text>
                        PONIšTI
                    </v-btn>
                    <v-btn @click="onAddGroup" text>
                        SPREMI
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="leaveGroup" width="400">
            <v-card>
                <v-card-title class="title">
                    Jeste li sigurni da želite napustiti ovu grupu?
                </v-card-title>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn @click="leaveGroup = false" text>
                        NE
                    </v-btn>
                    <v-btn @click="onLeave" text>
                        DA
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="$globals.snackbar.visible" bottom right>
            {{$globals.snackbar.text}}
        </v-snackbar>
    </v-app>
</template>
<style lang="scss" scoped>
    .v-app {
        opacity: 0;
        transition: opacity ease-in-out 200ms;

        &.loaded {
            opacity: 1;
        }
    }
</style>
<script>
    import {setGroup, setUser} from "../plugins/globals";

    export default {
        name: "Layout",
        data: function () {
            return {
                loaded: false,
                drawer: false,
                pickGroup: false,
                addGroup: false,
                leaveGroup: false,
                groups: [],
                invitations: [],
                groupForm: {
                    loading: false,
                    name: "",
                    color: "#ffffffff"
                }
            };
        },
        methods: {
            onLogout: function () {
                localStorage.removeItem("jwt");
                localStorage.removeItem("group");
                setGroup(null)
                setUser(null)
                this.$router.push({name: 'login'});
            },
            onLeave: function () {
                this.$http
                    .post("groups/leave", this.$globals.group)
                    .then(() => {
                        localStorage.removeItem("group");
                        this.groups.splice(this.groups.findIndex(item => item.id == this.$globals.group.id), 1)
                        this.$router.push({name: 'home'});
                    })
                    .catch(() => {

                    })
            },
            onAddGroup: function () {
                if (this.$refs.form.validate()) {
                    this.$http
                        .post("groups/create", {
                            name: this.groupForm.name,
                            color: this.groupForm.color
                        })
                        .then((response) => {
                            this.groups.push(response.data);
                            this.addGroup = false;
                        })
                        .catch(() => {

                        })
                }
            },
            onAcceptInvitation: function (invitation) {
                this.$http.post("groups/accept", invitation)
                    .then(() => {
                        window.location.reload()
                    })
                    .catch(() => {
                        window.location.reload()
                    })
            },
            onSelectGroup: function (group) {
                localStorage.setItem("group", group.group.id);
                setGroup(group)
                this.pickGroup = false;
                this.$router.push({name: 'home'});
            },
        },
        watch: {
            addGroup: function (value) {
                if (!value) {
                    this.groupForm.name = "";
                    this.groupForm.color = "#ffffffff";
                    this.groupForm.loading = false;
                }
            }
        },
        mounted() {
            Promise
                .all(
                    [
                        this.$http.post("auth/validate"),
                        this.$http.get("groups/all"),
                        this.$http.get("groups/invitations")
                    ]
                )
                .then((response) => {
                    setUser(response[0].data);
                    this.groups = response[1].data;
                    this.invitations = response[2].data;
                    let groupId = localStorage.getItem("group");
                    if (groupId) {
                        let group = this.groups.find(item => item.group.id == groupId);
                        if (group) {
                            setGroup(group);
                        } else {
                            this.pickGroup = true;
                        }
                    } else {
                        this.pickGroup = true;
                    }
                    this.loaded = true;
                })
                .catch(() => {
                    this.$router.push({name: 'login'});
                })
        }
    }
</script>
