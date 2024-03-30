<template>
    <div>
      <h4>Cambiar Contraseña de Empleado</h4>
      <form @submit.prevent="guardarCambios" class="formulario gradient-background">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre del Empleado:</label>
          <input
            type="text"
            v-model="nombre"
            id="nombre"
            class="form-control"
            readonly
          />
        </div>
        <div class="mb-3">
          <label for="telefono" class="form-label">Teléfono:</label>
          <input
            type="text"
            v-model="telefono"
            id="telefono"
            class="form-control"
            readonly
          />
        </div>
        <div class="mb-3">
          <label for="correo" class="form-label">Correo Electrónico:</label>
          <input
            type="email"
            v-model="correo"
            id="correo"
            class="form-control"
            readonly
          />
        </div>
        <div class="mb-3">
          <label for="nuevaContrasenia" class="form-label">Nueva Contraseña:</label>
          <input
            type="password"
            v-model="nuevaContrasenia"
            id="nuevaContrasenia"
            class="form-control"
            required
          />
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
          <button type="button" class="btn btn-outline-secondary me-md-2" @click="generarContrasenia">Generar Contraseña Aleatoria</button>
          <button type="submit" class="btn btn-rose">Guardar Cambios</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { toast } from "vue3-toastify";
  
  export default {
    props: {
      nombreEmpleado: {
        type: String,
        required: true
      },
      telefonoEmpleado: {
        type: String,
        required: true
      },
      correoEmpleado: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        nuevaContrasenia: ""
      };
    },
    methods: {
      generarContrasenia() {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let contraseniaAleatoria = "";
        for (let i = 0; i < 8; i++) {
          contraseniaAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        this.nuevaContrasenia = contraseniaAleatoria;
      },
      guardarCambios() {
        console.log("Nueva contraseña:", this.nuevaContrasenia);
        toast.success("Contraseña cambiada correctamente.");
        this.nuevaContrasenia = "";
      }
    }
  };
  </script>
  
  <style scoped>
  .formulario {
    max-width: 700px;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
  }
  
  .gradient-background {
    background: linear-gradient(to top, #ffffff, #ffc6d1);
  }
  
  .text-rose {
    color: #fe8092;
  }
  
  .btn-rose {
    background-color: #fe8092;
    color: #ffffff;
    border-color: #fe8092;
  }
  
  .btn-outline-secondary {
    color: #fe8092;
    border-color: #fe8092;
  }
  </style>
  