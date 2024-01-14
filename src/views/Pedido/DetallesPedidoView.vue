<template>
  <div class="detalles-pedido-view">
    <DetallesPedido />
  </div>
</template>

<script>
// @ is an alias to /src
import DetallesPedido from "@/components/Pedido/DetallesPedido.vue";
import { toast } from "vue3-toastify";

export default {
  name: "DetallesPedidoView",
  components: {
    DetallesPedido,
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
