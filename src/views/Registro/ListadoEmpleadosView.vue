<template>
    <div class="listado-empleados-view">
      <ListadoEmpleados />
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import ListadoEmpleados from "../../components/Registro/ListadoEmpleados.vue";
  import { toast } from "vue3-toastify";
  
  export default {
    name: "ListadoEmpleadosView",
    components: {
      ListadoEmpleados,
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
  