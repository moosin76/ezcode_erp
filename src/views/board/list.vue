<template>
  <div>
    <v-card>
      <v-card-title>테스트 게시판</v-card-title>
      <v-card-actions>
        <v-btn @click="read"><v-icon left>mdi-eye</v-icon></v-btn>
        <v-btn @click="openDialog(null)">
          <v-icon left>mdi-pencil</v-icon>
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-data-table :headers="headers" :items="items">
          <template v-slot:item.id="{ item }">
            <v-btn icon @click="openDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="remove(item)">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog">
      <v-card>
        <v-form>
          <v-card-title>
            디알로그
            <v-spacer></v-spacer>
            <v-btn icon color="error" @click="dialog = !dialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-text-field label="제목" v-model="form.title"></v-text-field>
            <v-text-field label="내용" v-model="form.content"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="selectedItem" @click="update">
              <v-icon left>mdi-pencil</v-icon> 수정
            </v-btn>
            <v-btn v-else @click="add">
              <v-icon left>mdi-pencil</v-icon> 작성
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      headers: [
        { value: "title", text: "제목" },
        { value: "content", text: "내용" },
        { value: "id", text: "ID" },
      ],
      dialog: false,
      selectedItem: null,
      form: {
        title: "",
        content: "",
      },
      unsubscribe: null,
    };
  },
  created() {
    // this.read();
    this.subscribe();
  },
  destroyed() {
    if (this.unsubscribe != null) {
      this.unsubscribe();
    }
  },
  methods: {
    subscribe() {
      this.unsubscribe = this.$firebase
        .firestore()
        .collection("borads")
        .onSnapshot((sn) => {
          if (sn.empty) {
            this.items = [];
          } else {
            this.items = sn.docs.map((v) => ({ id: v.id, ...v.data() }));
            console.log(this.items);
          }
        });
    },
    openDialog(item) {
      if (!item) {
        this.form.title = "";
        this.form.content = "";
      } else {
        this.form.title = item.title;
        this.form.content = item.content;
      }
      this.selectedItem = item;
      this.dialog = true;
    },
    add() {
      this.$firebase.firestore().collection("borads").add(this.form);
      this.dialog = false;
    },
    update() {
      this.$firebase
        .firestore()
        .collection("borads")
        .doc(this.selectedItem.id)
        .update(this.form);
      this.dialog = false;
    },
    remove(item) {
      this.$firebase.firestore().collection("borads").doc(item.id).delete();
    },
    async read() {
      const sn = await this.$firebase.firestore().collection("borads").get();
      //   console.log(sn.docs);
      //   sn.docs.forEach(v=>{
      // 	  console.log(v.id);
      // 	  console.log(v.data());
      //   });
      this.items = sn.docs.map((v) => ({ id: v.id, ...v.data() }));
      console.log(this.items);
    },
  },
};
</script>

<style>
</style>