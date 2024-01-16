<template>
  <div class="row">
    <BarraNavegacion @cerrarSesion="cerrarSesion" />
  </div>
  <div class="row">
      <BarraFecha class="mt-3 col-6 align-items-center" :placeholder="Buscar" @filtrarVentas="filtrarVentasFecha" />
  </div>
  <div class="row">
    <ReporteVentas v-bind:ventas="this.ventasFiltradas" />
  </div>
</template>

<script>
// @ is an alias to /src
import BarraNavegacion from "@/components/Barras/BarraNavegacion.vue";
import ReporteVentas from "@/components/Venta/ReporteVentas.vue";
import BarraFecha from "../../components/Barras/BarraFecha.vue";
import apiUsuario from "@/config/ServidorEmpleado";
import axios from 'axios';
import { toast } from 'vue3-toastify';
import toastConf from "@/config/toast";
export default {
  name: "ReporteVentasView",
  components: {
    ReporteVentas,
    BarraFecha,
    BarraNavegacion
  },
  data() {
    return {
      ventas: [],
      ventasFiltradas: []
    }
  },
  methods: {
    notify() {
      toast("Wow so easy !", {
        autoClose: 1000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    },
    consultarVentas() {
      const url = apiUsuario.consultarVentas;
      console.log(url);
      // Usar toast.promise para mostrar un toast mientras la promesa está pendiente
      toast.promise(
        axios.get(url, { withCredentials: true }),
        {
          pending: 'Consultando ventas...', // Mensaje mientras la promesa está pendiente
          success: 'Ventas obtenidas.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'No se pudieron obtener las ventas.', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then((respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Consulta completada');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {
          console.log(respuesta.data)
          this.ventas = respuesta.data;
          this.formatearFechas();
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
    ,
    formatearFechas() {
      this.ventas.forEach(venta => venta.fechaVenta = venta.fechaVenta.slice(0, 10));
      this.ventasFiltradas = this.ventas;
    }
    ,
    filtrarVentas(texto) {
      this.ventasFiltradas = this.ventas.filter((venta) =>
        venta.nombre.toLowerCase().includes(texto.toLowerCase())
      );
    },
    filtrarVentasFecha(fechas) {
      console.log(fechas);
      // Convertir las fechas de rango1 y rango2 a objetos Date
      const fechaInicio = new Date(fechas.inicio);
      const fechaFin = new Date(fechas.fin);

      // Filtrar las ventas que estén dentro del rango de fechas
      this.ventasFiltradas = this.ventas.filter((venta) => {
        const fechaVenta = new Date(venta.fechaVenta);
        return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
      });

      console.log(this.ventasFiltradas);
    }

  },
  mounted() {
    this.consultarVentas();
  }
};
</script>
