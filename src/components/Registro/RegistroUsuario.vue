<template>
  <div>
    <router-view></router-view>
    <div class="container">
      <div class="row">
        <div class="col-md-6 p-4">
          <div class="seccion-izquierda">
            <img
              src="../../assets/Imagen2.png"
              alt="Imagen Pastelería"
              class="img-fluid w-100"
            />
          </div>
        </div>

        <div class="col-md-6 p-4">
          <div class="seccion-derecha text-center">
            <div id="degradado-rosa" class="d-flex align-items-center">
              <img src="../../assets/Logo1.png" alt="Logo Pastelería" />
              <h1 class="ml-2">Pastelería Zudey</h1>
            </div>
            <h2 class="mt-4">Registrarse</h2>
            <p class="mb-4">Por favor, ingrese sus datos personales.</p>

            <form @submit.prevent="registro">
              <p class="text-danger">{{ registroError }}</p>
              <div class="mb-3">
                <input
                  v-model="nombre"
                  type="text"
                  placeholder="Nombre"
                  required
                  class="form-control"
                />
              </div>

              <div class="d-flex justify-content-between">
                <router-link
                  to="/iniciarSesion"
                  class="btn btn-secondary"
                  :class="{ active: $route.path === '/iniciarSesion' }"
                  aria-current="page"
                  >Cancelar</router-link
                >
                <button type="submit" class="btn btn-primary">
                  Registrarse
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nombre: "",
      registroError: "",
    };
  },
  methods: {
    registro() {
    },
  },
};
</script>

<style scoped>
</style>
