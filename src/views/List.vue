<template>
  <div class="List">
      <b-loading
          :active.sync="loading"
          :can-cancel="false"
      />

      <div v-if="!loading">
        <b-field grouped>
            <b-input :placeholder="$t('search')"
                expanded
                v-model="search"
                type="search"
                icon="magnify">
            </b-input>

            <b-field>
                <b-dropdown hoverable aria-role="list">
                    <button class="button" slot="trigger">
                        <span>{{ $t('download.button') }}</span>
                        <b-icon icon="menu-down"></b-icon>
                    </button>

                    <b-dropdown-item aria-role="listitem">
                        <a
                            target="_blank"
                            href="/#/qr-list">
                            {{ $t('download.qrlist') }}
                        </a>
                    </b-dropdown-item>

                    <b-dropdown-item aria-role="listitem">
                        <a
                            target="_blank"
                            href="/download/inventory.json">
                            {{ $t('download.inventory') }}
                        </a>
                    </b-dropdown-item>

                    <b-dropdown-item aria-role="listitem">
                        <a
                            target="_blank"
                            href="/download/linuxcnc.tools">
                            {{ $t('download.linuxcnc') }}
                        </a>
                    </b-dropdown-item>
                </b-dropdown>
            </b-field>

            <b-field grouped position="is-right">
                <b-field>
                    <b-button
                        @click="$router.push('settings')"
                        icon-right="settings"
                        >
                        {{ user.firstName }} {{ user.lastName }}
                    </b-button>
                </b-field>
            </b-field>
        </b-field>

        <ToolTable
            :tools="toolList"
            :settings="settings"
            :user="user"
            :editModal="editModal"
            :update="update"
            v-if="toolList.length > 0"
        />
        <p v-else>
            <a target="_blank"
               href="https://knowledge.autodesk.com/support/fusion-360/learn-explore/caas/sfdcarticles/sfdcarticles/How-to-install-a-cloud-tool-library-in-Fusion-360.html">
                {{ $t('noTools') }}</a>
        </p>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action, State, Mutation } from "vuex-class";
import ToolTable from "../components/ToolTable.vue";
import EditModal from "../components/EditModal.vue";

@Component({
    components: {
        ToolTable
    }
})
export default class List extends Vue {
    @Action("getAll") getAll!: Function;
    @State("loading") loading!: boolean;
    @State("user") user!: any;
    @State("tools") tools!: any[];
    @State("settings") settings!: any;
    @Mutation("updateTools") updateTools!: Function;
    @Action("update") update!: Function;

    search: string = "";

    get toolList() {
        if (this.search.length === 0) {
            return this.tools;
        }
        const regexp = new RegExp(this.search, "i");
        return this.tools.filter((tool: any) =>
            tool.name.search(regexp) > -1 || tool.tuid.search(regexp) > -1)
    }

    editModal(tool: any) {
        const copy = Object.assign({}, tool);
        
        this.settings.userColumns.forEach((column: any) => {
            if (typeof copy[column.path] === "undefined") {
                if (column.numeric) {
                    copy[column.path] = 0;
                } else {
                    copy[column.path] = "";
                }
            }
        });

        this.$buefy.modal.open({
            parent: this,
            component: EditModal,
            hasModalCard: true,
            props: {
                tool: copy,
                fn: (edited: any) => {
                    Object.assign(tool, edited);
                    this.updateTools();
                    this.update(tool);
                }
            }
        });
    }

    mounted() {
        if (!this.user.userId) {
            this.getAll();
        }
    }
}
</script>
