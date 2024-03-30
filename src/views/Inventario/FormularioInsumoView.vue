<template>
  <div class="formulario-insumo-view">
    <FormularioInsumo />
  </div>
</template>

<script>
// @ is an alias to /src
import FormularioInsumo from "../../components/Inventario/FormularioInsumo.vue";
import { toast } from "vue3-toastify";

export default {
  name: "FormularioInsumoView",
  components: {
    FormularioInsumo,
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
