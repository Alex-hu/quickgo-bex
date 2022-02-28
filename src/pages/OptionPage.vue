<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawerToggled"
        />

        <q-toolbar-title> Guick Go App </q-toolbar-title>

        <div>Power By Hzy, v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> 菜单 </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import EssentialLink from 'components/EssentialLink.vue';
import { StorageDrawerData, ToggleStatus } from './types';
import { DRAWER_TOGGLE_STATUS_KEY } from 'src/service/storageKey';

export default defineComponent({
  name: 'OptionPage',

  components: {
    EssentialLink,
  },
  setup() {
    const linksList = [
      {
        title: '配置',
        caption: '跳转链接配置',
        icon: 'school',
        link: '/config',
      },
    ];

    const leftDrawerOpen = ref(false);
    const $q = useQuasar();
    $q.bex
      .send('storage.get', { key: DRAWER_TOGGLE_STATUS_KEY })
      .then((res: StorageDrawerData<ToggleStatus>) => {
        if (res.data) {
          leftDrawerOpen.value = res.data.open;
        } else {
          console.log(res);
        }
      })
      .catch((e) => {
        console.log(e);
      });

    const drawerToggled = () => {
      const payload = {
        key: DRAWER_TOGGLE_STATUS_KEY,
        data: {
          open: !leftDrawerOpen.value,
        },
      };
      $q.bex
        .send('storage.set', payload)
        .then((res: StorageDrawerData<ToggleStatus>) => {
          leftDrawerOpen.value = res.data.open;
        })
        .catch((e) => {
          console.log(e);
        });
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      drawerToggled,
    };
  },
});
</script>
