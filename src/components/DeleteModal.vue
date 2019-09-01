<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">{{ $t('deleteModal.title') }}</p>
        </header>
        <section class="modal-card-body" v-html="$t('deleteModal.info', {name:
            column.label})">
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button"
                                   @click="$parent.close()">{{
                                   $t('deleteModal.cancel') }}</button>
            <button class="button is-primary"
                @click="run"
                    >{{ $t('deleteModal.ok')}}</button>
        </footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class DeleteModal extends Vue {
    @Prop(Object) column!: any;
    @Prop(Function) fn!: Function;

    run() {
        if (typeof this.fn !== "undefined") {
            this.fn();
        } 
      // @ts-ignore
        this.$parent.close();
    }
}
</script>
