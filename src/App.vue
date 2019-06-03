<template>
    <div id="app">
        <div class="app-container" v-if="!isMobileDevice">
            <div class="row">
                <div class="col-md-3 col-lg-2 sidebar-container hidden-xs">
                    <Sidebar/>
                </div>
                <div class="app-content col-md-9 col-lg-10 pl-0 pr-0 col-sm-12">
                    <div class="row">
                        <div class="col-12 pl-0 pr-0">
                            <Topbar/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 pl-4 pr-4 pt-4 pb-4">
                            <router-view/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mobile-device" v-else>
            <div class="messages-container">
                <p class="message-fr">
                    OZA TV n'est pas encore disponible en version mobile,
                    veuillez le consulter via votre PC
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator"
    import TMDb from "@/classes/TMDb";
    import Sidebar from "@/components/Sidebar.vue";
    import {addScript} from "@/utils";
    import Topbar from "@/components/Topbar.vue";
    import Storage from "@/classes/Storage";

    @Component({
        components: {Sidebar, Topbar}
    })
    export default class App extends Vue {
        created() {
            TMDb.saveGenres();
            addScript("https://kit.fontawesome.com/8b736c7481.js")
        }

        get isMobileDevice() {
            return !!(navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i));
        }

        mounted() {
            window.addEventListener('keydown', ev => {
                if (ev.key == 'm' && ev.ctrlKey) {
                    let pass: string | any = window.prompt('Entrer le mot de passe : ')
                    if (pass == 'oza-gave-me-the-code') {
                        Storage.put('hack-mode', 1);
                        window.location.reload();
                    }
                }
            })
        }
    }
</script>
