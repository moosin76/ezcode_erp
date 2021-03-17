
export const state = {
	firebaseLoaded: false,
	user: null,
}

export const mutations = {
	LoginUser(state, payload) {
		state.user = payload;
	},
	LogoutUser(state, payload) {
		state.user = null;
	},
	ModifyUser(state, { mb_name, mb_phone }) {
		if (state.user == null)
			return;
		state.user.mb_name = mb_name;
		state.user.mb_phone = mb_phone;
	},
	SET_FirebaseLoaded(state, payload) {
		state.firebaseLoaded = payload;
	}
};

export const getters = {};

export const actions = {
	async Logout(ctx) {
		try {
			await firebase.auth().signOut();
			ctx.commit('LogoutUser');
		} catch (err) {
			console.log(err.message);
		}
	},
	async AuthAction(ctx, firebase) {
		firebase.auth().onAuthStateChanged(async (user) => {
			if (user) {
			//	const { data } = await axios.get(`/api/member/${user.uid}`);
			//	const member = data;
			//	console.log(user);
				// const member = {};
				// member.photoURL = user.photoURL;
				// member.token = user.getIdToken();
				ctx.commit('LoginUser', user);
			} else {
				ctx.commit('LogoutUser');
			}
			ctx.commit('SET_FirebaseLoaded', true);
		})

	}
};
