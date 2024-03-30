<template>
  <div class="tabla-entregas-view">
    <TablaEntregas />
  </div>
</template>

<script>
// @ is an alias to /src
import TablaEntregas from "../../components/Entregas/TablaEntregas.vue";
import { toast } from "vue3-toastify";

export default {
  name: "TablaEntregasView",
  components: {
    TablaEntregas,
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
