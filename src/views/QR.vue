<template>
  <div class="QR">
      <b-loading
          :active.sync="loading"
          :can-cancel="false"
      />

      <div v-if="!loading">
          <div class="card">
              <div class="card-content">
                  <h1 class="title">{{ tool.name }}</h1>
                  <h2 class="subtitle">{{ tool.tuid }}</h2>
                    <div>
                        <p>
                        <b>{{ $t('fusionColumns.vendor') }}:</b> {{ tool.vendor }}
                        </p>

                        <p>
                        <b>{{ $t('fusionColumns.productId') }}:</b> {{ tool.productId }}
                        </p>

                        <p>
                        <b>{{ $t('fusionColumns.productLink') }}:</b>
                            <a class="printonly" :href="tool.productLink" target="_blank"
                                v-if="tool.productLink">
                                {{ tool.productLink }}
                            </a>
                            <a class="printhide" :href="tool.productLink" target="_blank"
                                v-if="tool.productLink">
                                {{ tool.productLink | truncate(40) }}
                            </a>
                        </p>
                    </div>

                    <div class="infos first-infos">
                        <p v-for="(c, i) in settings.fusionColumns"
                        class="is-size-7">
                        <b>{{ $t(`fusionColumns.${c.path}`) }}:</b> 
                        <span v-if="c.path === 'productType'">
                            {{ $t(`productType.${tool[c.path]}`) }}
                        </span>
                        <span v-else>
                            {{ tool[c.path] }}
                        </span>
                        </p>
                    </div>

                    <div class="infos">
                        <p v-for="(c, i) in settings.extraColumns"
                        class="is-size-7">
                        <b>{{ $t(`extraColumns.${c.path}`) }}:</b> 
                            {{ tool[c.path] || 0 }}
                        </p>
                    </div>

                    <div class="infos">
                        <p v-for="(c, i) in settings.userColumns"
                        class="is-size-7">
                        <b>{{ c.label }}:</b> 
                            {{ tool[c.path] || 0 }}
                        </p>
                    </div>
              </div>
              <footer class="card-footer">
                <div class="card-footer-item">
                   <star-rating
                        :star-size="18"
                        :show-rating="false"
                        v-model="tool.rating"
                        @rating-selected="updateTool({tool, userId})"
                    />
                </div>
                <div class="card-footer-item">
                    <b-numberinput
                        min="0"
                        size="is-small"
                        controls-position="compact"
                        v-model="tool.amount"
                        @input="updateTool({tool, userId})"
                    />
                </div>
              </footer>
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Action } from "vuex-class";
// @ts-ignore
import StarRating from "vue-star-rating";

@Component({
    components: {
        StarRating
    }
})
export default class QR extends Vue {
    @State("loading") loading!: boolean;
    @Action("loadTool") loadTool!: Function;
    @Action("updateTool") updateTool!: Function;

    tool: any = {};
    settings: any = {};
    userId: string = "";

    async run() {
        const result = await this.loadTool(this.$route.params);
        this.tool = result.tool;
        this.settings = result.settings;
    }

    mounted() {
        this.run();
        this.userId = this.$route.params.userId;
    }
}
</script>

<style lang="scss">
.QR {
    display: flex;
    justify-content: center;
    align-items: center;

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
		width: 49%;
	}
}
</style>
