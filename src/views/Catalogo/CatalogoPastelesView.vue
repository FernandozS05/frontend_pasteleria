<template>
  <div class="row">
    <BarraNavegacion @cerrarSesion="cerrarSesion"/>
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
import apiUsuario from "@/config/ServidorEmpleado";
import apiArchivos from "@/config/ServidorArchivos";
import axios from 'axios';
import { toast } from 'vue3-toastify';
import toastConf  from "@/config/toast";
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
      productos : [
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
    definirApi() {
      const idUsuario = localStorage.getItem('idUsuario');
      if (idUsuario <  1000) {
        // Si el nombre de usuario contiene '@', selecciona la API de cliente
        this.tipo = "cliente";
      } else {
        // Si no, selecciona la API de usuario
        this.tipo = "empresa";
      }
    },
    async cargarImagenes(productos){
      await productos.forEach(async producto => {
        producto.imagen = await this.obtenerArchivoImagen(producto);
        this.productos.push(producto);
      });
      
      console.log(productos)
      this.productosFiltrados = this.productos;
      console.log(productos);
      this.updateKey += 1;
      this.$forceUpdate();
      this.mostrarCatalogo = true;
    },
    async obtenerArchivoImagen(producto){
            const url = `${apiArchivos.obtener}?ruta=${producto.imagen}`;
            console.log(url);
            axios.get(url, { responseType: 'blob', withCredentials: true })
            .then(response => {
            //const blob = new Blob([response.data], { type: response.headers['content-type'] });
            if(response.status == 200){
            //const extension = this.obtenerExtensionArchivo(ruta);
            //this.archivoImagen= new File([response.data], `archivoDoc.${extension}`);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const dataUrl = URL.createObjectURL(blob);
                
                // Asigna la URL de datos directamente a miniatura
                //this.miniatura = dataUrl;
                
                console.log("los datos: ", dataUrl);
                producto.imagen = dataUrl;
            }
            this.$forceUpdate();
            
            // Resto del código...
        })
        .catch((error) => {
                // Manejar errores de la petición
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
      const api = (this.tipo === "cliente") ? apiCliente : apiUsuario;
      const url = api.consultarProductos;
            console.log(url);
            // Usar toast.promise para mostrar un toast mientras la promesa está pendiente
            toast.promise(
                axios.get(url, { withCredentials: true }),
                {
                    pending: 'Consultando productos...', // Mensaje mientras la promesa está pendiente
                    success: 'Productos obtenidos.', // Mensaje cuando la promesa se resuelve con éxito
                    error: 'No se pudo obtener los productos.', // Mensaje cuando la promesa es rechazada
                }, toastConf
            ).then((respuesta) => {
                // Puedes realizar acciones adicionales después de que la promesa se resuelva
                // (opcional dependiendo de tus necesidades)
                console.log('Consulta completada');

                // Realizar acciones adicionales según la respuesta exitosa
                if (respuesta.status === 200) {
                    console.log(respuesta.data)
                    this.cargarImagenes(respuesta.data);
                    this.productos = [];
                    this.productosFiltrados = this.productos;
                }
            }).catch((error) => {
                // Manejar errores de la petición
                if (error.response) {
                    console.error('Mensaje del servidor:', error.response.data.error);

                    if (error.response.status === 401) {
                        toast.error('No autorizado.', toastConf);
                    }
                    if (error.response.status === 404) {
                        toast.error('Informacion no encontrada.', toastConf);
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
    cerrarSesion() {

      const api = (this.tipo === "cliente") ? apiCliente : apiUsuario;
      const url = api.logout;

      console.log(url);
      // Usar toast.promise para mostrar un toast mientras la promesa está pendiente
      toast.promise(
        axios.get(url, { withCredentials: true }),
        {
          pending: 'Cerrando sesión', // Mensaje mientras la promesa está pendiente
          success: 'Sesion cerrada correctamente', // Mensaje cuando la promesa se resuelve con éxito
          error: 'Error al cerrar sesión', // Mensaje cuando la promesa es rechazada
        }, toastConf
      ).then((respuesta) => {
        // Puedes realizar acciones adicionales después de que la promesa se resuelva
        // (opcional dependiendo de tus necesidades)
        console.log('Datos obtenidos correctamente');

        // Realizar acciones adicionales según la respuesta exitosa
        if (respuesta.status === 200) {
          // Borrar el ID del usuario almacenado en localStorage
          toast.success('Sesión cerrada correctamente!');
          setTimeout(() => {
            localStorage.removeItem('idUsuario');
            this.$router.push("/login")
          }, 2000);
          
        }
      }).catch((error) => {
        // Manejar errores de la petición
        if (error.response) {
          console.error('Mensaje del servidor:', error.response.data.error);

          toast.error('Error al cerrar sesión', toastConf);
          //localStorage.removeItem('idColaborador');
          //this.$router.push("/panel/login");
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
    filtrarProductos(texto) {
      // Filtrar las noticias por título
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(texto.toLowerCase())
      );
    },
  },
  mounted(){
    this.consultarProductos()
  }
};
</script>
