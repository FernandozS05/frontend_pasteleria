<template>
  <div class="container position-absolute top-50 start-50 translate-middle">
    <div class="row">
      <div class="col-md-6 order-md-1 mt-5">
        <img
          src="../../assets/Imagen2.png"
          alt="Imagen Pastelería"
          class="img-fluid"
        />
      </div>

      <div class="col-md-6 order-md-2 mt-5">
        <div class="gradient-background p-3">
          <div class="mb-3">
            <img
              src="../../assets/Logo1.png"
              alt="Logotipo Pastelería Zudey"
              class="img-fluid logo"
            />
          </div>
          <h2 class="text-center mb-4">Pastelería Zudey</h2>

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

            <div class="d-flex justify-content-between align-items-center mt-3">
              <button class="btn btn-outline-secondary text-rose" type="button">
                Cancelar
              </button>
              <button class="btn btn-rose" type="button">Registrarse</button>
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
}

.logo {
  max-width: 100px;
}

.text-rose {
  color: #fe8092;
}

.btn-outline-secondary {
  color: #fe8092;
  border-color: #fe8092;
}

.btn-rose {
  background-color: #fe8092;
  color: #ffffff;
}
</style>
