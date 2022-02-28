<template>
  <div class="q-pa-md" :style="{ width: '400px', height: height + 'px' }">
    <q-bar dark class="bg-primary text-white">
      <div v-if="!isFF" class="cursor-pointer" @click="openShortcuts">
        快捷键
      </div>
      <div class="cursor-pointer" @click="openOptoinal">选项</div>
    </q-bar>
    <!-- <div class="q-gutter-md"> -->
    <q-select
      ref="selectRef"
      filled
      autofocus
      v-model="search"
      clearable
      use-input
      bottom-slots
      input-debounce="500"
      label="流水号"
      :options="options"
      @filter="filterFn"
      @popup-show="popupShow"
      @popup-hide="popupHide"
      @input-value="inputValue"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
      <template v-slot:append>
        <q-icon name="search" />
      </template>
      <template v-slot:option="scope">
        <q-item
          v-bind="scope.itemProps"
          :style="{
            'background-color': getColor(scope.opt),
          }"
        >
          <!-- <q-item-section avatar>
                <q-icon :name="scope.opt.icon" />
              </q-item-section> -->
          <q-item-section>
            <q-item-label
              >{{ scope.opt.label }}-{{ scope.opt.env }}</q-item-label
            >
            <q-item-label caption>{{ scope.opt.url }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:hint> 根据流水号快速定位详情页面 </template>
    </q-select>
    <!-- </div> -->
  </div>
</template>
<script lang="ts">
import { QSelect, useQuasar } from 'quasar';
import { QUICKGO_DATA_LIST_KEY } from 'src/service/storageKey';
import { defineComponent, ref, watch } from 'vue';
import { StorageDrawerData, UriData } from './types';
import defaultCandidates from 'src/service/defaultData';

export default defineComponent({
  name: 'PopupPage',
  setup() {
    const search = ref(null) as unknown as UriData;
    let candidates: UriData[] = [];
    candidates = defaultCandidates;
    const options = ref(candidates);
    const $q = useQuasar();
    const refresh = () => {
      $q.bex
        .send('storage.get', { key: QUICKGO_DATA_LIST_KEY })
        .then((res: StorageDrawerData<UriData[]>) => {
          candidates = res.data as UriData[];
          if (candidates) {
            candidates = defaultCandidates.concat(candidates);
          } else {
            candidates = defaultCandidates;
          }
          console.table(candidates);
          options.value = candidates;
        });
    };
    refresh();

    // the select component ref.
    const selectRef = ref();

    // filter by input string.
    const filterFn = (
      val: string,
      doneFn: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void
    ) => {
      // if empty, show all candidates.
      if (!val) {
        doneFn(() => {
          options.value = candidates;
        });

        return;
      }
      // only show match the pattern item.
      doneFn(() => {
        const data = [] as UriData[];
        candidates.forEach((item: UriData) => {
          if (val.search(item.value) >= 0) {
            data.push(item);
          }
        });
        options.value = data;
        selectRef.value.moveOptionSelection(0);
      });
    };
    // input text.
    const searchText = ref('');

    // update input string.
    const inputValue = (value: string) => {
      if (value) {
        searchText.value = value;
      }
      selectRef.value.showPopup();
    };

    // open a tab.
    watch(search, (newX: UriData) => {
      if (searchText.value) {
        $q.bex
          .send('tab.open', { url: newX.url + searchText.value })
          .catch((e) => {
            console.log(e);
          });
      }
    });

    // resize the popup div height.
    const height = ref(110);
    const popupShow = () => {
      const lenght = candidates.length > 6 ? 6 : candidates.length;
      height.value = lenght * 67 + 110;
    };
    const popupHide = () => {
      height.value = 110;
    };

    const isFF = navigator.userAgent.indexOf('Firefox') > -1;

    const openShortcuts = () => {
      let url = 'chrome://extensions/shortcuts';
      $q.bex.send('tab.open', { url: url }).catch((e) => {
        console.log(e);
      });
    };

    const openOptoinal = () => {
      $q.bex.send('tab.open', { url: 'www/index.html#/options' }).catch((e) => {
        console.log(e);
      });
    };

    const getColor = (data: UriData) => {
      if (data && data.color) {
        return data.color;
      }
      return 'white';
    };
    return {
      search,
      options,
      height,
      filterFn,
      selectRef,
      isFF,
      popupShow,
      popupHide,
      inputValue,
      openShortcuts,
      openOptoinal,
      getColor,
    };
  },
});
</script>
