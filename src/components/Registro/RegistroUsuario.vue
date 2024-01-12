<template>
  <div class="container position-absolute top-50 start-50 translate-middle">
    <div class="row">
      <!-- Parte izquierda con imagen -->
      <div class="col-md-6 order-md-1">
        <img
          src="../../assets/Imagen2.png"
          alt="Imagen Pastelería"
          class="img-fluid"
        />
      </div>

      <!-- Parte derecha con degradado y formulario -->
      <div class="col-md-6 order-md-2">
        <div class="gradient-background">
          <div class="text-center mb-4">
            <!-- Logotipo y nombre de la pastelería -->
            <img
              src="../../assets/Logo1.png"
              alt="Logotipo Pastelería Zudey"
              class="img-fluid logo"
            />
            <h2 class="text-white">Pastelería Zudey</h2>
          </div>

          <h3 class="text-center mb-4">Registrarse</h3>
          <p class="text-center mb-4">
            Por favor ingrese sus datos personales.
          </p>

          <form>
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre</label>
              <input
                type="text"
                class="form-control"
                id="nombre"
                placeholder="Ingrese su nombre"
              />
            </div>

            <div class="mb-3">
              <label for="correo" class="form-label">Correo</label>
              <input
                type="email"
                class="form-control"
                id="correo"
                placeholder="Ingrese su correo"
              />
            </div>

            <div class="mb-3">
              <label for="contrasena" class="form-label">Contraseña</label>
              <input
                type="password"
                class="form-control"
                id="contrasena"
                placeholder="Ingrese su contraseña"
              />
            </div>

            <div class="mb-3">
              <label for="telefono" class="form-label"
                >Número de Teléfono</label
              >
              <input
                type="tel"
                class="form-control"
                id="telefono"
                placeholder="Ingrese su número de teléfono"
              />
            </div>

            <div class="d-grid gap-2">
              <button class="btn btn-secondary" type="button">Cancelar</button>
              <button class="btn btn-primary" type="button">Registrarse</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignUp",
};
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(to top, #ffffff, #ffc6d1);
  padding: 30px;
}

.logo {
  max-width: 100px;
}
</style>
