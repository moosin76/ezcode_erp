<template>
  <v-container fluid>
    <v-card :loading="loading">
      <v-toolbar color="accent" dense flat dark>
        <v-toolbar-title>게시판 정보 작성</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$router.back()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn icon @click="save"><v-icon>mdi-content-save</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field label="제목" v-model="form.title"></v-text-field>
          <editor
            ref="editor"
            :options="editorOption"
            :initialValue="form.content"
          ></editor>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: ["collection", "document", "action"],
  data() {
    return {
      unsubscribe: null,
      form: {
        title: "",
        content: "",
      },
      loading: false,
      exists: false,
      ref: null,
    };
  },
  computed: {
    articleId() {
      return this.$route.query.articleId;
    },
  },
  watch: {
    document() {
      this.subscribe();
    },
  },
  created() {
    this.subscribe();
    console.log(this.articleId);
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    subscribe() {
      this.ref = this.$firebase
        .firestore()
        .collection(this.collection)
        .doc(this.document);
      if (!this.articleId) return;
      if (this.unsubscribe) this.unsubscribe();
      this.unsubscribe = this.ref
        .collection("articles")
        .doc(this.articleId)
        .onSnapshot((doc) => {
          this.exists = doc.exists;
          if (this.exists) {
            const item = doc.data();
            this.form.title = item.title;
          }
        });
    },
    async save() {
      this.loading = true;
      try {
        const createAt = new Date();
        const id = createAt.getTime().toString();
        const md = this.$refs.editor.invoke("getMarkdown");
        const sn = await this.$firebase
          .storage()
          .ref()
          .child(this.collection)
          .child(this.document)
          .child(id)
          .putString(md);
        const url = await sn.ref.getDownloadURL();
        const form = {
          title: this.form.title,
          url: url,
          updateAt: createAt,
        };
        const batch = this.$firebase.firestore().batch();

        if (this.articleId) {
          // 업데이트
		  batch.update(this.ref.collection('articles').doc(this.articleId), form);
        } else {
          // 신규등록
          form.createAt = createAt;
          form.commentCount = 0;
          form.readCount = 0;
          batch.set(this.ref.collection("articles").doc(id), form);
          batch.update(this.ref, {
            count: this.$firebase.firestore.FieldValue.increment(1),
          });
        }
		await batch.commit();
        this.$router.push(`/${this.collection}/${this.document}`);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
