<template>
  <div class="row">
    <BarraNavegacion @cerrarSesion="cerrarSesion" />
    <div class="row mt-3 border rounded border-4">
      <div class="row align-items-center my-3">
        <div class="col-3">
          <p class="fs-4 fw-medium">Pedidos realizados</p>
        </div>
        <div v-if="this.tipo == 'empresa'" class="col-5 mt-1">
          <p class="fs-5">{{ `Datos obtenidos del ${this.fechaInicioActual ? this.fechaInicioActual : " "} al
            ${this.fechaFinalActual ? this.fechaFinalActual : " "}` }}</p>
        </div>
        <div v-if="this.tipo == 'empresa'" class="col-2">
          <button class="btn btn-primary btn-sm" @click="consultarFechas">
            Cambiar fechas
          </button>
        </div>
        <div class="col-md-2">
          <BarraBusqueda :placeholder="'Buscar'" @filtrar="filtrarPedidos" />
        </div>
      </div>
      <div class="row">
        <TablaPedidos :key="updateKey" v-bind:pedidos="pedidosFiltrados" @info="verInformacion" @pagar="irAPago" />
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
import toastConf from "@/config/toast";
import Swal from "sweetalert2";
export default {
  name: "PedidosView",
  components: {
    TablaPedidos,
    BarraBusqueda,
    BarraNavegacion
  },
  data() {
    return {
      pedidos: [],
      pedidosFiltrados: [],
      fechaInicioActual: null,
      fechaFinalActual: null,
      fechaInicio: "2024-04-01",
      fechaFinal: "2024-12-31",
    }
  },
  methods: {
    async obtenerFechas() {
      try {
        const { value: formValues } = await Swal.fire({
          title: 'Selecciona el rango de fechas',
          html: '<label for="swal-input1">Fecha inicio</label>' +
            '<input id="swal-input1" type="date" class="swal2-input">' +
            '<label for="swal-input2">Fecha final</label>' +
            '<input id="swal-input2" type="date" class="swal2-input">',
          focusConfirm: false,
          confirmButtonText: 'Consultar',
          preConfirm: () => {
            let fechaInicio = document.getElementById('swal-input1').value;
            let fechaFinal = document.getElementById('swal-input2').value;

            if (!fechaInicio || !fechaFinal) {
              Swal.showValidationMessage("Ambas fechas deben ser seleccionadas");
              return false;
            }

            if (new Date(fechaInicio) > new Date(fechaFinal)) {
              Swal.showValidationMessage("La fecha de fin debe ser posterior a la fecha de inicio");
              return false;
            }

            return [fechaInicio, fechaFinal];
          }
        });

        if (formValues) {
          this.fechaInicio = formValues[0];
          this.fechaFinal = formValues[1];
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error al obtener las fechas: ', error);
        return false;
      }
    },
    async consultarFechas() {
      if (await this.obtenerFechas()) {
        this.consultarPedidos();
      }
    },
    async definirTipo() {
      const tipo = localStorage.getItem("tipoUsuario");

      if (!tipo) {

        this.$router.push("/login");
        return;
      }
      this.tipo = tipo;
    },
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
    async consultarPedidos() {
      let url = apiCliente.listarPedidos + `?fechaInicio=${this.fechaInicio}&fechaFinal=${this.fechaFinal}`;
      console.log(url);
      toast.promise(
        axios.get(url),
        {
          pending: 'Consultando pedidos...',
          success: 'Pedidos obtenidos.',
          error: 'No se pudo obtener los pedidos.'
        }, toastConf
      ).then((respuesta) => {
        if (respuesta.status === 200) {
          this.fechaInicioActual = this.fechaInicio;
          this.fechaFinalActual = this.fechaFinal;
          this.pedidos = respuesta.data;
          this.pedidosFiltrados = this.pedidos;

          if(!this.pedidos.length > 0) {
            Swal.fire({
                title: 'No hay resultados',
                text: 'No se encontraron pedidos en las fechas especificadas.',
                icon: 'warning',
                confirmButtonText: 'Entendido'
              });
          }
          if (this.tipo == 'empresa') {
            const hoy = new Date();
            const tresDiasDespues = new Date(hoy);
            tresDiasDespues.setDate(hoy.getDate() + 2);

            const pedidoProximo = this.pedidos.find(pedido => {
              const fechaEntrega = new Date(pedido.Entrega.fecha_entrega);
              return fechaEntrega <= tresDiasDespues;
            });

            if (pedidoProximo) {
              Swal.fire({
                title: '¡Atención!',
                text: 'Algunos pedidos tienen una fecha de entrega dentro de dos días.',
                icon: 'warning',
                confirmButtonText: 'Entendido'
              });
            }
          }
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
    filtrarPedidos(idPedido) {
      if (!idPedido) {
        this.pedidosFiltrados = this.pedidos; // Si no hay ID, muestra todos los pedidos
      } else {
        this.pedidosFiltrados = this.pedidos.filter(pedido => pedido.id.toString().includes(idPedido.toString())); // Filtra por ID
      }
    }
  },
  mounted() {
    this.fechaInicioActual = this.fechaInicio;
    this.fechaFinalActual = this.fechaFinal;
    this.definirTipo();
    this.consultarPedidos();

  }
};
</script>
