<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"/>

      <div class="d-flex align-center">
       {{title}}
      </div>

      <v-spacer></v-spacer>

      <v-btn icon @click="save">
		  <v-icon>mdi-pen</v-icon>
	  </v-btn>
    </v-app-bar>

	<v-navigation-drawer v-model="drawer" absolute temporary bottom>
		<navi-drawer :title="title"/>
	</v-navigation-drawer>

    <v-main>
		<router-view/>
    </v-main>

	<site-footer :footer="footer"/>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import NaviDrawer from './components/NaviDrawer.vue';
import SiteFooter from './components/SiteFooter.vue';

export default {
  name: "App",

  components: {
    HelloWorld,
    NaviDrawer,
    SiteFooter,
  },

  data: () => ({
    drawer : false,
	title : "PageTitle",
	footer : "푸터입니다.",
  }),
  mounted() {
    console.log(this.$firebase);
  },
  methods: {
	  save() {
		  console.log('save');
	  }
  }
};
</script>
