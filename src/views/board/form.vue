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
          <v-text-field label="종류" v-model="form.category"></v-text-field>
          <v-text-field label="제목" v-model="form.title"></v-text-field>
          <v-textarea label="설명" v-model="form.description"></v-textarea>
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
        category: "",
        title: "",
        description: "",
      },
      loading: false,
      exists: false,
      ref: null,
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
      if (this.unsubscribe) this.unsubscribe();
      this.ref = this.$firebase
        .firestore()
        .collection(this.collection)
        .doc(this.document);
      this.unsubscribe = this.ref.onSnapshot((doc) => {
        this.exists = doc.exists;
        if (this.exists) {
          const item = doc.data();
          this.form.category = item.category;
          this.form.title = item.title;
          this.form.description = item.description;
        }
      });
    },
    async save() {
      const form = {
        category: this.form.category,
        title: this.form.title,
        description: this.form.description,
        updateAt: new Date(),
      };
      this.loading = true;
      try {
        if (!this.exists) {
          form.createAt = new Date();
          form.count = 0;
          await this.ref.set(form);
        } else {
          await this.ref.update(form);
        }
        this.$router.push(`/${this.collection}/${this.document}`);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
