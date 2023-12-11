<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { UserFilled, Close} from '@element-plus/icons-vue'
import {useGridLayoutWcStore} from '@/stores/gridLayoutWcStore';
const gridLayoutStore = useGridLayoutWcStore();
const view = ref<any>(null)
const menuOpen = ref<boolean>(false);
const openEdit = () => {
  gridLayoutStore.isEdit = true;
}
const closeEdit = () => {
  gridLayoutStore.isEdit = false;
  gridLayoutStore.resetLayoutDataList();
}
const handleCommand = (command: string | number | object) => {
  if(command === 'add-panel'){
    gridLayoutStore.addPanel();
  }
}
const save = () => {
  gridLayoutStore.saveLayoutDataList();
  gridLayoutStore.isEdit = false;
}

onMounted(()=>{
  document.body.addEventListener('click',(ev:any) => {
    if(ev.target.closest('.menu,.menu-btn')) return
    menuOpen.value = false;
  },false);
})
</script>

<template>
  <header>
    <div class="dis-flex menu-btn" @click="menuOpen = !menuOpen" :menu="menuOpen">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="css-kfbn56"><path d="M3,8H21a1,1,0,0,0,0-2H3A1,1,0,0,0,3,8Zm18,8H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Zm0-5H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"></path></svg>
    </div>
    <el-breadcrumb separator="/" class="dis-flex bread">
    <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
    
  </el-breadcrumb>
   <div class="tool dis-flex">
    <div class="bar dis-flex">
      <el-dropdown trigger="click" v-if="gridLayoutStore.isEdit" @command="handleCommand">
        <button class="css-toolbar-button link dis-flex" aria-label="New" aria-expanded="false">
          <div class="css-Icon-Btn dis-flex"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="css-18ikbw6"><path d="M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z"></path></svg></div>
          <div class="css-Icon-Btn dis-flex"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" class="css-18ikbw6"><path d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59A1,1,0,0,0,17,9.17Z"></path></svg></div>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="add-panel">add panel </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="css-Icon link save" v-if="gridLayoutStore.isEdit" @click="save"><svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" width="18" height="18" class="css-18ikbw6"><path d="M20.71,9.29l-6-6a1,1,0,0,0-.32-.21A1.09,1.09,0,0,0,14,3H6A3,3,0,0,0,3,6V18a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3V10A1,1,0,0,0,20.71,9.29ZM9,5h4V7H9Zm6,14H9V16a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1Zm4-1a1,1,0,0,1-1,1H17V16a3,3,0,0,0-3-3H10a3,3,0,0,0-3,3v3H6a1,1,0,0,1-1-1V6A1,1,0,0,1,6,5H7V8A1,1,0,0,0,8,9h6a1,1,0,0,0,1-1V6.41l4,4Z"></path></svg></div>
      <el-icon class="css-Icon link cancel" v-if="gridLayoutStore.isEdit" @click="closeEdit" :size="18" :color="'#333'" ><Close /></el-icon>
      <div class="css-Icon dis-flex link" v-if="!gridLayoutStore.isEdit" @click="openEdit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="css-18ikbw6"><path d="M21.32,9.55l-1.89-.63.89-1.78A1,1,0,0,0,20.13,6L18,3.87a1,1,0,0,0-1.15-.19l-1.78.89-.63-1.89A1,1,0,0,0,13.5,2h-3a1,1,0,0,0-.95.68L8.92,4.57,7.14,3.68A1,1,0,0,0,6,3.87L3.87,6a1,1,0,0,0-.19,1.15l.89,1.78-1.89.63A1,1,0,0,0,2,10.5v3a1,1,0,0,0,.68.95l1.89.63-.89,1.78A1,1,0,0,0,3.87,18L6,20.13a1,1,0,0,0,1.15.19l1.78-.89.63,1.89a1,1,0,0,0,.95.68h3a1,1,0,0,0,.95-.68l.63-1.89,1.78.89A1,1,0,0,0,18,20.13L20.13,18a1,1,0,0,0,.19-1.15l-.89-1.78,1.89-.63A1,1,0,0,0,22,13.5v-3A1,1,0,0,0,21.32,9.55ZM20,12.78l-1.2.4A2,2,0,0,0,17.64,16l.57,1.14-1.1,1.1L16,17.64a2,2,0,0,0-2.79,1.16l-.4,1.2H11.22l-.4-1.2A2,2,0,0,0,8,17.64l-1.14.57-1.1-1.1L6.36,16A2,2,0,0,0,5.2,13.18L4,12.78V11.22l1.2-.4A2,2,0,0,0,6.36,8L5.79,6.89l1.1-1.1L8,6.36A2,2,0,0,0,10.82,5.2l.4-1.2h1.56l.4,1.2A2,2,0,0,0,16,6.36l1.14-.57,1.1,1.1L17.64,8a2,2,0,0,0,1.16,2.79l1.2.4ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z"></path></svg></div>
      <el-icon class="css-Icon user link" :size="18" :color="'#333'"><UserFilled /></el-icon>
    </div>
   </div>
  </header>
  <div class="menu" :open="menuOpen">
    <div class="wrapperdis-flex">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <!-- <RouterLink to="/about">About</RouterLink> -->
      </nav>
    </div>
  </div>
  <RouterView ref="view" />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  padding: 5px 7px;
  background: #efefef;
  border-bottom: 1px solid #dbdbdb;
  
}
.wrapper{
  display: flex;
  align-items: center;
}
nav {
  margin-top: 20px;
  width: 100%;
  font-size: 12px;
}
nav a {
  display: block;
  height: 30px;
  padding: 0 1rem;
  font-size: 16px;
  margin: 0px 4px;
  border-radius: 5px;
}
nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: #e6e6e6;

}



nav a:first-of-type {
  border: 0;
}
.link {
  cursor: pointer;
  padding:3px;
  min-width: 30px;
  min-height: 30px;
  justify-content: center;
  border-radius: 5px;
}
.link:hover {
  opacity: 0.7;
  background-color: #dbdbdb;
}
.css-toolbar-button {
  display: flex;
  border:none;
  background-color: transparent;
  margin: 0px 10px;
}
.css-Icon {
  display: flex;
  align-items: center;
  margin:0px 5px;
}
</style>
