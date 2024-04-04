<template>
  <div class="registro-empleado-view">
    <RegistroEmpleado />
  </div>
</template>

<script>
// @ is an alias to /src
import RegistroEmpleado from "../../components/Registro/RegistroEmpleado.vue";
import { toast } from "vue3-toastify";

export default {
  name: "RegistroEmpleadoView",
  components: {
    RegistroEmpleado,
  },
  methods: {
    irAlCatalogo() {
      this.$router.push("/catalogo");
    },
    notify() {
      toast("Wow so easy !", {
        autoClose: 1000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },
  },
};
</script>
