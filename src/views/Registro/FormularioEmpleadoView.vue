<template>
  <BarraNavegacion/>
  <div class="registro-empleado-view">
    <FormularioEmpleado />
  </div>
</template>

<script>

import FormularioEmpleado from '@/components/Registro/FormularioEmpleado.vue';
import BarraNavegacion from "../../components/Barras/BarraNavegacion.vue";
export default {
  name: "RegistroEmpleadoView",
  components: {
    FormularioEmpleado,
    BarraNavegacion
  },
  methods: {
    irAlCatalogo() {
      this.$router.push("/catalogo");
    }
  },
};
</script>
