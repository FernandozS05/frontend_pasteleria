<template>
  <div class="listado-entregas-view">
    <ListadoEntregas />
  </div>
</template>

<script>
// @ is an alias to /src
import ListadoEntregas from "../../components/Entregas/ListadoEntregas.vue";
import { toast } from "vue3-toastify";

export default {
  name: "ListadoEntregasView",
  components: {
    ListadoEntregas,
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