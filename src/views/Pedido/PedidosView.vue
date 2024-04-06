<template>
  <div class="row">
    <BarraNavegacion @cerrarSesion="cerrarSesion"/>
  <div class="row mt-3 border rounded border-4">
    <div class="row">
      <p class="col-6 fs-4 align-items-start  fw-medium subtitulo">Pedidos realizados</p>
      <BarraBusqueda class="col-6 align-items-center" :placeholder="Buscar" @filtrar="filtrarPedidos" />
    </div>
    <div class="row">
      <TablaPedidos :key="updateKey" v-bind:pedidos="pedidosFiltrados" @info="verInformacion" @pagar="irAPago"/>
    </div>
    </div>
  </div>
</template>

<script>
import TablaPedidos from "@/components/Pedido/TablaPedidos.vue";
import BarraBusqueda from "@/components/Barras/BarraBusqueda.vue";
import BarraNavegacion from "@/components/Barras/BarraNavegacion.vue";
import apiCliente from "@/config/ServidorCliente";
import axios from "@/config/axios.js";
import { toast } from 'vue3-toastify';
import toastConf  from "@/config/toast";

export default {
  name: "PedidosView",
  components: {
    TablaPedidos,
    BarraBusqueda,
    BarraNavegacion
  },
  data(){
    return{
      pedidos: [],
      pedidosFiltrados: []
    }
  },
  methods: {
    revisar() {
      const idUsuario = localStorage.getItem("idUsuario");
      return idUsuario < 100 ? false : true;
    },
    verInformacion(index) {
      const idPedido = this.pedidos[index].id;
      localStorage.setItem("idPedido", idPedido);
      this.$router.push("/elementoPedido")
    },
    irAPago(index) {
      const idPedido = this.pedidos[index].id;
      localStorage.setItem("idPedido", idPedido);
      this.$router.push("/tipo-pago")
    },
    consultarPedidos(){
      let url = apiCliente.listarPedidos;
      if(!this.revisar())
        url = url + `?cliente=${localStorage.getItem("idUsuario")}`;

      toast.promise(
                axios.get(url),
                {
                    pending: 'Consultando pedidos...', 
                    success: 'Pedidos obtenidos.', 
                    error: 'No se pudo obtener los pedidos.'
                }, toastConf
            ).then((respuesta) => {
                if (respuesta.status === 200) {
                    this.pedidos = respuesta.data;
                    this.pedidosFiltrados = this.pedidos;
                }
            }).catch((error) => {
                this.manejarError(error);
            });
    },
    manejarError(error) {
      if (error.response) {
        if (error.response.status === 401) {
          this.$router.push("/login");
          toast.error('No autorizado.');
        } else if (error.response.status === 404) {
          toast.error('Información no encontrada.');
        } else {
          toast.error('Error en la solicitud.');
        }
      } else if (error.request) {
        toast.error('Error de red');
      } else {
        toast.error('Error desconocido');
      }
    },
  },
  mounted(){
    this.consultarPedidos();
  }
};
</script>
