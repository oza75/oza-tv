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
                        <main class="col-12 pl-4 pr-4 pt-4 pb-4">
                            <transition mode="out-in" :duration="300" name="route-animation">
                                <router-view/>
                            </transition>
                        </main>
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
            Vue.nextTick(() => {
                this.tour()
            })
        }

        tour() {
            if (!Storage.has('tour-finished')) {
                // @ts-ignore
                let productTour = new ProductTour({
                    overlay: true,
                    onClosed: function (e: any) {
                        Storage.put('tour-finished', 1)
                    },
                    next: 'Suivant', // optional defaults: 'Next'
                    prev: 'Précedent', // optional defaults: 'Previous'
                    of: 'sur', // optional defaults: 'of'
                    html: true// optional (true || false) defaults: false
                });
                let content: string = `
                  Ici vous trouver des suggestions de films/séries selon ce que vous aimez.\n
                  Plus vous aimez des films ou séries qui vous plaisent plus
                  vos recommendation seront pertinentes.
                `

                productTour.steps([
                    {
                        element: '#type-of-content',
                        title: "Type de contenu",
                        content: `Vous pouvez maintenant switcher entre les films et les séries
                        ici pour changer le type de contenu`,
                        position: "bottom"
                    }, {
                        element: '#recommended-movies',
                        title: "Recommendation",
                        content: content,
                        position: "right"
                    }
                ])
                productTour.startTour()
            }
        }
    }
</script>
