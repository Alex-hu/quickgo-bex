<template>
  <div class="q-pa-md">
    <q-table
      title="跳转配置"
      :rows="listData"
      :columns="columns"
      row-key="name"
      @row-dblclick="dblclick"
    >
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space style="margin: 5px" />
        <q-btn
          color="primary"
          icon-right="archive"
          label="添加"
          no-caps
          @click="add"
        />
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn dense color="primary" icon="edit" @click="edit(props.row)" />
            <q-btn
              dense
              color="red"
              icon="delete"
              @click="showDelConfirm(props.row)"
            />
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm">确定要删除该项?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn
            flat
            label="删除"
            color="primary"
            @click="delItem"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <ConfigFormDialog ref="dialogComp" :onSuccess="refresh"></ConfigFormDialog>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { StorageDrawerData, UriData } from './types';
import ConfigFormDialog from './ConfigFormDialog.vue';
import { useQuasar } from 'quasar';
import { QUICKGO_DATA_LIST_KEY } from 'src/service/storageKey';

export default defineComponent({
  name: 'ConfigPage',
  components: {
    ConfigFormDialog,
  },
  setup() {
    const columns = [
      {
        name: 'label',
        required: true,
        label: '名称',
        align: 'center',
        field: 'label',
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        align: 'center',
        label: '匹配条件',
        field: 'value',
        sortable: true,
      },
      {
        name: 'url',
        required: true,
        align: 'center',
        label: 'URL',
        style:
          'max-width: 250px;overflow:hidden; white-space:nowrap; text-overflow:ellipsis',
        field: 'url',
        sortable: true,
      },
      {
        name: 'env',
        align: 'center',
        label: '环境',
        style:
          'max-width: 400px;overflow:hidden; white-space:nowrap; text-overflow:ellipsis',
        field: 'env',
      },
      { name: 'color', align: 'center', label: '颜色', field: 'color' },
      {
        name: 'action',
        align: 'center',
        label: 'Action',
        field: 'action',
        sortable: true,
      },
    ];

    const dialogComp = ref();

    const add = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      dialogComp.value?.open();
    };
    const edit = (row: UriData) => {
      console.log('row:', row);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      dialogComp.value.open(row);
    };

    // confirm dialog open status.
    const showConfirm = ref(false);
    const seleted = ref<UriData>();
    const showDelConfirm = (row: UriData) => {
      showConfirm.value = true;
      seleted.value = row;
    };

    let rows = ref<UriData[]>([]);
    const $q = useQuasar();
    const refresh = () => {
      void $q.bex
        .send('storage.get', { key: QUICKGO_DATA_LIST_KEY })
        .then((res: StorageDrawerData<UriData[]>) => {
          rows.value = res.data;
        });
    };
    refresh();

    const delItem = () => {
      rows.value.forEach((item, index) => {
        if (item.id === seleted.value?.id) {
          rows.value.splice(index, 1);
          return;
        }
      });

      const payload = {
        key: QUICKGO_DATA_LIST_KEY,
        data: rows.value,
      };
      $q.bex
        .send('storage.set', payload)
        .then(() => {
          refresh();
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const dblclick = (_: Event, row: UriData) => {
      edit(row);
    };

    const filter = ref('');
    const listData = computed(() => {
      if (filter.value) {
        return rows.value.filter(
          (item) =>
            item.label.indexOf(filter.value) > -1 ||
            (item.url && item.url.indexOf(filter.value) > -1) ||
            item.value.indexOf(filter.value) > -1 ||
            (item.env && item.env.indexOf(filter.value) > -1)
        );
      } else {
        return rows.value;
      }
    });

    return {
      filter,
      separator: '',
      mode: 'list',
      columns,
      rows,
      add,
      edit,
      showDelConfirm,
      dialogComp,
      refresh,
      showConfirm,
      delItem,
      dblclick,
      listData,
    };
  },
});
</script>
