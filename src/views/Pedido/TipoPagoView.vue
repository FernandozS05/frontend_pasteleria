<template>
    <div class="row">
      <BarraNavegacion @cerrarSesion="cerrarSesion"/>
    </div>
    <div class="row">
      <TipoPago/>
    </div>
</template>

<script>
// @ is an alias to /src
import BarraNavegacion from "@/components/Barras/BarraNavegacion.vue";
import TipoPago from "@/components/Pedido/TipoPago.vue";
import { toast } from "vue3-toastify";

export default {
  name: "DetallesPedidoView",
  components: {
    BarraNavegacion,
    TipoPago
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
