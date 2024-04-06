<template>
  <div class="row">
    <BarraNavegacion @cerrarSesion="cerrarSesion" />
    <div class="row mt-3 border rounded border-4">
      <div class="row">
        <p class="col-6 fs-4 align-items-start  fw-medium subtitulo">Productos disponibles</p>
        <BarraBusqueda class="col-6 align-items-center" :placeholder="Buscar" @filtrar="filtrarProductos" />
      </div>
      <div class="row">
        <CatalogoPasteles v-if="mostrarCatalogo" :key="updateKey" v-bind:productos="productosFiltrados" />
      </div>
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
    definirTipo() {
      const idUsuario = localStorage.getItem('idUsuario');
      if (idUsuario < 1000) {
        this.tipo = "cliente";
      } else {
        this.tipo = "empresa";
      }
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
  },
  mounted() {
    this.definirTipo();
    this.consultarProductos()
  }
};
</script>
