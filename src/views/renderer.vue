<template>
  <board-list v-if="document == 'list'" :collection="collection"></board-list>
  <board-content v-else-if="document != 'list' && !action" :collection="collection" :document="document"></board-content>
  <board-form v-else-if="document != 'list' && !!action" :collection="collection" :document="document" :action="action"></board-form>
<!-- 
  <page-list v-else-if="collection == 'page' && document == 'list'"></page-list>
  <page-content v-else-if="collection == 'page' && document != 'list' && !action" :document="document"></page-content>
  <page-form v-else-if="collection == 'page' && document != 'list' && !!action" :document="document" :action="action"></page-form> 
-->

  <error-page v-else></error-page>
 
</template>

<script>
import BoardList from "./board/list";
import BoardContent from "./board/content";
import BoardForm from "./board/form";
// import PageList from "./page/list";
// import PageContent from "./page/content";
// import PageForm from "./page/form";
import ErrorPage from "./error";

export default {
	name:"Renderer",
  components: {
    BoardList,
    BoardContent,
	BoardForm,
    // PageList,
    // PageContent,
	// PageForm,
    ErrorPage,
  },
  computed: {
    collection() {
      return this.$route.params.collection;
    },
    document() {
      return this.$route.params.document;
    },
	action() {
      return this.$route.params.action;
    },
  },
  mounted() {
	  console.log(this.$route);
  }
};
</script>

<style>
</style>