<!-- eslint-disable no-unused-vars -->
<template>
  <div class="row">
    <div class="row mt-3 border rounded border-4">
      <div class="row align-items-center my-3">
        <div class="col-3">
          <p class="fs-4 fw-medium">Reporte de ventas</p>
        </div>
        <div class="col-5 mt-1">
          <p class="fs-5">{{ `Datos obtenidos anteriores al ${this.fechaDesdeActual ? this.fechaDesdeActual : " "} ` }}
          </p>
        </div>
        <div class="col-4">
          <button class="btn btn-primary btn-sm" @click="consultarFechas">Cambiar fecha referencia</button>
          <button class="btn btn-primary btn-sm ms-4" @click="descargarReporte">Descargar reporte</button>
        </div>
      </div>
    </div>
    <div class="row mt-3 border rounded border-4">
      <div class="row">
        <div class="col-6 mt-3">
          <h4>Ventas por Semestre</h4>
          <div class="chart-container">
            <canvas id="ventasPorSemestre"></canvas>
          </div>
        </div>
        <div class="col-6 mt-3">
          <h4>Ventas últimas 4 semanas</h4>
          <select class="form-control" v-model="graficaSemanaSeleccionada">
            <option value="Semana1">Semana 1</option>
            <option value="Semana2">Semana 2</option>
            <option value="Semana3">Semana 3</option>
            <option value="Semana4">Semana 4</option>
          </select>
          <div class="chart-container" v-show="graficaSemanaSeleccionada == 'Semana1'">

            <canvas id="ventasPorSemana1"></canvas>
          </div>
          <div class="chart-container" v-show="graficaSemanaSeleccionada == 'Semana2'">
            <h4>Ventas Semana 2</h4>
            <canvas id="ventasPorSemana2"></canvas>
          </div>
          <div class="chart-container" v-show="graficaSemanaSeleccionada == 'Semana3'">
            <h4>Ventas Semana 3</h4>
            <canvas id="ventasPorSemana3"></canvas>
          </div>
          <div class="chart-container" v-show="graficaSemanaSeleccionada == 'Semana4'">
            <h4>Ventas Semana 4</h4>
            <canvas id="ventasPorSemana4"></canvas>
          </div>
        </div>
        <div class="col-6 mt-3">
          <h4>Ventas por Tipo del Mes</h4>
          <div class="chart-container">
            <canvas id="ventasPorTipoMes"></canvas>
          </div>
        </div>
        <div class="col-6 mt-3">
          <h4>Ventas por Producto del Mes</h4>
          <div class="chart-container">
            <canvas id="ventasPorProductoMes"></canvas>
          </div>
        </div>
        <div class="col-6 mt-3">
          <h4>Insumos Ingresados vs Consumidos</h4>
          <div class="chart-container">
            <canvas id="insumosVsConsumidosMes"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';
