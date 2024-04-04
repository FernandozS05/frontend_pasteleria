<template>
    <div class="tabla-empleados-view">
      <TablaEmpleados />
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import TablaEmpleados from "../../components/Registro/TablaEmpleados.vue";
  import { toast } from "vue3-toastify";
  
  export default {
    name: "TablaEmpleadosView",
    components: {
      TablaEmpleados,
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
  