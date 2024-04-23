<template>
  <div class="container-fluid p-0 overflow-hidden">
    <div class="row">
      <BarraNavegacion @cerrarSesion="cerrarSesion" />
    </div>
    <div class="row">
      <div class="col-12 d-flex align-items-center justify-content-between">
        <p class="fs-4 ms-3 fw-medium subtitulo">Productos disponibles</p>
        <button v-if="this.tipo == 'empresa'" type="button"
          class="btn btn-success boton-agregar d-flex align-items-center justify-content-center p-1 boton-hover text-nowrap"
          @click="editarCatalogo">
          Editar catálogo
        </button>
        <button v-if="this.tipo == 'empresa'" type="button"
          class="btn btn-success boton-agregar d-flex align-items-center justify-content-center p-1 boton-hover text-nowrap"
          @click="obtenerDatosPedido">
          Pedido personalizado
        </button>
        <BarraBusqueda :placeholder="Buscar" @filtrar="filtrarProductos" />
      </div>
    </div>
    <div class="row">
      <CatalogoPasteles class="col-12" v-if="mostrarCatalogo" :key="updateKey" :productos="productosFiltrados" />
    </div>
  </div>
</template>



<script>
// @ is an alias to /src
import BarraNavegacion from "../../components/Barras/BarraNavegacion.vue";
import BarraBusqueda from "../../components/Barras/BarraBusqueda.vue";
import CatalogoPasteles from "../../components/Catalogo/CatalogoProductos.vue";
import apiCliente from "@/config/ServidorCliente";
// eslint-disable-next-line no-unused-vars
import apiEmpleado from "@/config/ServidorEmpleado";
import apiArchivos from "@/config/ServidorArchivos";
import axios from '@/config/axios.js';
import { toast } from 'vue3-toastify';
import toastConf from "@/config/toast";
import Swal from "sweetalert2";
export default {
  name: "CatalogoPastelesView",
  components: {
    BarraNavegacion,
    BarraBusqueda,
    CatalogoPasteles,
  },
  props: [

  ],
  data() {
    return {
      mostrarCatalogo: false,
      updateKey: 0,
      productosFiltrados: [],
      productos: [
        {
          nombre: "Zanahoria",
          descripcion: "Descripcion ejemplo",
          imagen: require("../../assets/Imagen3.png"),
          precio: 800,
        },
        {
          nombre: "Chocolate",
          descripcion: "Descripcion ejemplo",
          imagen: require("../../assets/Imagen4.png"),
          precio: 801,
        },
        {
          nombre: "Manzana",
          descripcion: "Descripcion ejemplo",
          imagen: require("../../assets/Imagen5.png"),
          precio: 802
        },
        {
          nombre: "Triple chocolate",
          descripcion: "Descripcion ejemplo",
          imagen: require("../../assets/Imagen6.png"),
          precio: 803,
        },
        {
          nombre: "Viruta blanca",
          descripcion: "Descripcion ejemplo",
          imagen: require("../../assets/Imagen7.png"),
          precio: 804,
        },
        {
          nombre: "Mármol",
          descripcion: "Descripcion ejemplo",
          imagen: require("../../assets/Imagen8.png"),
          precio: 805
        },
        {
          nombre: "Galleta",
          descripcion: "Descripcion ejemplo",
          imagen: require("../../assets/Imagen9.png"),
          precio: 806
        },
        {
          nombre: "Leche merengada",
          descripcion: "Descripcion ejemplo",
          imagen: require("../../assets/Imagen10.png"),
          precio: 807,
        },
        { nombre: "Kinder", descripcion: "Descripcion ejemplo", imagen: require("../../assets/Imagen11.png"), precio: 808 },
        { nombre: "Oreo", descripcion: "Descripcion ejemplo", imagen: require("../../assets/Imagen12.png"), precio: 809 },
        {
          nombre: "Selva negra",
          descripcion: "Descripcion ejemplo",
          imagen: require("../../assets/Imagen13.png"),
          precio: 810,
        },
      ],
      tipo: "",
    }
  },
  methods: {
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
    async obtenerDatosPedido() {
      const nombreCliente = await this.obtenerNombreCliente();

      if (nombreCliente == "" || nombreCliente == null) {
        return
      }

      const datosProducto = await this.obtenerDatosProducto();

      if (datosProducto) {
        await this.confirmarPedido(nombreCliente, datosProducto)
      }
    },
    async obtenerDatosProducto() {
      const { value: formValues } = await Swal.fire({
        title: 'Detalles del Producto',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Nombre del Producto">' +
          '<input id="swal-input2" class="swal2-input" type="number" placeholder="Precio (solo números)">' +
          '<input id="swal-input3" class="swal2-input" placeholder="Descripción">' +
          '<input id="swal-input4" class="swal2-input" type="number" placeholder="Horas de Trabajo (solo números)">' +
          '<input id="swal-input5" class="swal2-input" type="number" placeholder="Cantidad (solo números)">',
        focusConfirm: false,
        preConfirm: () => {
          let nombreProducto = document.getElementById('swal-input1').value;
          let precio = document.getElementById('swal-input2').value;
          let descripcion = document.getElementById('swal-input3').value;
          let horasTrabajo = document.getElementById('swal-input4').value;
          let cantidad = document.getElementById('swal-input5').value;

          // Validación de cada entrada
          if (!nombreProducto.trim()) {
            Swal.showValidationMessage("Por favor ingrese el nombre del producto.");
            return false;
          }
          if (!precio || precio <= 0) {
            Swal.showValidationMessage("Por favor ingrese un precio válido (solo números mayores a 0).");
            return false;
          }
          if (!descripcion.trim()) {
            Swal.showValidationMessage("Por favor ingrese una descripción.");
            return false;
          }
          if (!horasTrabajo || horasTrabajo <= 0) {
            Swal.showValidationMessage("Por favor ingrese las horas de trabajo válidas (solo números mayores a 0).");
            return false;
          }
          if (!cantidad || cantidad <= 0) {
            Swal.showValidationMessage("Por favor ingrese una cantidad válida (solo números mayores a 0).");
            return false;
          }

          return {
            nombre: nombreProducto,
            precio: parseFloat(precio),
            descripcion: descripcion,
            horas: parseInt(horasTrabajo),
            cantidad: parseInt(cantidad)
          };
        }
      });

      if (formValues) {
        return formValues;
      }
    },
    async confirmarPedido(cliente, infoProducto) {
      const idUsuario = localStorage.getItem("idUsuario");
      const datos = {
        usuario: idUsuario,
        cliente: cliente,
        lugar_realizado: "Sucursal",
        productos: [{
          id: "",
          nombre: infoProducto.nombre,
          precio: infoProducto.precio,
          horas_trabajo: infoProducto.horas,
          descripcion: infoProducto.descripcion,
          cantidad: infoProducto.cantidad,
        }],
        total: Math.ceil(parseInt(infoProducto.precio) * parseInt(infoProducto.cantidad)),
      };

      const htmlContent = `
    <div>
      <p><strong>Cliente:</strong> ${cliente}</p>
      <p><strong>Producto:</strong> ${infoProducto.nombre}</p>
      <p><strong>Precio:</strong> $${infoProducto.precio}</p>
      <p><strong>Cantidad:</strong> ${infoProducto.cantidad}</p>
      <p><strong>Descripción:</strong> ${infoProducto.descripcion}</p>
      <p><strong>Total:</strong> $${datos.total}</p>
    </div>
  `;

      try {
        const { isConfirmed } = await Swal.fire({
          title: 'Confirmar Pedido',
          html: htmlContent,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar Pedido',
          cancelButtonText: 'Cancelar'
        });

        if (isConfirmed) {
          this.realizarRegistroPedido(datos);
        }
      } catch (error) {
        console.error("Error al intentar confirmar el pedido: ", error);
        Swal.fire(
          'Error',
          'Hubo un problema al confirmar el pedido: ' + error.message,
          'error'
        );
      }
    },
    async realizarRegistroPedido(datos) {
      try {
        const url = apiEmpleado.registrarPedidoPersonalizado;

        const respuesta = await axios.post(url, datos);

        if (respuesta.status === 200) {
          console.log(respuesta);
          const idPedido = respuesta.data.id_pedido;
          localStorage.setItem("idPedido", idPedido);
          this.$router.push("/registro-pedido");
        }

      } catch (error) {
        console.log(error);
        this.manejarError(error);
      }
    },
    editarCatalogo() {
      this.$router.push("/productos-catalogo");
    },
    async definirTipo() {
      const tipo = localStorage.getItem("tipoUsuario");

      if (!tipo) {

        this.$router.push("/login");
        return;
      }
      this.tipo = tipo;
    },
    async cargarImagenes(productos) {
      await productos.forEach(async producto => {
        producto.imagen = await this.obtenerArchivoImagen(producto);
        this.productos.push(producto);
      });

      this.productosFiltrados = this.productos;
      this.updateKey += 1;
      this.$forceUpdate();
      this.mostrarCatalogo = true;
    },
    async obtenerArchivoImagen(producto) {
      const url = `${apiArchivos.obtener}?ruta=${producto.imagen}`;
      console.log(url);
      axios.get(url, { withCredentials: true })
        .then(response => {
          if (response.status == 200) {
            console.log(response.data);
            producto.imagen = response.data.url;
          }
          this.$forceUpdate();

        })
        .catch((error) => {

          if (error.response) {
            console.error('Mensaje del servidor:', error.response.data.error);

            if (error.response.status === 401) {
              this.volver();
              toast.error('No autorizado.', toastConf);
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
    },
    consultarProductos() {
      const url = apiCliente.consultarCatalogo;
      toast.promise(
        axios.get(url, { withCredentials: true }),
        {
          pending: 'Consultando productos...',
          success: 'Productos obtenidos.',
          error: 'No se pudo obtener los productos.',
        }, toastConf
      ).then((respuesta) => {
        if (respuesta.status === 200) {
          console.log(respuesta.data)
          this.cargarImagenes(respuesta.data);
          this.productos = [];
          this.productosFiltrados = this.productos;
        }
      }).catch((error) => {
        if (error.response) {
          console.error('Mensaje del servidor:', error.response.data.error);

          if (error.response.status === 401) {
            this.$router.push("/login")
            toast.error('No autorizado.');
          }
          if (error.response.status === 404) {
            toast.error('Informacion no encontrada.', toastConf);
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
    cerrarSesion() {
      localStorage.removeItem('tokenUsuario');
      localStorage.removeItem('idUsuario');
      this.$router.push("/login")
    },
    filtrarProductos(texto) {
      // Filtrar las noticias por título
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(texto.toLowerCase())
      );
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
    this.definirTipo().then(() => {
      this.consultarProductos();
    });
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
</style>
