<template>
  <div id="app">
    <div>
      <div class="row justify-content-between align-items-center fondo-encabezado">
      </div>
      <div class="row">
        <div class="col container pt-2 bg-light shadow m-3 rounded border border-dark">
          <div class="row">
            <p class="col-10 fs-4 d-flex align-items-start text-nowrap fw-medium subtitulo">
              Insumos en el inventario
              <BarraBusqueda class="col-6 ms-5 align-items-center" :placeholder="Buscar"
                @filtrar="filtrarInsumosTexto" />
              <button type="button" class="btn btn-success boton-agregar ms-5 " @click="nuevoInsumo">
                Agregar
              </button>
              <button type="button"
                class="btn btn-success boton-agregar ms-5 d-flex align-items-center justify-content-evenly text-center p-1 boton-hover text-nowrap"
                @click="verProductos">
                Ver Productos
              </button>
            </p>
          </div>
          <div class="row p-3">
            <TablaInsumo class="col-12 border border-3 rounded" :insumos="insumosFiltrados" @editarInsumo="editarInsumo"
              @infoInsumo="verInfoInsumo" @eliminarInsumo="eliminarInsumo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarraBusqueda from "../Barras/BarraBusqueda.vue";
import TablaInsumo from "../Inventario/TablaInsumo.vue";
import apiEmpleado from "@/config/ServidorEmpleado";
import axios from "@/config/axios.js";
import Swal from 'sweetalert2';
export default {
  name: "ListadoInsumo",
  components: {
    BarraBusqueda,
    TablaInsumo,
  },
  data() {
    return {
      insumos: [],
      insumosFiltrados: []
    };
  },
  methods: {
    verProductos() {
      this.$router.push("/productos-inventario");
    },
    filtrarInsumosTexto(textoDeBusqueda) {
      if (textoDeBusqueda) {
        this.insumosFiltrados = this.insumos.filter(insumo =>
          insumo.nombre.toLowerCase().includes(textoDeBusqueda.toLowerCase())
        );
      } else {
        this.insumosFiltrados = this.insumos;
      }
    },

    async verInfoInsumo(insumo) {
      try {
        const result = await Swal.fire({
          title: `${insumo.nombre}`,
          html: `<p class="description">${insumo.descripcion}</p>`,
          input: 'number',
          inputLabel: 'Cantidad de Piezas Disponibles',
          inputValue: insumo.piezas,
          inputAttributes: {
            min: 0,
            step: 1
          },
          showCancelButton: true,
          confirmButtonText: "Guardar",
          cancelButtonText: "Cancelar",
          confirmButtonColor: '#fe8092'
        });

        // Verificar si el usuario confirmó y si se ingresó un valor.
        if (result.isConfirmed && result.value !== null) {
          const nuevasPiezas = result.value;  // Directamente usar el valor aquí.
          await this.actualizarPiezasInsumo(insumo.id, nuevasPiezas);
        }
      } catch (error) {
        console.error("Error al intentar actualizar las piezas: ", error);
        Swal.fire(
          'Error',
          'Hubo un problema al actualizar las piezas: ' + error.message,
          'error'
        );
      }
    }
    ,

    // Este método actualiza las piezas de un insumo en el servidor.
    async actualizarPiezasInsumo(idInsumo, nuevasPiezas) {
      const url = `${apiEmpleado.actualizarInsumoInventario}${idInsumo}`;
      try {

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
        const response = await axios.put(url, { piezas: nuevasPiezas });
        if (response.status === 200) {
          Swal.close();
          await Swal.fire({
            icon: "success",
            title: "Actualización completada",
            text: `Las piezas del insumo han sido actualizadas correctamente.`,
          });
          this.consultarInsumos();
        }
      } catch (error) {
        console.log(error);
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: `Hubo un error al actualizar las piezas del insumo: ${error.response ? error.response.data.message : error.message}`
        });
      }
    },

    nuevoInsumo() {
      this.$router.push("/formulario-insumo");
    },
    editarInsumo(idInsumo) {
      localStorage.setItem("idInsumo", idInsumo);
      this.$router.push("/formulario-insumo");
    },

    eliminarInsumo(idInsumo) {
      const url = apiEmpleado.eliminarInsumoInventario + idInsumo;
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

      axios.delete(url).then(async response => {
        if (response.status === 200) {
          Swal.close();
          await Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El elemento se ha eliminado correctamente.',
          });
          window.location.reload();
        }
      }).catch(error => {
        Swal.close();
        this.manejarError(error);
      });
    },
    async consultarInsumos() {
      const url = apiEmpleado.consultarInsumosInventario;
      Swal.fire({
        title: 'Cargando...',
        text: 'Por favor, espere.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

      axios.get(url).then(response => {
        if (response.status === 200) {
          Swal.close();
          this.insumos = response.data;
          this.insumosFiltrados = this.insumos;
        }
      }).catch(error => {
        Swal.close();
        if (error.response.status === 404) {
          Swal.fire({
            icon: "info",
            title: "No se encontraron elementos...",
            text: "Parece que no hay ningun insumo registrado.",
          });
        }
        else if (error.request) {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: ("Error de red"),
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: ("Error desconocido"),
          });
        }
      });
    },
    manejarError(error) {
      if (error.response) {

        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Parece que algo salio mal...",
        });
        if (error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "No autorizado...",
            text: "Por favor, inicie sesión nuevamente.",
          });
          this.$router.push("/login")
        }
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: ("Error de red"),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: ("Error desconocido"),
        });
      }
    }

  },
  async mounted() {
    localStorage.removeItem("idInsumo");
    await this.consultarInsumos();
  }
};
</script>

<style scoped>
.boton-agregar {
  background-color: #fe8092;
  color: #ffffff;
  font-size: 1.3rem;
  border: #ffc6d1;
}

.subtitulo {
  color: #fe8092;
}

.row {
  margin-bottom: 1rem;
}

.boton-hover:hover {
  background-color: #fe8092;
}

.col-4 {
  max-width: fit-content;
}

.logo-pasteleria {
  width: 120px;
}

#app {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
