<template>
  <board-list v-if="collection == 'board' && document == 'list'"></board-list>
  <board-content v-else-if="collection == 'board' && document != 'list'" :document="document"></board-content>
  <page-list v-else-if="collection == 'page' && document == 'list'"></page-list>
  <page-content v-else-if="collection == 'page' && document != 'list'" :document="document"></page-content>
  <error-page v-else></error-page>
 
</template>

<script>
import BoardList from "./board/list";
import BoardContent from "./board/content";
import PageList from "./page/list";
import PageContent from "./page/content";
import ErrorPage from "./error";

export default {
  components: {
    BoardList,
    BoardContent,
    PageList,
    PageContent,
    ErrorPage,
  },
  computed: {
    collection() {
      return this.$route.params.collection;
    },
    document() {
      return this.$route.params.document;
    },
  },
};
</script>

<style>
</style>