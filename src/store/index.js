import Vue from "vue";
import api from "../services/api.js";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    events: [],
    errorMessage: "",
  },
  mutations: {
    SET_EVENTS(state, getEvents) {
      state.events = getEvents;
    },
    SET_ERROR(state, setError) {
      state.errorMessage = setError;
    },

    DELETE_EVENT(state, eventsNow) {
      state.events = eventsNow;
    },
    SAVE_UPDATE(state, eventsUpdated) {
      state.events = eventsUpdated;
    },
  },
  actions: {
    getEvents({ commit }) {
      api("/event/getall")
        .then((res) => {
          const getEvents = res.data.events;
          console.log(res.data.events);
          commit("SET_EVENTS", getEvents);
        })
        .catch((err) => {
          const setError = err;
          console.error(err);
          commit("SET_ERROR", setError);
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

    SAVE_UPDATE({ commit }, updateEvent) {
      api
        .post("/event/edit", updateEvent)
        .then((res) => {
          const eventsUpdated = res.data.events;
          console.log(eventsUpdated)
          commit("SAVE_UPDATE", eventsUpdated);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
});
