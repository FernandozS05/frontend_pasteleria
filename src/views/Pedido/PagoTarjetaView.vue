<template>
  <div class="pago-tarjeta-view">
    <PagoTarjeta />
  </div>
</template>

<script>
// @ is an alias to /src
import PagoTarjeta from "@/components/Pedido/PagoTarjeta.vue";
import { toast } from "vue3-toastify";

export default {
  name: "PagoTarjetaView",
  components: {
    PagoTarjeta,
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
