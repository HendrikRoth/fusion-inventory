<template>
    <b-table
        :data="tools"
        :paginated="settings.perPage !== 'all'"
        :per-page="settings.perPage"
        :show-detail-icon="false"
        ref="table"
        detailed
        pagination-size="is-small"
    >
        <template slot-scope="props">
            <b-table-column field="postProcess" :label="$t('fusionColumns.nc')" width="40" sortable numeric
                :class="state(props.row)"
                >
                <span v-if="props.row.postProcess > 0">
                    {{ props.row.postProcess }}
                </span>
            </b-table-column>

            <b-table-column :label="$t('fusionColumns.informations')"
                field="name" sortable :class="state(props.row)">
                <a @click="toggle(props.row)"><b>{{ props.row.name }}</b></a>
                <a @click="toggle(props.row)" class="is-size-7">
                {{ $t(`extraColumns.tuid`) }}: {{ props.row.tuid }}
                </a>
                <a @click="toggle(props.row)" class="is-size-7">{{ $t('fusionColumns.productType') }}: {{
                $t(`productType.${props.row.productType}`) }}</a>
            </b-table-column>

            <b-table-column v-for="(c, i) in settings.fusionColumns"
                            :label="$t(`fusionColumns.${c.path}`)"
                :visible="c.visible" :numeric="c.numeric" :field="c.path" sortable
                :class="state(props.row)" :key="i">
                <span v-if="c.numeric" v-html="getUnit(props.row,
                    c.path)"></span>
                <span v-else>{{ props.row[c.path] }}</span>
            </b-table-column>

            <b-table-column v-for="(c, i) in settings.extraColumns"
                            :label="$t(`extraColumns.${c.path}`)"
                :visible="c.visible" :numeric="c.numeric" :field="c.path" sortable
                :class="state(props.row)" :key="i">

                <div class="rating" v-if="c.path === 'rating'">
                    <star-rating
                        :star-size="18"
                        :show-rating="false"
                        v-model="props.row[c.path]"
                        @rating-selected="update(props.row)"
                    />
                </div>

                <div class="inventory" v-else-if="c.path === 'amount'">
                    <b-numberinput
                        min="0"
                        size="is-small"
                        controls-position="compact"
                        v-model="props.row[c.path]"
                        @input="update(props.row)"
                    />
                </div>

                <div v-else>
                    {{ props.row[c.path] }}
                </div>
            </b-table-column>

            <b-table-column v-for="(c, i) in settings.userColumns"
                            :label="c.label"
                :visible="c.visible" :numeric="c.numeric" :field="c.path" sortable
                :class="state(props.row)"
                :key="i"
                >
                {{ props.row[c.path] }}
            </b-table-column>
        </template>

        <template slot="detail" slot-scope="props">
            <article class="media" 
                    :ref="`qr-${props.row.guid}'`"
                    :id="`qr-${props.row.guid}`"
            >
                <div class="media-left">
                    <figure>
                        <img :src="qr(props.row.guid)" />
                    </figure>
                    <div class="center">
                        {{ props.row.tuid }}
                    </div>
                </div>
                <div class="media-content relative">
                    <div class="edit-button" v-if="settings.userColumns.length > 0">
                        <b-button @click="editModal(props.row)" icon-left="lead-pencil" />
                    </div>

                    <div>
                        <p>
                        <b>{{ $t('fusionColumns.vendor') }}:</b> {{ props.row.vendor }}
                        </p>

                        <p>
                        <b>{{ $t('fusionColumns.productId') }}:</b> {{ props.row.productId }}
                        </p>

                        <p>
                        <b>{{ $t('fusionColumns.productLink') }}:</b>
                            <a class="printonly" :href="props.row.productLink" target="_blank"
                                v-if="props.row.productLink">
                                {{ props.row.productLink }}
                            </a>
                            <a class="printhide" :href="props.row.productLink" target="_blank"
                                v-if="props.row.productLink">
                                {{ props.row.productLink | truncate(40) }}
                            </a>
                        </p>
                    </div>

                    <div class="infos first-infos">
                        <p v-for="(c, i) in settings.fusionColumns"
                        class="is-size-7">
                        <b>{{ $t(`fusionColumns.${c.path}`) }}:</b> 
                        <span v-if="c.path === 'productType'">
                            {{ $t(`productType.${props.row[c.path]}`) }}
                        </span>
                        <span v-else>
                            {{ props.row[c.path] }}
                        </span>
                        </p>
                    </div>

                    <div class="infos">
                        <p v-for="(c, i) in settings.extraColumns"
                        class="is-size-7">
                        <b>{{ $t(`extraColumns.${c.path}`) }}:</b> 
                            {{ props.row[c.path] || 0 }}
                        </p>
                    </div>

                    <div class="infos">
                        <p v-for="(c, i) in settings.userColumns"
                        class="is-size-7">
                        <b>{{ c.label }}:</b> 
                            {{ props.row[c.path] || 0 }}
                        </p>
                    </div>

                    <div class="printhide">
                        <p class="is-size-7">{{ $t('qr.info') }}</p>
                        <b-button size="is-small" icon-left="printer"
                                                  @click="print(props.row['guid'])">{{
                                                  $t('qr.print') }}</b-button>
                    </div>
                </div>
            </article>
        </template>
    </b-table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import config from "../config";
import Printd from "printd";
// @ts-ignore
import QRious from "qrious";
// @ts-ignore
import StarRating from "vue-star-rating";

@Component({
    components: {
        StarRating
    }
})
export default class ToolTable extends Vue {
    @Prop(Array) tools!: any[];
    @Prop(Object) settings!: any;
    @Prop(Object) user!: any;
    @Prop(Function) editModal!: Function;
    @Prop(Function) update!: Function;

    d: any;

    toggle(row: any) {
        // @ts-ignore
        this.$refs.table.toggleDetails(row);
    }

    state(row: any) {
        return row.amount < 1 ? "danger" : "";
    }

    getUnit(tool: any, path: string) {
        let ret = tool[path];

        if (!ret) {
            return "";
        }

        if (tool.unit !== this.settings.unit) {
            if (tool.unit === "millimeters") {
                ret = tool[path] / 25.4;
            } else {
                ret = tool[path] * 25.4;
            }
        }
        const unit = this.settings.unit === "millimeters" ? "mm" : "in";
        return `${ret}<span class="is-size-7 unit">${unit}</span>`;
    }

    qr(guid: string) {
        const code = new QRious({
            size: 200,
            value: `${config.host}/#/qr/${this.user.userId}/${guid}`
        });

        return code.toDataURL("image/png");
    }

    print(guid: string) {
        const elem = document.getElementById(`qr-${guid}`);
        const css = `
            .printhide {
                display: none;
            }
            .printonly {
                display: initial;
            }
        `;
        this.d.print(elem, [css]);
    }

    mounted() {
        this.d = new Printd();	
    }
}
</script>

<style lang="scss">
	.rating {
		display: flex;
		justify-content: center;
	}

	.inventory {
		width: 80px;
		float: right;
	}

	.infos {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
        margin-bottom: 0.5em;
	}

    .first-infos {
        margin-top: 1em;
    }

	.infos p {
		width: 32%;
	}

    .printonly {
        display: none;
    }

    .relative {
        position: relative;
    }

    .edit-button {
        position: absolute;
        top: 10px;
        right: 10px;
    }
    
    .danger {
        background: #FFEAEA;
    }
    
    .center {
        text-align: center;
        font-weight: bold;
    }

    .unit {
        opacity: 0.8;
    }
</style>
