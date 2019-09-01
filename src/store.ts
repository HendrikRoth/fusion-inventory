import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import config from "./config";
import { i18n } from "./plugins/i18n";
import { v1 } from "uuid";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    tools: [],
    locale: "en",
    user: {},
    settings: {}
  },
  mutations: {
    setLoading(state) {
      state.loading = true;
    },
    unsetLoading(state) {
      state.loading = false;
    },
    setUser(state, user) {
      state.user = user;
    },
    setTools(state, tools) {
      state.tools = tools;
    },
    setSettings(state, settings) {
      state.settings = settings;
      i18n.locale = settings.language;
    },
    addColumn(state) {
      const newColumn = {
        label: i18n.t("newColumn.label"),
        visible: true,
        path: v1()
      };
      // @ts-ignore
      state.settings.userColumns.push(newColumn);
    },
    deleteColumn(state, column) {
      // @ts-ignore
      state.settings.userColumns = state.settings.userColumns.filter(
        (col: any) => col.path === column
      );
    },
    updateTools(state) {
      state.tools = Object.assign([], state.tools);
    }
  },
  actions: {
    async getAll({ commit }) {
      try {
        commit("setLoading");
        const result = await axios.get(`${config.host}/libraries`);
        commit("setUser", result.data.user);
        commit(
          "setTools",
          result.data.inventory.tools.map((tool: any) => {
            tool.amount = tool.amount || 0;
            tool.rating = tool.rating || 0;
            return tool;
          })
        );
        commit("setSettings", result.data.inventory.settings);
        commit("unsetLoading");
      } catch (_) {
        location.href = "/login";
      }
    },
    async updateTool({}, params) {
      await axios.post(`${config.host}/updateTool`, {
        userId: params.userId,
        tool: params.tool
      });
    },
    async update({}, params) {
      await axios.post(`${config.host}/update`, { tool: params });
    },
    async updateSettings({ state }) {
      await axios.post(`${config.host}/updateSettings`, state.settings);
    },
    async loadTool({ commit }, { guid, userId }) {
      commit("setLoading");
      const result = await axios.get(`${config.host}/tool/${userId}/${guid}`);
      commit("unsetLoading");
      i18n.locale = result.data.settings.language;
      return result.data;
    }
  }
});
