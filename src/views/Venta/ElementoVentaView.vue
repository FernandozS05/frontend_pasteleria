<template>
  <div class="elemento-venta-view">
    <ElementoVenta />
  </div>
</template>

<script>
// @ is an alias to /src
import ElementoVenta from "@/components/Venta/ElementoVenta.vue";
import { toast } from "vue3-toastify";

export default {
  name: "ElementoVentaView",
  components: {
    ElementoVenta,
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
