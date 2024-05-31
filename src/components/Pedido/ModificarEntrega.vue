<template>
    <div id="app">
      <div class="row w-100 d-flex justify-content-center align-items-center">
        <div class="col-auto mt-3">
          <div class="p-3 border border-3 rounded-4">
            <p class="fs-5">Detalles de pedido</p>
  
            <p class="fs-4 mt-4">Tipo de entrega:</p>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="tipoEntrega"
                id="entregaSucursal"
                value="sucursal"
                v-model="tipoEntrega"
              />
              <label class="form-check-label" for="entregaSucursal">
                Sucursal: Calle principal #5, Col.Prueba, Xalapa, Ver.
              </label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                class="form-check-input"
                name="tipoEntrega"
                id="entregaDomicilio"
                value="domicilio"
                v-model="tipoEntrega"
              />
              <label class="form-check-label" for="entregaDomicilio">
                Domicilio
              </label>
            </div>
  
            <!-- Detalles de entrega a domicilio -->
            <div v-if="tipoEntrega === 'domicilio'" id="detallesDomicilio" class="mb-3 mt-4">
              <label for="infoDomicilio" class="form-label">
                <p class="fs-5">Detalles de entrega a domicilio</p>
              </label>
              <textarea
                v-model="domicilio"
                class="form-control"
                id="infoDomicilio"
                rows="3"
                placeholder="Calle, colonia, numero de exterior, etc."
              ></textarea>
              <label for="infoReferencias" class="form-label">
                <p class="fs-5">Referencias domicilio (Opcional)</p>
              </label>
              <textarea
                v-model="indicacionesExtra"
                class="form-control"
                id="infoReferencias"
                rows="2"
                placeholder="Referencias de la ubicacion del domicilio."
              ></textarea>
            </div>
  
            <h4 class="mt-4">Fechas disponibles:</h4>
            <select v-model="fechaSeleccionada" class="form-select" @change="consultarAgenda">
              <option disabled value="">Seleccione una fecha</option>
              <option
                v-for="fechaDisponible in fechasDisponibles"
                :key="fechaDisponible"
                :value="fechaDisponible"
              >
                {{ `${fechaDisponible.fecha} ${fechaDisponible.hora}:00 hrs` }}
              </option>
            </select>
  
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
    </div>
  </template>
  
  <script>
  import axios from "@/config/axios.js";
  import { toast } from "vue3-toastify";
  import toastConf from "@/config/toast";
  import apiCliente from "@/config/ServidorCliente.js";
  import Swal from "sweetalert2";
  
  export default {
    name: "DetallePedido",
    data() {
      return {
        idEntrega: "",
        fechaSeleccionada: "",
        fechasDisponibles: [],
        tipoEntrega: "",
        domicilio: "",
        indicacionesExtra: "",
      };
    },
    methods: {
      async consultarAgenda() {
        const url = apiCliente.consultarFechas;
        const idPedido = localStorage.getItem("idPedido");
  
        const datos = { id: idPedido };
        toast
          .promise(
            axios.post(url, datos),
            {
              pending: "Consultando fechas...",
              success: "Fechas obtenidas.",
              error: "Error al consultar las fechas.",
            },
            toastConf
          )
          .then((respuesta) => {
            if (respuesta.status === 200) {
              this.fechasDisponibles = respuesta.data;
            }
          })
          .catch((error) => {
            this.manejarError(error);
          });
      },
      guardar() {
        if (!this.tipoEntrega) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Por favor, selecciona un tipo de entrega.",
          });
          return;
        }
  
        if (!this.fechaSeleccionada) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Por favor, selecciona una fecha disponible.",
          });
          return;
        }
  
        if (this.tipoEntrega === "domicilio") {
          if (!this.domicilio.trim()) {
            Swal.fire({
              icon: "error",
              title: "Error...",
              text: "Por favor, ingresa detalles de entrega a domicilio.",
            });
            return;
          }
  
          if (/\b0{3,}\b/.test(this.domicilio)) {
            Swal.fire({
              icon: "error",
              title: "Error...",
              text: "El campo de detalles de entrega no puede contener tres o más ceros consecutivos.",
            });
            return;
          }
        }
  
        const url = apiCliente.registrarEntrega;
        const datos = {
          fecha_entrega: this.fechaSeleccionada.fecha,
          hora: this.fechaSeleccionada.hora,
          forma_entrega: this.tipoEntrega === "domicilio" ? "Domicilio" : "Sucursal",
          direccion: this.tipoEntrega === "domicilio" ? this.domicilio : "Sucursal: Calle principal #5, Col. Prueba, Xalapa, Ver.",
        };
  
        toast
          .promise(
            axios.post(url, datos, { withCredentials: true }),
            {
              pending: "Registrando entrega...",
              success: "Entrega registrada.",
              error: "Error al registrar entrega.",
            },
            toastConf
          )
          .then(async (respuesta) => {
            if (respuesta.status === 200) {
              this.idEntrega = respuesta.data.id;
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Entrega registrada correctamente.",
                showConfirmButton: false,
                timer: 1500,
              });
              await this.asignarEntregaPedido();
            }
          })
          .catch((error) => {
            this.manejarError(error);
          });
      },
      async asignarEntregaPedido() {
        const idPedido = localStorage.getItem("idPedido");
        const url = apiCliente.asignarEntrega + idPedido;
        const datos = {
          id_entrega: this.idEntrega,
          id_pedido: idPedido,
        };
  
        toast
          .promise(
            axios.post(url, datos),
            {
              pending: "Asignando entrega...",
              success: "Entrega asignada.",
              error: "Error al asignar entrega.",
            },
            toastConf
          )
          .then((respuesta) => {
            if (respuesta.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Entrega asignada correctamente.",
                showConfirmButton: false,
                timer: 1500,
              });
              localStorage.removeItem("idPedido");
              this.$router.push("/pedidos");
            }
          })
          .catch((error) => {
            this.manejarError(error);
          });
      },
      manejarError(error) {
        if (error.response) {
          if (error.response.status === 401) {
            this.$router.push("/login");
            Swal.fire({
              icon: "error",
              title: "Error...",
              text: "No autorizado.",
            });
          } else if (error.response.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Error...",
              text: "Información no encontrada.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error...",
              text: "Error en la solicitud.",
            });
          }
        } else if (error.request) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Error de red.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Error desconocido.",
          });
        }
      },
      cancelar() {
        this.$router.go(-1);
      },
    },
    mounted() {
      this.consultarAgenda();
    },
  };
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
  
  #app {
    max-width: 100%;
    overflow-x: hidden;
  }
  </style>
  