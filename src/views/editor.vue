<template>
  <div>
    <editor ref="editor" :options="editorOption" :initialValue="text" @change="read"></editor>
    <v-btn @click="read">리드</v-btn>
    <viewer v-if="show" ref="viewer" :initialValue="text"></viewer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "abcd",
      show: true,
    };
  },
  methods: {
    read() {
      this.text = this.$refs.editor.invoke("getMarkdown");
      console.log(this.text);
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
      
    },
  },
};
</script>

<style>
</style>