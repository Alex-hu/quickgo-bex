<template>
  <q-dialog v-model="visible">
    <q-card class="my-card">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ dialogType == 'EDIT' ? '编辑' : '添加' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <div class="q-pa-md" style="max-width: 480px">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            outlined
            v-model="formModel.label"
            label="名称"
            hint="跳转页面名称"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            outlined
            v-model="formModel.value"
            label="匹配字符串"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            outlined
            v-model="formModel.url"
            label="URL"
            hint="链接地址"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            outlined
            v-model="formModel.env"
            label="环境"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input outlined v-model="formModel.color" label="颜色">
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-color
                    v-model="formModel.color"
                    default-view="palette"
                    format-model="hex"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

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
import { defineComponent, ref, reactive } from 'vue';
import { StorageDrawerData, UriData } from './types';
import { v1 as uuidv1 } from 'uuid';

export default defineComponent({
  name: 'ConfigFormDialog',
  props: {
    onSuccess: {
      type: Function,
      required: false,
    },
  },
  setup(props) {
    const visible = ref(false);
    const dialogType = ref('ADD');
    let formModel = reactive<UriData>({
      id: '',
      label: '',
      url: '',
      value: '',
      env: '',
      color: '',
    });
    const open = (one: UriData) => {
      if (one) {
        dialogType.value = 'EDIT';
        formModel.id = one.id;
        formModel.label = one.label;
        formModel.url = one.url;
        formModel.value = one.value;
        formModel.env = one.env;
        formModel.color = one.color;
      } else {
        formModel.id = uuidv1();
        formModel.label = '';
        formModel.url = '';
        formModel.value = '';
        formModel.env = '';
        formModel.color = '';
        dialogType.value = 'ADD';
      }
      visible.value = true;
    };
    const hide = () => {
      visible.value = false;
    };

    const $q = useQuasar();

    const onSubmit = () => {
      // fetch all data
      $q.bex
        .send('storage.get', { key: QUICKGO_DATA_LIST_KEY })
        .then((res: StorageDrawerData<UriData[]>) => {
          let list = res.data;
          if (dialogType.value === 'EDIT') {
            // find the edit one, then update the data.
            list.forEach((item) => {
              if (item.id === formModel.id) {
                item.label = formModel.label;
                item.url = formModel.url;
                item.label = formModel.label;
                item.value = formModel.value;
                item.env = formModel.env;
                item.color = formModel.color;
                return;
              }
            });
          } else if (dialogType.value === 'ADD') {
            if (!list) {
              list = [];
            }
            list.push(formModel);
          }

          const payload = {
            key: QUICKGO_DATA_LIST_KEY,
            data: list,
          };
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
      formModel,
      onSubmit,

      onReset() {},
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