import apiEmpleado from '@/config/ServidorEmpleado';
import axios from "@/config/axios.js";
import moment from 'moment-timezone';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default {
  name: "TablaVentas",
  props: {

  },
  components: {

  },
  data() {
    return {
      fechaDesdeActual: null,
      fechaFinalActual: null,
      fechaDesde: "2024-04-01",
      fechaFinal: "2024-04-30",
      graficaSemanaSeleccionada: "Semana1",
      datos: {
      },
      graficas: {
        ventasPorSemestre: null,
        ventasPorSemana1: null,
        ventasPorSemana2: null,
        ventasPorSemana3: null,
        ventasPorSemana4: null,
        ventasPorProductoMes: null,
        ventasPorTipoMes: null,
        insumosVsConsumidosMes: null
      },
    };
  },
  methods: {
    async obtenerFechaGraficas() {
      try {
        const { value: fechaSeleccionada } = await Swal.fire({
          title: 'Selecciona una fecha',
          html: '<label for="swal-input1">Fecha:</label>' +
            '<input id="swal-input1" type="date" class="swal2-input">',
          focusConfirm: false,
          confirmButtonText: 'Consultar',
          preConfirm: () => {
            let fecha = document.getElementById('swal-input1').value;

            if (!fecha) {
              Swal.showValidationMessage("Debes seleccionar una fecha");
              return false;
            }

            return fecha;
          }
        });

        if (fechaSeleccionada) {
          this.fechaDesde = fechaSeleccionada;
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error al obtener la fecha: ', error);
        return false;
      }
    }
    ,
    async consultarFechas() {
      if (await this.obtenerFechaGraficas()) {
        this.consultarVentas();
      }
    },
    async consultarVentas() {
      try {
        const url = apiEmpleado.consultarVentas + `?fechaDesde=${moment(this.fechaDesde).format('YYYY-MM-DD')}`;
        console.log(url);
        const respuesta = await axios.get(url);

        if (respuesta.status === 200) {
          console.log(respuesta.data);
          this.datos = respuesta.data;
          this.configurarGraficas();
          this.fechaDesdeActual = moment(this.fechaDesde).format('YYYY-MM-DD')
        }
      } catch (error) {
        this.manejarError(error);
      }
    },
    convertirAFechaMexicoCentral(fechaUTC) {
      return moment(fechaUTC).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
    },
    configurarGraficas() {
      if (!this.graficas.ventasPorSemestre) {
        this.crearGraficas();
      } else {
        this.destruirGraficas();
        this.crearGraficas();
      }
    },
    crearGraficas() {

      const currencyFormatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
      });


      this.graficas.ventasPorSemestre = new Chart(document.getElementById('ventasPorSemestre').getContext('2d'), {
        type: 'bar',
        data: {
          labels: this.datos.ventasPorSemestre.map(item => item.mes),
          datasets: [{
            label: 'Ventas por Mes en el año actual',
            data: this.datos.ventasPorSemestre.map(item => item.total),
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              ticks: {
                // eslint-disable-next-line no-unused-vars
                callback: function (value, index, values) {
                  return currencyFormatter.format(value);
                }
              }
            }
          },
          maintainAspectRatio: false,
          responsive: true
        }
      });

      this.graficas.ventasPorSemana1 = new Chart(document.getElementById('ventasPorSemana1').getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: this.datos.ventarPorSemanas[0].labels.map(dia => dia),
          datasets: [{
            label: 'Ventas por la semana 1',
            data: this.datos.ventarPorSemanas[0].data.map(item => item),
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              ticks: {
                // eslint-disable-next-line no-unused-vars
                callback: function (value, index, values) {
                  return currencyFormatter.format(value);
                }
              }
            }
          },
          maintainAspectRatio: false,
          responsive: true
        }
      });


      this.graficas.ventasPorSemana2 = new Chart(document.getElementById('ventasPorSemana2').getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: this.datos.ventarPorSemanas[1].labels.map(dia => dia),
          datasets: [{
            label: 'Ventas por la semana 2',
            data: this.datos.ventarPorSemanas[1].data.map(item => item),
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              ticks: {
                // eslint-disable-next-line no-unused-vars
                callback: function (value, index, values) {
                  return currencyFormatter.format(value);
                }
              }
            }
          },
          maintainAspectRatio: false,
          responsive: true
        }
      });

      this.graficas.ventasPorSemana3 = new Chart(document.getElementById('ventasPorSemana3').getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: this.datos.ventarPorSemanas[2].labels.map(item => item),
          datasets: [{
            label: 'Ventas por la semana 3',
            data: this.datos.ventarPorSemanas[2].data.map(item => item),
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              ticks: {
                // eslint-disable-next-line no-unused-vars
                callback: function (value, index, values) {
                  return currencyFormatter.format(value);
                }
              }
            }
          },
          maintainAspectRatio: false,
          responsive: true
        }
      });

      this.graficas.ventasPorSemana4 = new Chart(document.getElementById('ventasPorSemana4').getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: this.datos.ventarPorSemanas[3].labels.map(item => item),
          datasets: [{
            label: 'Ventas por la semana 3',
            data: this.datos.ventarPorSemanas[3].data.map(item => item),
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              ticks: {
                // eslint-disable-next-line no-unused-vars
                callback: function (value, index, values) {
                  return currencyFormatter.format(value);
                }
              }
            }
          },
          maintainAspectRatio: false,
          responsive: true
        }
      });

      this.graficas.ventasPorTipoMes = new Chart(document.getElementById('ventasPorTipoMes').getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: this.datos.ventasPorTipoUltimoMes.map(item => item.tipo),
          datasets: [{
            label: 'Ventas por las ultimas 4 semanas.',
            data: this.datos.ventasPorTipoUltimoMes.map(item => item.total),
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              ticks: {
                // eslint-disable-next-line no-unused-vars
                callback: function (value, index, values) {
                  return currencyFormatter.format(value);
                }
              }
            }
          },
          maintainAspectRatio: false,
          responsive: true
        }
      });

      this.graficas.ventasPorProductoMes = new Chart(document.getElementById('ventasPorProductoMes').getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: this.datos.ventasPorProductoUltimoMes.map(item => item.producto),
          datasets: [{
            label: 'Ventas por producto las ultimas 4 semanas.',
            data: this.datos.ventasPorProductoUltimoMes.map(item => item.total),
            borderWidth: 1
          }]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            y: {
              ticks: {
                // eslint-disable-next-line no-unused-vars
                callback: function (value, index, values) {
                  return currencyFormatter.format(value);
                }
              },
              beginAtZero: true
            }
          }
        }
      });

      this.graficas.insumosVsConsumidosMes = new Chart(document.getElementById('insumosVsConsumidosMes').getContext('2d'), {
        type: 'bar',
        data: {
          labels: this.datos.InsumosIngresadosVSConsumidos.map(item => item.nombre),
          datasets: [{
            label: 'Ingresos',
            data: this.datos.InsumosIngresadosVSConsumidos.map(item => item.ingresos),

            borderWidth: 1
          }, {
            label: 'Gastos',
            data: this.datos.InsumosIngresadosVSConsumidos.map(item => item.gastos),
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              ticks: {
                // eslint-disable-next-line no-unused-vars
                callback: function (value, index, values) {
                  return currencyFormatter.format(value);
                }
              }
            }
          },
          maintainAspectRatio: false,
          responsive: true
        }
      }
      );

    },
    calcularInicioSemana(fecha, semana) {
      let momento = moment(fecha).subtract(4, "weeks");
      let inicioSemana = momento.startOf('isoWeek');
      return inicioSemana.add((semana - 1) * 7, 'days').format('YYYY-MM-DD');
    },
    destruirGraficas() {
      Object.keys(this.graficas).forEach(key => {
        if (this.graficas[key] != null) {
          this.graficas[key].destroy();
          this.graficas[key] = null;
        }
      });
    },
    descargarReporte() {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Ventas por los últimos seis meses
      doc.setFontSize(10);
      doc.setFontSize(12);
      doc.text(`Reporte de Ventas ${moment(this.fechaDesde).format('YYYY-MM-DD')}`, 14, 20);

      // Ventas por los últimos seis meses
      doc.setFontSize(10);
      doc.text('Ventas por los últimos seis meses', 14, 30);
      const columnasVentasMeses = ['Mes', 'Total de Ventas ($)'];
      const registrosVentasMeses = this.datos.ventasPorSemestre.map(registro => [
        registro.mes || 'N/A',
        `$${registro.total.toLocaleString()}`
      ]);
      doc.autoTable({
        startY: 35,
        head: [columnasVentasMeses],
        body: registrosVentasMeses,
        theme: 'grid'
      });

      let totalSemestre = registrosVentasMeses.reduce((acc, item) => acc + parseFloat(item[1].replace('$', '').replace(',', '')), 0);
      let startY = doc.previousAutoTable.finalY + 10;
      doc.text(`Total ventas del semestre: $${totalSemestre.toLocaleString()}`, 14, startY);

      startY += 10;

      doc.text('Ventas por las últimas 4 semanas', 14, startY);

      startY += 10;
      // Función para agregar ventas semanales
      this.datos.ventarPorSemanas.forEach((semana, index) => {
        let fechaInicioSemana = this.calcularInicioSemana(this.fechaDesde, index + 1);
        doc.text(`Ventas Semana ${index + 1} (Inicio: ${fechaInicioSemana})`, 14, startY + 10);
        const columnasVentasDias = ['Día', 'Total de Ventas ($)'];
        const registrosVentasDias = semana.labels.map((label, idx) => [label, `$${semana.data[idx].toLocaleString()}`]);
        doc.autoTable({
          startY: startY + 15,
          head: [columnasVentasDias],
          body: registrosVentasDias,
          theme: 'grid'
        });
        startY = doc.previousAutoTable.finalY + 10;
        doc.text(`Total por la semana ${index + 1}: $${semana.data.reduce((acc, val) => acc + val, 0).toLocaleString()}`, 14, startY);
        startY += 10;
      });

      // Ventas por tipo en el último mes
      doc.text('Ventas por tipo en el último mes', 14, startY);
      const columnasTipo = ['Tipo de Venta', 'Total de Ventas ($)'];
      const registrosVentasTipo = this.datos.ventasPorTipoUltimoMes.map(registro => [
        registro.tipo || 'N/A',
        `$${registro.total}`
      ]);
      doc.autoTable({
        startY: startY + 5,
        head: [columnasTipo],
        body: registrosVentasTipo,
        theme: 'grid'
      });

      startY = doc.previousAutoTable.finalY + 10;

      // Ventas por producto en el último mes
      doc.text('Ventas por producto en el último mes', 14, startY);
      const columnasProducto = ['Producto', 'Total de Ventas ($)'];
      const registrosVentasProductos = this.datos.ventasPorProductoUltimoMes.map(registro => [
        registro.producto || 'N/A',
        `$${parseFloat(registro.total)}`
      ]);
      doc.autoTable({
        startY: startY + 5,
        head: [columnasProducto],
        body: registrosVentasProductos,
        theme: 'grid'
      });

      startY = doc.previousAutoTable.finalY + 10;

      // Gastos e ingresos de insumos en el último mes
      doc.text('Gastos e ingresos de insumos en el último mes', 14, startY);
      const columnasInsumos = ['Insumo', 'Ingresos', 'Gastos'];
      const registrosGastosInsumos = this.datos.InsumosIngresadosVSConsumidos.map(registro => [
        registro.nombre || 'N/A',
        registro.ingresos.toLocaleString(),
        registro.gastos.toLocaleString()
      ]);
      doc.autoTable({
        startY: startY + 5,
        head: [columnasInsumos],
        body: registrosGastosInsumos,
        theme: 'grid'
      });

      // Guardar el PDF
      const nombreArchivo = `Reporte_Ventas_${moment(this.fechaDesde).format('YYYY-MM-DD')}.pdf`;
      doc.save(nombreArchivo);
    },
    filtrarPorFecha(fecha) {
      console.log("Filtrar por fecha:", fecha);
    },
    totalDias(total, element) {
      return total + element;
    },
    manejarError(error) {
      console.error('Error:', error);
    }
  },
  mounted() {
    this.fechaDesde = moment();
    this.fechaDesdeActual = moment(this.fechaDesde).format('YYYY-MM-DD')
    this.consultarVentas();
  }
};
</script>

<style scoped>
.chart-container {
  height: 400px;
  width: 100%;
  margin-top: 4px;
  margin-bottom: 4px;
}

canvas {
  width: 100%;
  height: 100%;
  /* Altura relativa al contenedor padre */
}
</style>
