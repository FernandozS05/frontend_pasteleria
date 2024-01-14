<template>
  <div class="container d-flex">
    <div class="col-auto mostrador d-flex p-3" id="mostrador">
      <div class="row">
        <ProductoCatalogo v-for="(producto, index) in productos" :key="index" :imagen="producto.imagen"
          :nombre="producto.nombre" :descripcion="producto.descripcion" :precio="producto.precio"
          @detalle="cargar(index)" />
      </div>
    </div>
    <!-- CONTENEDOR DEL ITEM SELECCIONADO -->
    <div class="col-auto seleccion border border-4 rounded mt-3 me-3" id="seleccion">
      <div class="cerrar" @click="cerrar">
        Cerrar
      </div>
      <div class="info">
        <img class="img-fluid" v-bind:src="imagenSeleccionada" alt="">
        <h2 id="modelo">{{ this.nombreSeleccionada }}</h2>
        <p id="descripcion">{{ this.descripcionSeleccionada }}</p>

        <span class="precio" id="precio">{{ `$ ${this.precioSeleccionado}` }}</span>

        <div class="row">
          <div class="row mb-3">
            <label for="selectorCantidad">Cantidad</label>
            <select id="selectorCantidad" v-model="cantidadProducto" class="form-select form-select-sm" aria-label="Small select example">
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
          <button class="btn btn-primary boton" @click="registrarPedido">Realizar pedido</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductoCatalogo from "../Producto/ProductoCatalogo.vue";
import apiCliente from "@/config/ServidorCliente";
import axios from 'axios';
import { toast } from 'vue3-toastify';
import toastConf  from "@/config/toast";
export default {
  name: "CatalogoProductos",
  props: {
    productos: Array
  },
  components: {
    ProductoCatalogo
  },
  data() {
    return {
      imagenProducto: "",
      nombre: "",
      idSeleccionado : "",
      nombreSeleccionada: "",
      descripcionSeleccionada: "",
      imagenSeleccionada: "",
      precioSeleccionado: "",
      cantidadProducto: "",
      productosFiltrados: [],
    };
  },
  methods: {
    buscarProducto() {
    },
    comprarProducto() {
    },
    cargar(index) {

      const producto = this.productos[index];

      let mostrador = document.getElementById("mostrador");
      let seleccion = document.getElementById("seleccion");
      this.idSeleccionado = producto.idProducto;
      this.nombreSeleccionada = producto.nombre;
      this.descripcionSeleccionada = producto.descripcion;
      this.precioSeleccionado = producto.precio;
      this.imagenSeleccionada = producto.imagen;
       

      mostrador.style.width = "60%";
      seleccion.style.width = "40%";
      seleccion.style.opacity = "1";
      //item.style.border = "2px solid red";
    },
    cerrar() {
      let mostrador = document.getElementById("mostrador");
      let seleccion = document.getElementById("seleccion");
      mostrador.style.width = "100%";
      seleccion.style.width = "0%";
      seleccion.style.opacity = "0";
    },
    registrarPedido(){
      const idCliente = localStorage.getItem("idUsuario");
      const url = apiCliente.registrarPedido;
      const datos =  { cliente: idCliente, productos: [
        {
          id: this.idSeleccionado, 
          cantidad: this.cantidadProducto
        }
      ],
      total: Math.round(this.precioSeleccionado * this.cantidadProducto)
      };

      console.log(datos);
      console.log(url);
      // Usar toast.promise para mostrar un toast mientras la promesa está pendiente
      toast.promise(
        axios.post(url, datos, { withCredentials: true }),
        {
          pending: 'Registrando pedido...', // Mensaje mientras la promesa está pendiente
          success: 'Pedido registrado correctamente.', // Mensaje cuando la promesa se resuelve con éxito
          error: 'No se pudo registrar pedido', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then((respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Pedido registrado');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {
          console.log(respuesta.data);
          const idPedido = respuesta.data.id;
          localStorage.setItem('idPedido', idPedido);
          toast.success('Registrado correctamente!');
          setTimeout(() => {
            this.$router.push("/pedidos");
          }, 10000);
          
        }
      }).catch((error) => {
        // Manejar errores de la petición
        if (error.response) {
          console.error('Mensaje del servidor:', error.response.data.error);

          if (error.response.status === 401) {
            toast.error('No autorizado.');
          }
          if (error.response.status === 404) {
            toast.error('Ruta no encontrada.', toastConf);
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
  mounted() {
    //this.cargar(0);
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Open Sans';
}

.contenido {
  max-width: 1200px;
  width: 100%;
  margin: 40px auto;
  display: flex;
}

.mostrador {
  width: 100%;
  transition: .5s ease;
}

.mostrador .fila {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
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
  transition: .3s;
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
  transition: .5s ease;
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
</style>
