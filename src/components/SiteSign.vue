<template>
  <v-progress-circular v-if="isLoading" indeterminate ></v-progress-circular>
  <!-- 비회원 -->
  <v-menu v-else-if="user==null" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" :active="!isLoading">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-actions>
        <v-btn @click="signInWithGoogle" block color="primary">
          <v-icon left>mdi-google</v-icon> 구글 로그인
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
  <!-- 회원 -->
  <v-menu v-else offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" :active="!isLoading">
		<v-avatar  size="32">
			<v-img :src="user.photoURL"/>
		</v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-card-actions>
        <v-btn @click="signOut" block color="error">
          <v-icon left>mdi-logout</v-icon> 로그아웃
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      isLoading: (state) => state.global.isLoading,
    }),
  },
  methods: {
    ...mapMutations("global", ["LoadingStart", "LoadingEnd", "setSiteEdit"]),
    ...mapMutations("user", ["LogoutUser"]),
    async signInWithGoogle() {
      this.LoadingStart();
      const provider = new this.$firebase.auth.GoogleAuthProvider();
      this.$firebase.auth().languageCode = "ko";
      try {
        const result = await this.$firebase.auth().signInWithPopup(provider);
        // var credential = result.credential;
        // var token = credential.accessToken;
        console.log(result.user);
      } catch (error) {
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // var email = error.email;
        // var credential = error.credential;
        this.$toasted.error(error.message);
      } finally {
        this.LoadingEnd();
      }
    },
    signOut() {
      this.$firebase
        .auth()
        .signOut()
        .then(() => {
          this.LogoutUser();
        })
        .catch((error) => {
          // An error happened.
        });
    },
  },
};
</script>

<style>
</style>