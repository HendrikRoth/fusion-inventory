<template>
  <div id="app">
    <link rel="stylesheet"
    href="https://cdn.materialdesignicons.com/3.5.95/css/materialdesignicons.min.css"
    />
    <router-view />


    <footer v-if="!loading" class="is-size-7 fusion-footer">
        <div class="content has-text-centered">
            <p>
                <strong>Fusion Inventory</strong> by <a target="_blank"
                    href="https://hendrikroth.com">Hendrik Roth</a>. The source code is licensed
      <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
      is licensed <a target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.

                    <a href="https://github.com/HendrikRoth/fusion-inventory"
                    target="_blank">
                    <b-icon icon="github-circle" size="is-small"></b-icon>
                        Github
                </a>

                <form action="https://www.paypal.com/cgi-bin/webscr"
                    method="post" target="_top">
                    <input type="hidden" name="cmd" value="_s-xclick" />
                    <input type="hidden" name="hosted_button_id" value="YA4ZDEQTQEYMN" />
                    <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                    <img alt="" border="0" src="https://www.paypal.com/en_DE/i/scr/pixel.gif" width="1" height="1" />
                </form>
            </p>
        </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
export default class App extends Vue {
    @State("loading") loading!: boolean;

    created() {
        document.title = "Fusion Inventory";
    }
}
</script>

<style lang="scss">
$primary: #0696d7;
$link: $primary;
@import "~bulma/sass/utilities/_all";
@import "~bulma";
@import "~buefy/src/scss/buefy";

#app {
    margin: 2em;
}

.fusion-footer {
    margin-top: 3em;
    margin-bottom: 0;
}
</style>
