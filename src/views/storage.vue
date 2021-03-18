<template>
  <div>Storage
	  <v-text-field box label="label" v-model="text"></v-text-field>
	  <v-btn @click="write">write</v-btn>
	  <v-btn @click="read">read</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
    };
  },
  methods: {
    async write() {
      const sn = await this.$firebase
        .storage()
        .ref()
        .child("xxx.txt")
        .putString("abcd");
      console.log(sn);
	  // https://firebasestorage.googleapis.com/v0/b/ezcode-erp.appspot.com/o/xxx.txt?alt=media&token=09758552-3bd9-47a7-9100-0e350a14c69a
    },
	async read() {
		const url = await this.$firebase.storage().ref().child('xxx.txt').getDownloadURL();
		const res = await this.$axios.get(url);
		console.log(res);
		this.text = res.data

	}
  },
};
</script>

<style>
</style>