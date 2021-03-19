<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :server-items-length="info.count"
    :options.sync="options"
    :items-per-page="5"
    must-sort
    item-key="id"
  ></v-data-table>
</template>

<script>
export default {
  props: ["info", "collection", "document"],
  data() {
    return {
      headers: [
        { value: "createAt", text: "작성일" },
        { value: "title", text: "제목" },
      ],
      items: [],
      unsubscribe: null,
      options: {
        sortBy: ["createAt"],
        sortDesc: [true],
      },
      docs: [],
    };
  },
  watch: {
    document() {
      this.subscribe(0);
    },
    options: {
      handler(n, o) {
        if (!o.page) {
          this.subscribe(0);
          return;
        }
        if (o.sortBy[0] !== n.sortBy[0] || o.sortDesc[0] !== n.sortDesc[0]) {
          n.page = 1;
          this.subscribe(0);
          return;
        }
        const dir = n.page - o.page;
        this.subscribe(dir);
      },
      deep: true,
    },
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    subscribe(dir) {
      if (this.unsubscribe) this.unsubscribe();
      const order = this.options.sortBy[0];
      const sort = this.options.sortDesc[0] ? "desc" : "asc";
      const limit = this.options.itemPerPage;
      let ref = this.$firebase
        .firestore()
        .collection(this.collection)
        .doc(this.document)
        .collection("articles");

      if (order) {
        ref = ref.orderBy(order, sort);
      }

      let query;
      switch (dir) {
        case -1:
          query = ref.endBefore(this.docs[0]).limitToLast(limit);
          break;
        case 1:
          query = ref.startAfter(this.docs[this.docs.length - 1]).limit(limit);
          break;
        default:
          query = ref.limit(limit);
      }

      this.unsubscribe = query.onSnapshot((sn) => {
        if (sn.empty) {
          this.items = [];
          return;
        }
        this.docs = sn.docs;
        this.items = sn.docs.map((doc) => {
          const item = doc.data();
          item.id = doc.id;
          item.createAt = item.createAt.toDate();
          item.updateAt = item.updateAt.toDate();
          return item;
        });
        // console.log(this.items);
      });
    },
  },
};
</script>

<style>
</style>