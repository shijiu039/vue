
// store/index.js
const store = new Vuex.Store({
  state: {
    user_id: ''
  },
  mutations: {
    setid(state, payload) {
      state.user_id = payload;
    }
  }
});
