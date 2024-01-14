<template>
  <div class="row">
    <BarraNavegacion @cerrarSesion="cerrarSesion"/>
  <div class="row mt-3 border rounded border-4">
    <div class="row">
      <p class="col-6 fs-4 align-items-start  fw-medium subtitulo">Pedidos realizados</p>
      <BarraBusqueda class="col-6 align-items-center" :placeholder="Buscar" @filtrar="filtrarPedidos" />
    </div>
    <div class="row">
      <TablaPedidos :key="updateKey" v-bind:pedidos="pedidosFiltrados" />
    </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import TablaPedidos from "@/components/Pedido/TablaPedidos.vue";
import BarraBusqueda from "@/components/Barras/BarraBusqueda.vue";
import BarraNavegacion from "@/components/Barras/BarraNavegacion.vue";
import apiCliente from "@/config/ServidorCliente";
import axios from 'axios';
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
    notify() {
      toast("Wow so easy !", {
        autoClose: 1000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },
    consultarPedidos(){
      const url = apiCliente.listarPedidos + `?cliente=${localStorage.getItem("idUsuario")}`;
      
      toast.promise(
                axios.get(url, { withCredentials: true }),
                {
                    pending: 'Consultando pedidos...', // Mensaje mientras la promesa está pendiente
                    success: 'Pedidos obtenidos.', // Mensaje cuando la promesa se resuelve con éxito
                    error: 'No se pudo obtener los pedidos.', // Mensaje cuando la promesa es rechazada
                }, toastConf
            ).then((respuesta) => {
                // Puedes realizar acciones adicionales después de que la promesa se resuelva
                // (opcional dependiendo de tus necesidades)
                console.log('Consulta completada');

                // Realizar acciones adicionales según la respuesta exitosa
                if (respuesta.status === 200) {
                    console.log(respuesta.data)
                    this.pedidos = respuesta.data;
                    this.pedidosFiltrados = this.pedidos;
                }
            }).catch((error) => {
                // Manejar errores de la petición
                if (error.response) {
                    console.error('Mensaje del servidor:', error.response.data.error);

                    if (error.response.status === 401) {
                        toast.error('No autorizado.', toastConf);
                    }
                    if (error.response.status === 404) {
                        toast.error('Informacion no encontrada.', toastConf);
                    }
                } else if (error.request) {
                    // La solicitud fue realizada, pero no se recibió respuesta
                    console.error('No se recibió respuesta del servidor');
                    toast.error('Error de red', toastConf);
                } else {
                    // Algo sucedió al configurar la solicitud que desencadenó un error
                    console.error('Error de configuración de la solicitud', error);
                    toast.error('Error desconocido', toastConf);
                }
            });
    }
  },
  mounted(){
    this.consultarPedidos();
  }
};
</script>
