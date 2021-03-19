<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="accent" dense flat dark>
        <v-toolbar-title>{{ info.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="write"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="articleWrite"><v-icon>mdi-pen-plus</v-icon></v-btn>
      </v-toolbar>
      <v-card-text v-if="info.createAt">
        <v-alert color="info" outlined dismissible>
          <div style="white-space: pre-line">{{ info.description }}</div>
          <div class="text-right font-italic caption">
            작성일 : {{ info.createAt.toDate().toLocaleString() }}
          </div>
          <div class="text-right font-italic caption">
            수정일 : {{ info.updateAt.toDate().toLocaleString() }}
          </div>
        </v-alert>
      </v-card-text>
		<board-article :info="info" :collection="collection" :document="document"></board-article>
    </v-card>
  </v-container>
</template>

<script>
import BoardArticle from "./article/index";
export default {
  components: {
    BoardArticle,
  },
  props: ["collection", "document"],
  data() {
    return {
      unsubscribe: null,
      info: {
        category: "",
        title: "",
        description: "",
      },
      loading: false,
    };
  },
  watch: {
    document() {
      this.subscribe();
    },
  },
  created() {
    this.subscribe();
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    subscribe() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      const ref = this.$firebase
        .firestore()
        .collection(this.collection)
        .doc(this.document);
      this.unsubscribe = ref.onSnapshot((doc) => {
        if (!doc.exists) {
          return this.write();
        }
        this.info = doc.data();
      });
    },
    write() {
      this.$router.push(this.$route.path + "/board-write");
    },
    articleWrite() {
      this.$router.push({
        path: this.$route.path + "/article-write",
        query: { articleId: null },
      });
    },
  },
};
</script>

<style>
</style>