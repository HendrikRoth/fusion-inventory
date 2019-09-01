<template>
  <div class="Settings">
      <b-loading
          :active.sync="loading"
          :can-cancel="false"
      />

      <div v-if="!loading">
        <b-field grouped>
            <b-field grouped position="is-right">
                <b-field>
                    <b-button
                        @click="$router.push('/')"
                        icon-right="toolbox-outline"
                        >
                        {{ $t("tools") }}
                    </b-button>
                </b-field>
            </b-field>
        </b-field>

        <h1 class="title">{{ $t('settings.title') }}</h1>

        <section>
            <h2 class="subtitle">{{ $t('settings.unit.label') }}</h2>
			<b-select v-model="settings.unit" size="is-small"
                @input="updateSettings">
				<option value="millimeters">{{ $t('settings.unit.millimeters') }}</option>
				<option value="inch">{{ $t('settings.unit.inch') }}</option>
			</b-select>
        </section>

        <section>
            <h2 class="subtitle">{{ $t('settings.perPageLabel') }}</h2>
			<b-select v-model="settings.perPage" size="is-small"
                @input="updateSettings">
				<option value="20">{{ $t('settings.perPage', { num: 20 }) }}</option>
				<option value="50">{{ $t('settings.perPage', { num: 50 }) }}</option>
				<option value="100">{{ $t('settings.perPage', { num: 100 }) }}</option>
				<option value="all">{{ $t('settings.perPageAll') }}</option>
			</b-select>
        </section>

        <section>
            <div>
                <h2 class="subtitle">{{ $t('settings.fusionColumns') }}</h2>
				<b-table :data="settings.fusionColumns">
					<template slot-scope="props">
						<b-table-column field="visible"
                            :label="$t('settings.columns.visible')" width="80" centered>
							<b-checkbox v-model="props.row.visible"
                                @input="updateSettings"/>
						</b-table-column>

						<b-table-column field="path"
                            :label="$t('settings.columns.name')">
							{{ $t(`fusionColumns.${props.row.path}`) }}
						</b-table-column>
					</template>
				</b-table>

                <h2 class="subtitle">{{ $t('settings.extraColumns') }}</h2>
				<b-table :data="settings.extraColumns">
					<template slot-scope="props">
						<b-table-column field="visible"
                            :label="$t('settings.columns.visible')" width="80" centered>
							<b-checkbox v-model="props.row.visible"
                                @input="updateSettings"/>
						</b-table-column>

						<b-table-column field="path"
                            :label="$t('settings.columns.name')">
							{{ $t(`extraColumns.${props.row.path}`) }}
						</b-table-column>
					</template>
				</b-table>

                <h2 class="subtitle">{{ $t('settings.userColumns') }}</h2>
				<b-table :data="settings.userColumns">
					<template slot-scope="props">
						<b-table-column field="visible"
                            :label="$t('settings.columns.visible')" width="80" centered>
							<b-checkbox v-model="props.row.visible"
                                @input="updateSettings"/>
						</b-table-column>

						<b-table-column field="path"
                            :label="$t('settings.columns.name')">
							<b-input v-model="props.row.label"
                                @input="updateSettings"/>
						</b-table-column>

						<b-table-column field="numeric"
                            :label="$t('settings.columns.numeric')">
							<b-checkbox v-model="props.row.numeric"
                                @input="updateSettings"/>
						</b-table-column>

						<b-table-column numeric>
							<b-button icon-left="trash-can-outline"
                                      @click="deleteColumnModal(props.row)">{{
                                      $t('settings.deleteColumn') }}</b-button>
						</b-table-column>
					</template>
				</b-table>
                <b-button @click="addColumn();updateSettings()">{{ $t('settings.addColumn') }}</b-button>
            </div>

        </section>
        
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Mutation, State, Action } from "vuex-class";
import DeleteModal from "../components/DeleteModal.vue";

@Component
export default class Settings extends Vue {
    @Action("getAll") getAll!: Function;
    @State("settings") settings!: any;
    @State("user") user!: any;
    @State("loading") loading!: any;
	@Mutation("addColumn") addColumn!: Function;
	@Mutation("deleteColumn") deleteColumn!: Function;
    @Action("updateSettings") updateSettings!: Function;

	deleteColumnModal(column: any) {
        this.$buefy.modal.open({
            parent: this,
            component: DeleteModal,
            hasModalCard: true,
            props: {
                column,
                fn: () => {
                    this.deleteColumn(column);
                    this.updateSettings();
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

<style lang="scss">
.Settings .subtitle {
margin-top: 3em;
}
</style>
