<script setup lang="ts">
import SideBar from '@/components/SideBar.vue';
import TopBar from '@/components/TopBar.vue';
</script>

<template>
    <SideBar />
    <TopBar />
    <router-view />
</template>

<style scoped></style>