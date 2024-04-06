<template>
  <div class="row w-100 d-flex justify-content-center align-items-center">
    <div class="col-auto mt-3 ">
      <div class="p-3 border border-3 rounded-4">

        <p class="fs-5">Detalles de pedido</p>

        <p class="fs-4 mt-4">Tipo de entrega:</p>
        <div class="form-check">
          <input type="radio" class="form-check-input" name="tipoEntrega" id="entregaSucursal" value="sucursal"
            v-model="tipoEntrega" />
          <label class="form-check-label" for="entregaSucursal">
            Sucursal: Calle principal #5, Col.Prueba, Xalapa, Ver.
          </label>
        </div>
        <div class="form-check">
          <input type="radio" class="form-check-input" name="tipoEntrega" id="entregaDomicilio" value="domicilio"
            v-model="tipoEntrega" />
          <label class="form-check-label" for="entregaDomicilio">
            Domicilio
          </label>
        </div>

        <!-- Detalles de entrega a domicilio -->
        <div v-if="this.tipoEntrega === 'domicilio'" id="detallesDomicilio" class="mb-3 mt-4">
          <label for="infoDomicilio" class="form-label">
            <p class="fs-5">Detalles de entrega a domicilio</p>
          </label>
          <textarea v-model="domicilio" class="form-control" id="infoDomicilio" rows="3"
            placeholder="Calle, colonia, numero de exterior, etc."></textarea>
          <label for="infoReferencias" class="form-label">
            <p class="fs-5">Referencias domicilio</p>
          </label>
          <textarea class="form-control" id="infoReferencias" rows="2"
            placeholder="Referencias de la ubicacion del domicilio."></textarea>
        </div>
        <h4 class="mt-4">Fechas disponibles:</h4>
        <select v-model="fechaSeleccionada" class="form-select" @change="consultarAgenda">
          <option disabled value="">Seleccione una fecha</option>
          <option v-for="fechaDisponible in fechasDisponibles" :key="fechaDisponible" :value="fechaDisponible">
            {{ fechaDisponible }}
          </option>
        </select>
        <h4 class="mt-4">Método de pago:</h4>
        <div class="form-check">
          <input type="radio" class="form-check-input" name="metodoPago" id="pagoTarjeta" value="tarjeta"
            v-model="tipoPago" />
          <label class="form-check-label" for="pagoTarjeta">
            Pago con tarjeta
          </label>
        </div>
        <div class="form-check">
          <input type="radio" class="form-check-input" name="metodoPago" id="otraFormaPago" value="efectivo"
            v-model="tipoPago" />
          <label class="form-check-label" for="otraFormaPago">
            Efectivo
          </label>
        </div>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <button class="btn btn-outline-secondary text-rose" type="button" @click="cancelar">
            Cancelar
          </button>
          <button class="btn btn-rose" type="button" @click="guardar">
            Continuar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/config/axios.js';
import { toast } from "vue3-toastify";
import toastConf from "@/config/toast";
import apiCliente from "@/config/ServidorCliente.js";

export default {
  name: "DetallePedido",
  data() {
    return {
      idEntrega: "",
      fechaSeleccionada: "",
      fechasDisponibles: [],
      tipoEntrega: "",
      domicilio: "",
      indicacionesExtra: ""
    }
  },
  methods: {
    consultarAgenda() {
      const url = apiCliente.consultarFechas;
      const idPedido = localStorage.getItem("idPedido");

      const datos = { id: idPedido };
      toast.promise(
        axios.post(url, datos),
        {
          pending: 'Consultando fechas...',
          success: 'Fechas obtenidas.',
          error: 'Error al consultar las fechas.',
        }, toastConf
      ).then((respuesta) => {
        if (respuesta.status === 200) {
          this.fechasDisponibles = respuesta.data;
        }
      }).catch((error) => {
        this.manejarError(error);
      });
    },
    guardar() {
      const url = apiCliente.registrarEntrega;
      const datos = {};

      if (!this.fechaSeleccionada)
        return

      datos.fecha_entrega = this.fechaSeleccionada;

      if (this.tipoEntrega === "domicilio") {
        datos.forma_entrega = "Domicilio";
        datos.direccion = this.domicilio;
      } else {
        datos.forma_entrega = "Sucursal";
        datos.direccion = "Sucursal: Calle principal #5, Col. Prueba, Xalapa, Ver.";
      }
      toast.promise(
        axios.post(url, datos, { withCredentials: true }),
        {
          pending: 'Registrando entrega...', 
          success: 'Entrega registrada.', 
          error: 'Error al registrar entrega.', 
        }, toastConf
      ).then(async (respuesta) => {
        
        if (respuesta.status === 200) {

          this.idEntrega = respuesta.data.id;
          toast.success("Entrega registrada correctamente.")
          await this.asignarEntregaPedido()
        }
      }).catch((error) => {
        // Manejar errores de la petición
        if (error.response) {
          console.error('Mensaje del servidor:', error.response.data.error);

          if (error.response.status === 401) {
            toast.error('No autorizado.');
          }
          if (error.response.status === 404) {
            toast.error('Ruta no encontrada.');
          }
        } else if (error.request) {
          
          console.error('No se recibió respuesta del servidor');
          toast.error('Error de red', toastConf);
        } else {
          console.error('Error de configuración de la solicitud', error);
          toast.error('Error desconocido', toastConf);
        }
      });

    },
    asignarEntregaPedido() {
      const idPedido = localStorage.getItem("idPedido");
      const url = apiCliente.asignarEntrega + idPedido;
      const datos = {
        id_entrega: this.idEntrega,
        id_pedido: idPedido
      }
      toast.promise(
        axios.post(url, datos),
        {
          pending: 'Asignando entrega...', 
          success: 'Entrega asignada.', 
          error: 'Error al asignar entrega.', 
        }, toastConf
      ).then((respuesta) => {
        if (respuesta.status === 200) {
          toast.success("Entrega asignada correctamente.")
          
          if (this.tipoPago === "tarjeta") {
            this.$router.push("/tarjeta")
          }
          else {
            this.$router.push("/formato")
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
  },
  mounted(){
    this.consultarAgenda();
  }
}
</script>

<style scoped>
.gradient-background {
  background: #ffc6d1;
}

.text-rose {
  color: #fe8092;
}

.btn-rose {
  background-color: #fe8092;
  color: #ffffff;
}

.btn-outline-secondary {
  color: #fe8092;
  border-color: #fe8092;
}
</style>
