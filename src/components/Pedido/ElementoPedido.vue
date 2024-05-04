<template>
  <div id="app">
    <div class="row w-100 d-flex justify-content-center align-items-center">
      <div class="col-auto mt-3 p-2 border border-3 rounded-4">
        <h4 class="mt-4 mb-3">Detalles del Pedido</h4>
        <p class="fs-6 mb-3">{{ `Cliente: ${this.detalles.cliente}` }}</p>
        <p class="fs-6 mb-3">
          {{ `Realizado en: ${this.detalles.fecha_realizado.slice(0, 10)}` }}
        </p>

        <p class="fs-6 mt-3">{{ `Total: $${this.detalles.total}` }}</p>
        <div class="mb-3">
          <p class="fs-5 fw-medium">Detalles de entrega</p>
          <p class="fs-6">
            {{
              `Fecha de entrega: ${this.entrega.fecha_entrega
                ? this.entrega.fecha_entrega.slice(0, 10)
                : "No disponible"
              }`
            }}
          </p>
          <p class="fs-6">
            {{
              `Forma entrega: ${this.entrega.fecha_entrega
                ? this.entrega.forma_entrega
                : "No disponible"
              }`
            }}
          </p>
        </div>
        <p class="fs-5 fw-medium">Productos</p>
        <div class="row">
          <button class="col-3 ms-2 btn btn-primary text-nowrap " @click="verProductos(detalles.productos)">Ver Productos</button>
        </div>
        <div class="mb-3">
          <p class="fs-5 fw-medium">Pago anticipo</p>
          <div v-if="this.detalles.id_anticipo != null" class="row">
            <p class="fs-6">{{ `Método pago: ${this.pagoAnticipo.metodo}` }}</p>
            <p class="fs-6">{{ `Folio: ${this.pagoAnticipo.folio}` }}</p>
            <p class="fs-6">{{ `Monto: $${this.pagoAnticipo.total}` }}</p>
            <p class="fs-6">{{ `Dirección: ${this.pagoAnticipo.direccion}` }}</p>
          </div>
          <div v-else class="row">
            <p class="fs-6">{{ "Sin pago de anticipo registrado." }}</p>
          </div>
          <p class="fs-5 fw-medium">Pago liquidación</p>
          <div v-if="this.detalles.id_liquidacion != null" class="row">
            <p class="fs-6">
              {{ `Método pago: ${this.pagoLiquidacion.metodo}` }}
            </p>
            <p class="fs-6">{{ `Folio: ${this.pagoLiquidacion.folio}` }}</p>
            <p class="fs-6">{{ `Monto: $${this.pagoLiquidacion.total}` }}</p>
            <p class="fs-6">
              {{ `Dirección: ${this.pagoLiquidacion.direccion}` }}
            </p>
          </div>
          <div v-else class="row">
            <p class="fs-6">{{ "Sin pago de liquidacion registrado." }}</p>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <button class="btn btn-primary" @click="volver">Volver</button>
          <button class="btn btn-danger" role="button" :disabled="!modificacion_autorizada" @click="modificarEntrega">
            Modificar Entrega
          </button>
          <button v-if="this.detalles.estado == 'Liquidado'" class="btn btn-primary" role="button"
            @click="entregarPedido">
            Marcar entregado
          </button>
          <button class="btn btn-danger" role="button" :disabled="!autorizado" @click="cancelar">
            Cancelar Pedido
          </button>
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
  name: "ElementoPedido",
  props: {
    detalles: Object,
    pagoAnticipo: Object,
    entrega: Object,
    pagoLiquidacion: Object,
  },
  data() {
    return {
      autorizado: false,
      modificacion_autorizada: false,
    };
  },
  methods: {
    async consultarCancelacion() {
      const url = apiCliente.consultarCancelacion + this.detalles.id;
      axios.get(url)
        .then((respuesta) => {
          if (respuesta.status === 200) {
            this.autorizado = true; 
          } else {
            this.autorizado = false; 
          }
        })
        .catch((error) => {
          console.error('Error al consultar cancelación:', error);
          this.autorizado = false; 
        });
    },
    async modificarEntrega() {
      localStorage.setItem("idPedido", this.detalles.id);
      this.$router.push('/modificar-entrega');
    },
    async entregarPedido() {
      try {

        const resultado = await Swal.fire({
          title: "¿Estás seguro de marcar como entregado el pedido?",
          text: "Esta acción no se puede revertir.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí",
          cancelButtonText: "No",
        });

        Swal.fire({
          title: 'Realizando cambios...',
          text: 'Por favor, espere.',
          didOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        });

        if (resultado.isConfirmed) {

          const url = apiCliente.entregarPedido + this.detalles.id;

          const respuesta = await axios.put(url);
          Swal.close();
          if (respuesta.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Pedido cancelado correctamente.",
              showConfirmButton: false,
              timer: 1500,
            });

            this.$router.push('/pedidos');
          }
        }
      } catch (e) {
        Swal.close();
        this.manejarError(e);
      }
    },
    async consultarModificacion() {
      try {
        const url = apiCliente.consultarModificacion + this.detalles.id;

        const respuesta = await axios.get(url);
        if (respuesta.status === 200) {
          console.log("Cancelable")
          this.modificacion_autorizada = respuesta.data.permitir;
        }
      } catch (e) {
        console.log(e);
      }
    },
    cancelar() {
      Swal.fire({
        title: "¿Estás seguro de cancelar este pedido?",
        text: "Esta acción no se puede revertir.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No, mantener pedido",
      }).then((result) => {
        if (result.isConfirmed) {
          const url = apiCliente.cancelarPedido + this.detalles.id;

          toast
            .promise(
              axios.delete(url, {
                withCredentials: true,
                responseType: "blob",
              }),
              {
                pending: "Cancelando pedido ...",
                success: "Pedido Cancelado.",
                error: "Cancelación interrumpida.",
              },
              toastConf
            )
            .then(async (respuesta) => {
              if (respuesta.status === 200) {
                const blob = new Blob([respuesta.data], {
                  type: "application/pdf",
                });

                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");

                a.href = url;
                a.download = `Voucher_devolucion_${this.detalles.id}.pdf`;

                document.body.appendChild(a);
                a.click();

                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Pedido cancelado correctamente.",
                  showConfirmButton: false,
                  timer: 1500,
                });

                this.$router.back();
              }
            })
            .catch((error) => {
              this.manejarError(error);
            });
        }
      });
    },
    verProductos(productos) {
      const htmlContent = productos.map(producto => {
        return `<div>
                <p><strong>Nombre:</strong> ${producto.nombre}</p>
                <p><strong>Descripción:</strong> ${producto.descripcion || 'No disponible'}</p>
                <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
                <p><strong>Precio:</strong> $${parseInt(producto.precio).toFixed(2)}</p>
              </div><hr>`;
      }).join('');

      Swal.fire({
        title: 'Productos del Pedido',
        html: htmlContent,
        width: '800px',
        customClass: {
          popup: 'formatted-content'
        },
        confirmButtonText: 'Cerrar'
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
    volver() {
      this.$router.back();
    },
    editarPedido() {
      this.$emit("editarPedido");
    },
    cancelarPedido() {
      this.$emit("cancelarPedido");
    },
  },
  async mounted() {
    await this.consultarCancelacion();
    await this.consultarModificacion();
  },
};
</script>

<style scoped>
/* Estilos globales para texto */
#app p {
  font-size: 1rem; /* Tamaño de fuente estándar para todos los textos no-título */
  margin-top: 0.5rem; /* Espaciado uniforme superior */
  margin-bottom: 0.5rem; /* Espaciado uniforme inferior */
}

/* Estilo para títulos */
h4, .fs-4, .fs-5 {
  font-size: 1.25rem; /* Tamaño de fuente más grande para títulos */
}

/* Ajustes generales de estilo para contenedores y alineación */
.col-auto {
  min-width: 300px; /* Mínimo ancho del contenedor */
  max-width: 600px; /* Máximo ancho del contenedor */
  width: 100%; /* Por defecto tomará el máximo ancho posible */
}

/* Ajuste de los botones para mejorar la coherencia */
.btn {
  padding: 0.375rem 0.75rem; /* Padding estándar para botones */
  margin-top: 0.5rem; /* Espaciado uniforme superior */
  margin-bottom: 0.5rem; /* Espaciado uniforme inferior */
}

/* Asegurarse que los botones no están demasiado juntos */
.d-flex {
  gap: 10px; /* Espacio entre botones */
}

/* Nuevo estilo para contenedores y texto */
.gradient-background {
  background: linear-gradient(to top, #ffffff, #ffc6d1);
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

