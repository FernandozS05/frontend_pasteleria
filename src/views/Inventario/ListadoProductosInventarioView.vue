<template>
    <BarraNavegacion />
   <div class="listado-insumos-view">
     <ListadoProductosInventario />
   </div>
 </template>
 
 <script>
 // @ is an alias to /src
 import ListadoProductosInventario from "@/components/Inventario/ListadoProductosInventario.vue";
 import BarraNavegacion from "../../components/Barras/BarraNavegacion.vue";
 export default {
   name: "ListadoInsumoView",
   components: {
    ListadoProductosInventario,
     BarraNavegacion
   },
   methods: {
   },
 };
 </script>
 