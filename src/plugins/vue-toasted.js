import Vue from 'vue';
import Toasted from 'vue-toasted';

const defaultOption = {
	iconPack: 'mdi',
	action: {
		text: "",
		icon: 'mdi-close',
		onClick: (e, toastObject) => {
			toastObject.goAway(0);
		},
		class: "toast-error-icon"
	},
	position: "bottom-center",
	duration: 3000,
	keepOnHover: true,
}

Vue.use(Toasted, defaultOption);

Vue.config.errorHandler = e => {
	console.error(e);
	Vue.toasted.error(e.message);
}