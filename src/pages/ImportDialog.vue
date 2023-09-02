<template>
  <q-dialog v-model="visible">
    <q-card class="my-card">
      <q-card-section class="row items-center">
        <div class="text-h6">导入</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <div class="q-pa-md" style="max-width: 480px">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            v-model="importData"
            filled
            clearable
            type="textarea"
            color="red-12"
            label="请导入json格式列表数据"
            :shadow-text="textareaShadowText"
          />

          <div>
            <q-btn label="提交" type="submit" color="primary" />
            <q-btn
              label="重置"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { QUICKGO_DATA_LIST_KEY } from 'src/service/storageKey';
import { defineComponent, ref } from 'vue';
import { StorageDrawerData, UriData } from './types';
import { v1 as uuidv1 } from 'uuid';

export default defineComponent({
  name: 'ImportDialog',
  props: {
    onSuccess: {
      type: Function,
      required: false,
    },
  },
  computed: {
    textareaShadowText() {
      if (typeof this.importData !== 'string' || this.importData.length === 0) {
        return `[{
    label: '名称',
    url: 'http://url?serialNo=',
    value: 'MT',
    env: '生产',
    color: 'red',
  }]
  `;
      }
      return '';
    },
  },
  setup(props) {
    const visible = ref(false);
    const dialogType = ref('ADD');
    let importData = ref('');

    const open = () => {
      dialogType.value = 'EDIT';
      importData.value = '';
      visible.value = true;
    };

    const hide = () => {
      visible.value = false;
    };

    const $q = useQuasar();

    const onSubmit = () => {
      let impDataList: UriData[] = [];
      try {
        impDataList = JSON.parse(importData.value);
      } catch (e) {
        console.log(e);
        return;
      }
      if (!Array.isArray(impDataList)) {
        return;
      }
      console.log(impDataList);

      // fetch all data
      $q.bex
        .send('storage.get', { key: QUICKGO_DATA_LIST_KEY })
        .then((res: StorageDrawerData<UriData[]>) => {
          // 已有数据
          let list = res.data || [];
          let newList: UriData[] = [];
          impDataList.forEach((impt) => {
            let hasMatched = false;
            list.forEach((item) => {
              if (item.url === impt.url) {
                item.label = impt.label;
                item.value = impt.value;
                item.env = impt.env;
                item.color = impt.color;
                hasMatched = true;
                return;
              }
            });
            if (!hasMatched) {
              impt.id = uuidv1();
              newList.push(impt);
            }
          });

          list.push(...newList);
          const payload = {
            key: QUICKGO_DATA_LIST_KEY,
            data: list,
          };
          // console.log(payload);
          $q.bex
            .send('storage.set', payload)
            .then((res: StorageDrawerData<UriData[]>) => {
              props.onSuccess?.apply(res.data);
              hide();
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    };

    return {
      visible,
      dialogType,
      name: '',
      age: 10,
      accept: '',
      importData,
      onSubmit,

      onReset() {
        importData.value = '';
      },
      open,
      hide,
    };
  },
});
</script>

<style lang="sass" scoped>
.my-card
  width: 500px
</style>
