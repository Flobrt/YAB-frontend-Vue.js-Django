<!-- <script setup>
import { RouterLink, RouterView } from 'vue-router'

</script> -->

<!-- <template>

  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      <nav>
        <RouterLink to="/apprenants">Apprenants</RouterLink> |&nbsp
        <RouterLink to="/briefs">Briefs</RouterLink>
      </nav>
  </header>
  <RouterView />
  
</template>  -->

<!-- <template>
    <header>
        <div class="tool">
            <v-toolbar color="#1d284f" prominent elevation="5">
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
            <v-toolbar-title>BINOMOTRON</v-toolbar-title>
            
            </v-toolbar>
        </div>
    </header>
    <RouterView />
</template>
    

<style>
.menu{
  opacity:0.8;  
}
body{
    background-color:#00A8A4;
}
</style> -->

<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
    <header>
        <nav>
        <v-toolbar color="#1d284f" prominent elevation="5">
            <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
            <v-toolbar-title>Binomotron</v-toolbar-title>
            <RouterLink class="menu" to="/apprenants">Apprenants</RouterLink> &nbsp
            <RouterLink class="menu" to="/briefs">Briefs</RouterLink> &nbsp
        </v-toolbar>
        </nav>
    </header>
    <RouterView />
</template> 
   

<style>

body{
    background-color:#00A8A4;
}
.v-toolbar-title {
  font-size: 150% !important;
  color: aliceblue;
  
}
.menu {
    color: white;
    text-decoration:none;
}
</style>