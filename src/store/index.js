import Vue from "vue";
import api from "../services/api.js";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    events: [],
  },
  mutations: {
    SET_EVENTS(state, getEvents) {
      state.events = getEvents;
    },

    DELETE_EVENT(state, eventsNow) {
      state.events = eventsNow;
    },
    SAVE_UPDATE(state, eventUpdated) {
      state.events = eventUpdated;
    },
  },
  getters: {},
  actions: {
    getEvents({ commit }) {
      api("/event/getall")
        .then((res) => {
          const getEvents = res.data.events;
          // console.log(res.data.events);
          commit("SET_EVENTS", getEvents);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    DELETE_EVENT({ commit }, event) {
      api
        .post("/event/delete", event)
        .then((res) => {
          const eventsNow = res.data.events;
          commit("DELETE_EVENT", eventsNow);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    SAVE_UPDATE({ commit }, updatEvents) {
      api
        .post("/event/edit", updatEvents)
        .then((res) => {
          const eventUpdated = res.data.events;
          commit("SAVE_UPDATE", eventUpdated);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  modules: {},
});
