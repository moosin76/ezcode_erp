<template>
  <div class="d-flex align-center">
    {{ title }}
	<!-- 관리자 -->
    <v-btn icon @click="openDialog"><v-icon>mdi-pencil</v-icon></v-btn>
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
	<!-- // 관리자 -->
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
      await this.$firebase
        .database()
        .ref()
        .child("site")
        .update({ title: this.text });

      this.dialog = false;
    },
  },
};
</script>

<style>
</style>