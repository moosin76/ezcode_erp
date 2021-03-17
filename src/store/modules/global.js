import Vue from 'vue';

export const state = {
	isLoading: false,
	windowSize :{x :0, y:0},
	editable :true,
}

export const mutations = {
	setSiteEdit(state, payload) {
		state.editable = payload
	},
	LoadingStart(state) {
		Vue.prototype.$Progress.start();
		state.isLoading = true;
	},
	LoadingEnd(state) {
		state.isLoading = false;
		Vue.prototype.$Progress.finish();
	},
	setWindowSize (state, payload) {
		state.windowSize = payload;
	},
};

export const getters = {};

export const actions = {
	async fetchConfig(ctx, webAPI) {
		const {data} = await webAPI.get("/config");
		ctx.commit('SET_CONFIG', data);
	}
};	
