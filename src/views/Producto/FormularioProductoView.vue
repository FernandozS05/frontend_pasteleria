<template>
    <div class="formulario-producto-view">
      <FormularioProducto />
    </div>
  </template>
  
  <script>
  import FormularioProducto from '@/components/Producto/FormularioProducto.vue';
  export default {
    name: "FormularioProductoView",
    components: {
      FormularioProducto,
    },
    methods: {
    },
  };
  </script>
  