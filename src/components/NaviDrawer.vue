<template>
  <div>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ title }}
          </v-list-item-title>
          <v-list-item-subtitle>v 0.0.1</v-list-item-subtitle>
        </v-list-item-content>
        <!-- 관리자 -->
        <v-list-item-action>
          <v-btn icon @click="setSiteEdit(!editable)">
            <v-icon v-if="editable">mdi-eye</v-icon>
            <v-icon v-else>mdi-cog</v-icon>
          </v-btn>
        </v-list-item-action>
        <!-- // 관리자 -->
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-group
        v-for="(item, i) in items"
        :key="`${i}_${item.title}`"
        v-model="item.active"
        :prepend-icon="item.icon"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
          <!-- 관리자 -->
          <v-list-item-icon v-if="editable">
            <v-btn
              icon
              color="primary"
              small
              @click.stop.prevent="openMainDialog(i)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              color="error"
              small
              @click.stop.prevent="deleteItem(items, i)"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn
              icon
              color="info"
              small
              @click.stop.prevent="moveMainItem(items, i, -1)"
              v-if="i != 0"
              :class="{ 'mr-7': i == items.length - 1 }"
            >
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>

            <v-btn
              icon
              color="info"
              small
              @click.stop.prevent="moveMainItem(items, i, 1)"
              v-if="i != items.length - 1"
              :class="{ 'ml-7': i == 0 }"
            >
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </v-list-item-icon>
          <!-- // 관리자 -->
        </template>

        <v-list-item
          v-for="(sub, j) in item.subItems"
          :key="`${sub.title}_${j}`"
          :to="editable ? null : sub.to"
        >
          <v-list-item-content>
            <v-list-item-title v-text="sub.title"></v-list-item-title>
          </v-list-item-content>
          <!-- 관리자 -->
          <v-list-item-icon v-if="editable" class="pr-7">
            <v-btn
              icon
              color="primary"
              small
              @click.stop.prevent="openSubDialog(i, j)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              color="error"
              small
              @click.stop.prevent="deleteItem(item.subItems, j)"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn
              icon
              color="info"
              small
              @click.stop.prevent="moveMainItem(item.subItems, j, -1)"
              v-if="j != 0"
              :class="{ 'mr-7': j == item.subItems.length - 1 }"
            >
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>

            <v-btn
              icon
              color="info"
              small
              @click.stop.prevent="moveMainItem(item.subItems, j, 1)"
              v-if="j != item.subItems.length - 1"
              :class="{ 'ml-7': j == 0 }"
            >
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </v-list-item-icon>
          <!-- // 관리자 -->
        </v-list-item>
        <!-- 관리자 -->
        <v-list-item v-if="editable" @click="openSubDialog(i, -1)">
          <v-list-item-icon><v-icon>mdi-plus</v-icon> </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>서브 추가하기</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- // 관리자 -->
      </v-list-group>
      <!-- 관리자 -->
      <v-list-item v-if="editable" @click="openMainDialog(-1)">
        <v-list-item-icon><v-icon>mdi-plus</v-icon> </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>추가하기</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- // 관리자 -->
    </v-list>
    <!-- 관리자 -->
    <v-dialog v-model="main.dialog" max-width="400">
      <v-card>
        <v-card-title>
          {{ main.title }}
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveMainDialog" icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn color="error" @click="main.dialog = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle>
          <v-btn
            text
            small
            class="pa-0"
            color="info"
            href="https://materialdesignicons.com/"
            target="_blank"
            >머터리얼 디자인 아이콘</v-btn
          >
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
            v-model="main.form.icon"
            label="아이콘"
            :prepend-icon="main.form.icon"
            hide-details
          ></v-text-field>

          <v-text-field
            v-model="main.form.title"
            label="타이틀"
            hide-details
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- sub Item Dialog -->
    <v-dialog v-model="sub.dialog" max-width="400">
      <v-card>
        <v-card-title>
          {{ sub.title }}
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveSubDialog" icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn color="error" @click="sub.dialog = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="sub.form.title"
            label="타이틀"
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="sub.form.to"
            label="링크"
            hide-details
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- // 관리자 -->
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  props: ["title", "items"],
  data() {
    return {
      main: {
        dialog: false,
        title: "",
        selectedIdx: -1,
        form: {
          icon: "",
          title: "",
        },
      },
      sub: {
        dialog: false,
        title: "",
        parentIdx: -1,
        selectedIdx: -1,
        form: {
          title: "",
          to: "",
        },
      },
    };
  },
  computed: {
    ...mapState({
      editable: (state) => state.global.editable,
    }),
  },
  methods: {
    ...mapMutations("global", ["setSiteEdit"]),
    openMainDialog(idx) {
      if (idx < 0) {
        this.main.title = "신규 메뉴 추가";
        this.main.form.title = "";
        this.main.form.icon = "mdi-new-box";
      } else {
        let item = this.items[idx];
        this.main.title = `${item.title} 수정`;
        this.main.form.title = item.title;
        this.main.form.icon = item.icon;
      }
      this.main.selectedIdx = idx;
      this.main.dialog = true;
    },
    openSubDialog(parentIdx, idx) {
      let parent = this.items[parentIdx];
      if (idx < 0) {
        this.sub.title = `${parent.title} 서브 추가`;
        this.sub.form.title = "";
        this.sub.form.to = "";
      } else {
        let item = parent.subItems[idx];
        this.sub.title = `${item.title} 수정`;
        this.sub.form.title = item.title;
        this.sub.form.to = item.to;
      }
      this.sub.parentIdx = parentIdx;
      this.sub.selectedIdx = idx;
      this.sub.dialog = true;
    },
    saveMainDialog() {
      if (this.main.selectedIdx < 0) {
        // 신규 메뉴 추가
        this.items.push(this.main.form);
      } else {
        // 기존 메뉴 변경
        this.items[this.main.selectedIdx] = this.main.form;
      }
      this.save();
    },
    saveSubDialog() {
      const parent = this.items[this.sub.parentIdx];
      if (this.sub.selectedIdx < 0) {
        try {
          parent.subItems.push(this.sub.form);
        } catch (e) {
          parent.subItems = [];
          parent.subItems.push(this.sub.form);
        }
      } else {
        parent.subItems[this.sub.selectedIdx] = this.sub.form;
      }
      this.save();
    },
    deleteItem(items, idx) {
      if (confirm(`${items[idx].title} 메뉴를 삭제 하시겠습니까?`)) {
        items.splice(idx, 1);
        this.save();
      }
    },
    moveMainItem(items, i, dir) {
      const item = items.splice(i, 1)[0];
      items.splice(i + dir, 0, item);
      this.save();
    },

    async save() {
      try {
        await this.$firebase
          .database()
          .ref()
          .child("site")
          .child("menu")
          .set(this.items);
      } catch (e) {
        this.$toasted.error(e.message);
      } finally {
        this.main.dialog = false;
        this.sub.dialog = false;
      }
    },
  },
};
</script>

<style>
</style>