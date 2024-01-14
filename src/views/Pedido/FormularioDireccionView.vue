<template>
  <div class="formulario-direccion-view">
    <FormularioDireccion />
  </div>
</template>

<script>
// @ is an alias to /src
import FormularioDireccion from "@/components/Pedido/FormularioDireccion.vue";
import { toast } from "vue3-toastify";

export default {
  name: "FormularioDireccionView",
  components: {
    FormularioDireccion,
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
