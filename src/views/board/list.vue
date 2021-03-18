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
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="5"
          :options.sync="options"
          :server-items-length="serverItemsLength"
        >
          <template v-slot:item.id="{ item }">
            <v-btn icon @click="openDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="remove(item)">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </template>

          <template v-slot:item.createAt="{ item }">
            {{ item.createAt.toLocaleString() }}
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
  name: "BOARD",
  data() {
    return {
      items: [],
      docs: [],
      headers: [
        { value: "title", text: "제목" },
        { value: "content", text: "내용" },
        { value: "createAt", text: "작성일" },
        { value: "id", text: "ID", sortable: false },
      ],
      options: {
        sortBy: ["createAt"],
        sortDesc: [true],
      },
      serverItemsLength: 0,
      dialog: false,
      selectedItem: null,
      form: {
        title: "",
        content: "",
      },
      unsubscribe: null,
      unsubscribeCount: null,
    };
  },
  watch: {
    options: {
      handler(cur, old) {
        console.log(cur, old);
        let dir = cur.page - old.page;
        this.subscribe(dir);
      },
      deep: true,
    },
  },

  created() {
    // this.read();
    // this.subscribe();
  },
  destroyed() {
    if (this.unsubscribe != null) {
      this.unsubscribe();
    }
    if (this.unsubscribeCount != null) {
      this.unsubscribeCount();
    }
  },
  methods: {
    subscribe(dir) {
      this.unsubscribeCount = this.$firebase
        .firestore()
        .collection("meta")
        .doc("boards")
        .onSnapshot((doc) => {
          // console.log(doc);
          if (doc.exists) {
            this.serverItemsLength = doc.data().count;
          } else {
            this.serverItemsLength = 0;
          }
        });

      const order = this.options.sortBy[0];
      const sort = this.options.sortDesc[0] ? "desc" : "asc";
      console.log(order, sort);

      let ref = this.$firebase.firestore().collection("boards");
      if (order) {
        ref = ref.orderBy(order, sort);
      }

      const limit = this.options.itemsPerPage;
      let query;
      switch (dir) {
        case -1: //이전 페이지
          const first = this.docs[0];
          query = ref.endBefore(first).limitToLast(limit);
          break;
        case 1: // 다음 페이지
          const last = this.docs[this.docs.length - 1];
          query = ref.startAfter(last).limit(limit);
          break;
        default:
          // 현재 페이지
          query = ref.limit(limit);
      }

      this.unsubscribe = query.onSnapshot((sn) => {
        if (sn.empty) {
          this.items = [];
        } else {
          this.docs = sn.docs;
          this.items = sn.docs.map((v) => ({
            id: v.id,
            ...v.data(),
            createAt: v.data().createAt.toDate(),
          }));
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
      const item = {
        createAt: new Date(),
        ...this.form,
      };
      this.$firebase.firestore().collection("boards").add(item);
      this.dialog = false;
    },
    update() {
      this.$firebase
        .firestore()
        .collection("boards")
        .doc(this.selectedItem.id)
        .update(this.form);
      this.dialog = false;
    },
    remove(item) {
      this.$firebase.firestore().collection("boards").doc(item.id).delete();
    },
    async read() {
      //   const sn = await this.$firebase.firestore().collection("boards").get();
      //   //   console.log(sn.docs);
      //   //   sn.docs.forEach(v=>{
      //   // 	  console.log(v.id);
      //   // 	  console.log(v.data());
      //   //   });
      //   this.items = sn.docs.map((v) => ({ id: v.id, ...v.data() }));
      //   console.log(this.items);
    },
  },
};
</script>

<style>
</style>