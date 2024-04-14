<template>
   <BarraNavegacion />
  <div class="listado-insumos-view">
    <ListadoInsumo />
  </div>
</template>

<script>
// @ is an alias to /src
import ListadoInsumo from "../../components/Inventario/ListadoInsumo.vue";
import { toast } from "vue3-toastify";
import BarraNavegacion from "../../components/Barras/BarraNavegacion.vue";
export default {
  name: "ListadoInsumoView",
  components: {
    ListadoInsumo,
    BarraNavegacion
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
