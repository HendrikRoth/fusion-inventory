<template>
  <div class="QRList">
      <b-loading
          :active.sync="loading"
          :can-cancel="false"
      />

      <div v-if="!loading" class="columns is-multiline">
          <div class="column" v-for="tool in tools" :key="tool.tuid">
              <div class="card">
                  <div class="card-content">
                    <figure>
                        <img :src="qr(tool.guid)" />
                    </figure>
                    <p class="is-size-6">
                        <strong>{{ tool.tuid }}</strong>
                    </p>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Action } from "vuex-class";
import config from "../config";
// @ts-ignore
import QRious from "qrious";

@Component
export default class QR extends Vue {
    @State("loading") loading!: boolean;
    @State("user") user!: any[];
    @State("tools") tools!: any[];
    @Action("getAll") getAll!: Function;

    qr(guid: string) {
        const code = new QRious({
            size: 200,
            // @ts-ignore
            value: `${config.host}/#/qr/${this.user.userId}/${guid}`
        });

        return code.toDataURL("image/png");
    }

    mounted() {
        this.getAll();
    }
}
</script>

<style lang="scss">
.QRList {
    .card {
        width: 200px;
        text-align: center;
    }
}
</style>
