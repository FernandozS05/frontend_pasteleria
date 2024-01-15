<template>
    <div class="row">
      <BarraNavegacion @cerrarSesion="cerrarSesion"/>
    </div>
    <div class="row">
      <DetallesPedido />
    </div>
</template>

<script>
// @ is an alias to /src
import DetallesPedido from "@/components/Pedido/DetallesPedido.vue";
import BarraNavegacion from "@/components/Barras/BarraNavegacion.vue";
import { toast } from "vue3-toastify";

export default {
  name: "DetallesPedidoView",
  components: {
    DetallesPedido,
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
