<template>
  <v-footer app dark color="primary">
    <v-spacer></v-spacer>
    <div>
      &copy; {{ new Date().getFullYear() }} {{ footer }}
	  <!-- 관리자 -->
      <v-btn icon @click="openDialog"><v-icon>mdi-pencil</v-icon></v-btn>
      <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-title>
            푸터 수정
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
  </v-footer>
</template>

<script>
export default {
  props: ["footer"],
  data() {
    return {
      dialog: false,
      text: this.footer,
    };
  },
  methods: {
    openDialog() {
      this.text = this.footer;
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
        .update({ footer: this.text });

      this.dialog = false;
    },
  },
};
</script>

<style>
</style>