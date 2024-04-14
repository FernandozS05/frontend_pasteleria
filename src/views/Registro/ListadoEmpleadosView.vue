<template>
  <BarraNavegacion />
  <div class="listado-empleados-view">
    <ListadoEmpleados />
  </div>
</template>

<script>
// @ is an alias to /src
import ListadoEmpleados from "../../components/Registro/ListadoEmpleados.vue";
import BarraNavegacion from "../../components/Barras/BarraNavegacion.vue";

export default {
  name: "ListadoEmpleadosView",
  components: {
    ListadoEmpleados,
    BarraNavegacion
  },
  methods: {
  },
};
</script>