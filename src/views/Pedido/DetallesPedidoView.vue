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

export default {
  name: "DetallesPedidoView",
  components: {
    DetallesPedido,
    BarraNavegacion
  },
  methods: {    
  },
};
</script>
