<template>
  <div class="d-flex align-center">
    {{ title }}
    <v-btn icon @click="openDialog"><v-icon>mdi-pen</v-icon></v-btn>
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title>
          제목 수정
          <v-spacer></v-spacer>
          <v-btn icon color="error" @click="closeDialog"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="text"
            label="제목"
            hide-details
            @keypress.enter="saveDialog"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["title"],
  data() {
    return {
      dialog: false,
      text: this.title,
    };
  },
  methods: {
    openDialog() {
      this.text = this.title;
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async saveDialog() {
      try {
        await this.$firebase
          .database()
          .ref()
          .child("site")
          .update({ title: this.text });
      } catch(e) {
		  console.log(e.message);
	  } finally {
		this.dialog = false;
	  }
    },
  },
};
</script>

<style>
</style>