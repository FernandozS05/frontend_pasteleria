<template>
 
  <div class="container d-flex">
    <div class="col-auto mostrador flex-grow-1 d-flex p-3"  id="mostrador">
      
        <ProductoCatalogo 
          v-for="(producto, index) in productos"
          :key="index"
          :imagen="producto.imagen"
          :nombre="producto.nombre"
          :descripcion="producto.descripcion"
          :precio="producto.precio"
          @detalle="cargar(index)"
        />
      
    </div>
    <!-- CONTENEDOR DEL ITEM SELECCIONADO -->
    <div
      class="seleccion border border-4 rounded mt-3 me-3"
      id="seleccion"
    >
      <div class="cerrar" @click="cerrar">Cerrar</div>
      <div class="info">
        <img class="img-fluid" v-bind:src="imagenSeleccionada" alt="" />
        <h2 id="modelo">{{ this.nombreSeleccionada }}</h2>
        <p id="descripcion">{{ this.descripcionSeleccionada }}</p>

        <span class="precio" id="precio">{{
          `$ ${this.precioSeleccionado}`
        }}</span>

        <div class="row">
          <div class="row mb-3">
            <label for="selectorCantidad">Cantidad</label>
            <select
              id="selectorCantidad"
              v-model="cantidadProducto"
              class="form-select form-select-sm"
              aria-label="Small select example"
            >
              <option selected>Selecciona una cantidad</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <button class="btn btn-primary boton" @click="registrarPedido">
            Realizar pedido
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductoCatalogo from "../Producto/ProductoCatalogo.vue";
import apiCliente from "@/config/ServidorCliente";
import axios from "@/config/axios.js";
import { toast } from "vue3-toastify";
import toastConf from "@/config/toast";
import Swal from "sweetalert2";
export default {
  name: "CatalogoProductos",
  props: {
    productos: Array,
  },
  components: {
    ProductoCatalogo,
  },
  data() {
    return {
      imagenProducto: "",
      nombre: "",
      idSeleccionado: "",
      nombreSeleccionada: "",
      descripcionSeleccionada: "",
      imagenSeleccionada: "",
      precioSeleccionado: "",
      nombreCliente: "",
      cantidadProducto: "1",
      productosFiltrados: [],
    };
  },
  methods: {
    cargar(index) {
      const producto = this.productos[index];

      let mostrador = document.getElementById("mostrador");
      let seleccion = document.getElementById("seleccion");
      this.idSeleccionado = producto.id;
      this.nombreSeleccionada = producto.nombre;
      this.descripcionSeleccionada = producto.descripcion;
      this.precioSeleccionado = producto.precio;
      this.imagenSeleccionada = producto.imagen;

    mostrador.classList.add("active");
    seleccion.classList.add("active");

      mostrador.style.width = "60%";
      seleccion.style.width = "40%";
      seleccion.style.opacity = "1";
    },
    cerrar() {
      let mostrador = document.getElementById("mostrador");
      let seleccion = document.getElementById("seleccion");
      mostrador.classList.remove("active");
      seleccion.classList.remove("active");
      mostrador.style.width = "100%";
      seleccion.style.width = "0%";
      seleccion.style.opacity = "0";
    },
    revisar() {
      const tipoUsuario = localStorage.getItem("tipoUsuario");
      if (tipoUsuario === "cliente") {
        return false;
      } else if (tipoUsuario === "empresa") {
        return true;
      }
      return false;
    },

    async obtenerNombreCliente() {
      const { value: nombre } = await Swal.fire({
        title: "¿A nombre de quién se hará el pedido?",
        input: "text",
        inputLabel: "Nombre completo",
        inputPlaceholder: "Ingresa el nombre de la persona",
      });
      if (nombre) {
        return nombre;
      }
    },
    async registrarPedido() {
      let cliente = await this.obtenerNombreCliente();
      if (!cliente) return;

      const idUsuario = localStorage.getItem("idUsuario");

      const url = apiCliente.registrarPedido;
      const datos = {
        usuario: idUsuario,
        cliente: cliente,
        lugar_realizado: this.revisar() ? "Sucursal" : "Internet",
        productos: [
          {
            id: this.idSeleccionado,
            cantidad: this.cantidadProducto,
          },
        ],
        total: Math.ceil(this.precioSeleccionado * this.cantidadProducto),
      };

      toast
        .promise(
          axios.post(url, datos, { withCredentials: true }),
          {
            pending: "Registrando pedido...",
            success: "Pedido registrado correctamente.",
            error: "No se pudo registrar pedido",
          },
          toastConf
        )
        .then((respuesta) => {
          if (respuesta.status === 200) {
            const idPedido = respuesta.data.id_pedido;
            localStorage.setItem("idPedido", idPedido);
            this.$router.push("/registro-pedido");
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
  },
  mounted() {
    //this.cargar(0);
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;800&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Open Sans";
}

.mostrador {
  display: flex;
  flex-wrap: wrap; /* Permite que los items se ajusten a la siguiente línea */
  gap: 10px; /* Espacio entre los productos */
  transition: all 0.3s ease; /* Suave transición para los cambios de tamaño */
}

.seleccion {
  transition: all 0.5s ease;
  width: 0%; /* Inicia sin tomar espacio */
  overflow: hidden;
  flex-shrink: 0; /* Evita que se reduzca */
}

/* Cuando la selección está activa, ajusta los anchos */
.mostrador.active {
  flex-basis: 60%;
}

.seleccion.active {
  width: 40%;
  opacity: 1;
}

.mostrador .fila .item {
  max-width: 210px;
  padding: 30px;
  height: 250px;
  /*border: 2px solid red;*/
  text-align: center;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
}

.mostrador .fila .item:hover {
  background-color: #e6e6e6;
}

.mostrador .fila .item img {
  width: 100%;
  margin: 30px 0;
}

.mostrador .fila .item .descripcion {
  color: #707070;
  font-weight: bold;
}

.mostrador .fila .item .precio {
  color: #f85151;
  font-weight: bold;
  font-size: 20px;
}

.seleccion {
  transition: 0.5s ease;
  opacity: 0;
  width: 0%;
  height: fit-content;
  border: 1px solid #ccc;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: start;
  overflow: hidden;
}

.cerrar {
  position: absolute;
  right: 0;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

.info {
  padding: 20px;
}

.info img {
  display: block;
  margin: 30px auto;
  width: 80%;
}

.info h2 {
  color: #707070;
  margin-bottom: 10px;
}

.info p {
  font-size: 14px;
  color: #707070;
  margin-bottom: 10px;
}

.info .precio {
  font-size: 30px;
  font-weight: bold;
  color: #f85151;
  margin-bottom: 10px;
  display: block;
}

.info .fila {
  display: flex;
  align-items: flex-end;
}

.info .fila label {
  display: block;
  margin-bottom: 10px;
}

.info .fila select {
  width: 100px;
  font-size: 18px;
  padding: 6px;
  margin-right: 30px;
}

.boton {
  height: 40px;
  border: none;
  padding: 0 10px;
  color: #fff;
  background-color: #f85151;
}

.boton:hover {
  background-color: #fc2828;
}

#app {
  max-width: 100%;
  overflow-x: hidden;
}


</style>
