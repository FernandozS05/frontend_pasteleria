<template>
    <div class="modificar-datos-empleado-view">
      <ModificarDatosEmpleado />
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import ModificarDatosEmpleado from "../../components/Registro/ModificarDatosEmpleado.vue";
  import { toast } from "vue3-toastify";
  
  export default {
    name: "ModificarDatosEmpleadoView",
    components: {
      ModificarDatosEmpleado,
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
  