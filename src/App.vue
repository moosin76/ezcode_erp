<template>
  <v-app v-resize="onResize">
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <site-title :title="site.title" />
      <v-spacer></v-spacer>
      <!-- action -->
	  <site-sign/>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed temporary width="400">
      <navi-drawer :title="site.title" :items="site.menu" />
    </v-navigation-drawer>

    <v-main>
      <router-view :items="site.menu" />
    </v-main>

    <site-footer :footer="site.footer" />
    <vue-progress-bar></vue-progress-bar>
  </v-app>
</template>

<script>
import "./assets/css/style.css";
import { mapState, mapMutations, mapActions } from "vuex";
import NaviDrawer from "./components/NaviDrawer.vue";
import SiteFooter from "./components/SiteFooter.vue";
import SiteTitle from "./components/SiteTitle.vue";
import SiteSign from './components/SiteSign.vue';

export default {
  name: "App",

  components: {
    NaviDrawer,
    SiteFooter,
    SiteTitle,
    SiteSign,
  },

  data: () => ({
    drawer: false,
    site: {
      menu: [
        {
          title: "home",
          icon: "mdi-home",
          active: true,
          subItems: [{ title: "Dashboard", to: "/" }],
        },
        {
          title: "about",
          icon: "mdi-information-outline",

          subItems: [{ title: "About", to: "/about" }],
        },
        { title: "xxxx", icon: "mdi-microsoft-xbox" },
      ],
      title: "나의 타이틀 입니다.",
      footer: "푸터입니다.",
    },
  }),
  created() {
    this.subscribe();
  },
  mounted() {
    //  console.log(this.$firebase);
  },
  computed : {
	  ...mapState({
		  editable : (state) => state.global.editable
	  })
  },
  methods: {
    ...mapMutations("global", ["setWindowSize", "LoadingStart", "LoadingEnd", 'setSiteEdit']),
    subscribe() {
      try {
		this.LoadingStart();
        this.$firebase
          .database()
          .ref()
          .child("site")
          .on("value", (sn) => {
            this.LoadingStart();
            const v = sn.val();
            if (!v) {
              this.$firebase.database().ref().child("site").set(this.site);
            } else {
              this.site = v;
            }
            this.LoadingEnd();
          });
      } catch (e) {
        console.error(e.message);
        this.$toasted.error(e.message);
      }
    },
    onResize() {
      this.setWindowSize({ x: window.innerWidth, y: window.innerHeight });
    },
  },
};
</script>
