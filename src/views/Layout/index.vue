<script setup>
import LayoutNav from './components/LayoutNav.vue';
import LayoutFooter from './components/LayoutFooter.vue';
import LayoutHeader from './components/LayoutHeader.vue';
import LayoutFixed from './components/LayoutFixed.vue';
</script>

<template>
  <div>
    <LayoutFixed></LayoutFixed>
    <LayoutNav></LayoutNav>
    <LayoutHeader></LayoutHeader>
    <router-view></router-view>
    <LayoutFooter></LayoutFooter>
  </div>
</template>