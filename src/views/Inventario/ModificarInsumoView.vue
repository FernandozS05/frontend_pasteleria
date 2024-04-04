<template>
    <div class="modificar-insumo-view">
      <ModificarInsumo />
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import ModificarInsumo from "../../components/Inventario/ModificarInsumo.vue";
  import { toast } from "vue3-toastify";
  
  export default {
    name: "ModificarInsumoView",
    components: {
      ModificarInsumo,
    },
    methods: {
      notify() {
        toast("Wow so easy !", {
          autoClose: 1000,
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
    },
  };
  </script>
  