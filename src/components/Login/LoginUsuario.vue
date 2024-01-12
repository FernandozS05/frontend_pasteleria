<template>
  <div class="container position-absolute top-50 start-50 translate-middle">
    <div class="row">
      <div class="col-md-6 order-md-2 mt-5">
        <img
          src="../../assets/Imagen2.png"
          alt="Imagen Pastelería"
          class="img-fluid"
        />
      </div>

      <div class="col-md-6 order-md-1 mt-5">
        <div class="gradient-background p-3">
          <div class="mb-3">
            <img
              src="../../assets/Logo1.png"
              alt="Logotipo Pastelería Zudey"
              class="img-fluid logo"
            />
          </div>
          <h2 class="text-center mb-2">Pastelería Zudey</h2>

          <p class="text-center">Iniciar sesión</p>
          <p class="text-center mb-4">
            ¡Bienvenido de nuevo! Por favor ingrese sus datos.
          </p>

          <form>
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

            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="recordarContraseña"
              />
              <label class="form-check-label" for="recordarContraseña"
                >Recordar contraseña</label
              >
              <a href="#" class="ml-2">¿Has olvidado la contraseña?</a>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3">
              <button class="btn btn-rose" type="button">Iniciar Sesión</button>
              <router-link to="/registro" class="text-rose"
                >¿No tienes una cuenta? Registrarse</router-link
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginUsuario",
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

.btn-rose {
  background-color: #fe8092;
  color: #ffffff;
}
</style>