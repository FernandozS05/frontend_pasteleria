<template>
    <div class="row">
      <BarraNavegacion @cerrarSesion="cerrarSesion"/>
    </div>
    <div class="row">
      <ModificarEntrega />
    </div>
</template>

<script>
// @ is an alias to /src
import ModificarEntrega from '@/components/Pedido/ModificarEntrega.vue'
import BarraNavegacion from "@/components/Barras/BarraNavegacion.vue";

export default {
  name: "DetallesPedidoView",
  components: {
    ModificarEntrega,
    BarraNavegacion
  },
  methods: {
  },
};
</script>
