<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">{{ $t('editModal.title') }}</p>
        </header>
        <section class="modal-card-body">
            <b-field v-for="column in settings.userColumns" :label="column.label">
                <b-input v-model="tool[column.path]"/>
            </b-field>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button"
                                   @click="$parent.close()">{{
                                   $t('editModal.cancel') }}</button>
            <button class="button is-primary"
                @click="run"
                    >{{ $t('editModal.ok')}}</button>
        </footer>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
export default class EditModal extends Vue {
    @Prop(Object) tool!: any;
    @Prop(Function) fn!: Function;
    @State("settings") settings!: any;

    run() {
        if (typeof this.fn !== "undefined") {
            this.fn(this.tool);
        } 
      // @ts-ignore
        this.$parent.close();
    }
}
</script>
