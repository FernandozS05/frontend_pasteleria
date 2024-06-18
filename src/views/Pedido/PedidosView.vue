<template>
  <div class="row">
    <BarraNavegacion @cerrarSesion="cerrarSesion" />
    <div class="row mt-3 border rounded border-4">
      <div class="row align-items-center my-3">
        <div class="col-3">
          <p class="fs-4 fw-medium">Pedidos realizados</p>
        </div>
        <div v-if="this.tipo == 'empresa'" class="col-5 mt-1">
          <p class="fs-5">{{ `Datos obtenidos del ${this.fechaInicioActual ? this.fechaInicioActual : " "} al ${this.fechaFinalActual ? this.fechaFinalActual : " "}` }}</p>
        </div>
        <div v-if="this.tipo == 'empresa'" class="col-2">
          <button class="btn btn-primary btn-sm" @click="consultarFechas">
            Consultar por dias
          </button>
          <button class="btn btn-primary btn-sm mt-1" @click="consultarUnDia">
            Consultar un día
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
      tipo: ''
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
    async obtenerUnDia() {
      try {
        const { value: fecha } = await Swal.fire({
          title: 'Selecciona la fecha',
          html: '<label for="swal-input">Fecha</label>' +
            '<input id="swal-input" type="date" class="swal2-input">',
          focusConfirm: false,
          confirmButtonText: 'Consultar',
          preConfirm: () => {
            let fecha = document.getElementById('swal-input').value;

            if (!fecha) {
              Swal.showValidationMessage("Debe seleccionar una fecha");
              return false;
            }

            return fecha;
          }
        });

        if (fecha) {
          this.fechaInicio = fecha;
          this.fechaFinal = fecha;
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error al obtener la fecha: ', error);
        return false;
      }
    },
    async consultarFechas() {
      if (await this.obtenerFechas()) {
        this.consultarPedidos();
      }
    },
    async consultarUnDia() {
      if (await this.obtenerUnDia()) {
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
    verInformacion(index) {
      const idPedido = this.pedidos[index].id;
      this.$router.push({ name: 'ElementoPedido', params: { id: idPedido } });
      //localStorage.setItem("idPedido", idPedido);
      //this.$router.push("/elementoPedido")
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
      ).then(async (respuesta) => {
        if (respuesta.status === 200) {
          this.fechaInicioActual = this.fechaInicio;
          this.fechaFinalActual = this.fechaFinal;
          this.pedidos = respuesta.data;
          this.pedidosFiltrados = this.pedidos;

          if (!this.pedidos.length > 0) {
            Swal.fire({
              title: 'No hay resultados',
              text: 'No se encontraron pedidos en las fechas especificadas.',
              icon: 'warning',
              confirmButtonText: 'Entendido'
            });
          }
          if (this.tipo == 'empresa') {
            const hoy = new Date();
            const dosDiasDespues = new Date(hoy);
            dosDiasDespues.setDate(hoy.getDate() + 2);

            const pedidosProximos = this.pedidos.filter(pedido => {
              const fechaEntrega = new Date(pedido.Entrega.fecha_entrega);
              return fechaEntrega <= dosDiasDespues && pedido.estado !== 'Entregado';
            });

            if (pedidosProximos.length > 0 && this.tipo == 'empresa') {
              await Swal.fire({
                title: '¡Atención!',
                text: 'Algunos pedidos tienen una fecha de entrega dentro de dos días o menos.',
                icon: 'warning',
                confirmButtonText: 'Entendido'
              });
            }

            const pedidosVencidos = this.pedidos.filter(pedido => {
              const fechaEntrega = new Date(pedido.Entrega.fecha_entrega);
              return fechaEntrega <= hoy && pedido.estado !== 'Entregado';
            });

            if (pedidosVencidos.length > 0) {
              if(this.tipo == 'empresa'){
                await 
              Swal.fire({
                title: '¡Atención!',
                text: 'Algunos pedidos ya han superado la fecha de entrega y no están marcados como "Entregado".',
                icon: 'error',
                confirmButtonText: 'Entendido'
              });
              }
              else{
                await 
              Swal.fire({
                title: '¡Atención!',
                text: 'Algunos pedidos ya han superado la fecha de entrega y por favor realiza pagos pendientes si es que los hay o contactanos.',
                icon: 'error',
                confirmButtonText: 'Entendido'
              });
              }
              
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
    async filtrarPedidos(idPedido) {
      if (!idPedido) {
        this.pedidosFiltrados = this.pedidos; // Si no hay ID, muestra todos los pedidos
      } else {
        this.pedidosFiltrados = this.pedidos.filter(pedido => pedido.id.toString().includes(idPedido.toString())); // Filtra por ID
      }
      if(!this.pedidosFiltrados.length > 0){
        await Swal.fire({
              title: 'No hay resultados',
              text: 'No se encontraron pedidos.',
              icon: 'warning',
              confirmButtonText: 'Entendido'
            });
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
