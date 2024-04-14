<template>
    <BarraNavegacion />
   <div class="listado-insumos-view">
     <ListadoProductosCatalogo />
   </div>
 </template>
 
 <script>
 // @ is an alias to /src
 import ListadoProductosCatalogo from "@/components/Catalogo/ListadoProductosCatalogo.vue";
 import BarraNavegacion from "../../components/Barras/BarraNavegacion.vue";
 export default {
   name: "ListadoInsumoView",
   components: {
    ListadoProductosCatalogo,
     BarraNavegacion
   },
   methods: {
   },
 };
 </script>
 