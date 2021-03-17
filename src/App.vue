<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <site-title :title="site.title" />
      <v-spacer></v-spacer>
      <v-btn icon @click="save">
        <v-icon>mdi-pen</v-icon>
      </v-btn>
      <v-btn icon @click="read">
        <v-icon>mdi-eye</v-icon>
      </v-btn>
      <v-btn icon @click="readOnce">
        <v-icon>mdi-axis-arrow</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary width="400">
      <navi-drawer :title="site.title" :items="site.menu" />
    </v-navigation-drawer>

    <v-main>
      <router-view :items="site.menu" />
    </v-main>

    <site-footer :footer="site.footer" />
  </v-app>
</template>

<script>
import "./assets/css/style.css";
import NaviDrawer from "./components/NaviDrawer.vue";
import SiteFooter from "./components/SiteFooter.vue";
import SiteTitle from "./components/SiteTitle.vue";

export default {
  name: "App",

  components: {
    NaviDrawer,
    SiteFooter,
    SiteTitle,
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
  methods: {
    subscribe() {
      this.$firebase
        .database()
        .ref()
        .child("site")
        .on(
          "value",
          (sn) => {
            const v = sn.val();
            if (!v) {
              this.$firebase.database().ref().child("site").set(this.site);
            } else {
              this.site = v;
            }
          },
          (e) => {
            console.log(e.message);
          }
        );
    },
    save() {
      this.$firebase.database().ref("/abc").set({
        title: "abcd",
        text: "ttttt",
      });
    },
    read() {
      this.$firebase
        .database()
        .ref("/abcd")
        .on("value", (sn) => {
          console.log(sn.val().title, sn.val().text);
        });
    },
    async readOnce() {
      const sn = await this.$firebase.database().ref("/abcd").once("value");
      console.log("Once", sn.val().title, sn.val().text);
    },
  },
};
</script>
