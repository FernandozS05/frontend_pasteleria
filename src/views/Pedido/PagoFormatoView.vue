<template>
  <div class="pago-formato-view">
    <PagoFormato />
  </div>
</template>

<script>
// @ is an alias to /src
import PagoFormato from "@/components/Pedido/PagoFormato.vue";
import { toast } from "vue3-toastify";

export default {
  name: "PagoFormatoView",
  components: {
    PagoFormato,
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
