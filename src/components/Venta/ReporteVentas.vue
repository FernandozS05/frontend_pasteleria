<!-- eslint-disable no-unused-vars -->
<template>
  <div class="row">
    <div class="row mt-3 border rounded border-4">
      <div class="row align-items-center my-3">
        <div class="col-3">
          <p class="fs-4 fw-medium">Resumen de ventas</p>
        </div>
        <div class="col-5 mt-1">
          <p class="fs-5">{{ `Datos obtenidos de ${encabezado}` }}</p>
        </div>
        <div class="col-4">
          <button class="btn btn-primary btn-sm" @click="consultarFechas">Cambiar mes/año</button>
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
          <select class="form-control" v-model="graficaSemanaSeleccionada">
            <option value="Semana1">{{ datos.ventasPorSemanas ? `Ventas semana ${datos.ventasPorSemanas[0].periodo}` :
              "Sin datos" }}</option>
            <option value="Semana2">{{ datos.ventasPorSemanas ? `Ventas semana ${datos.ventasPorSemanas[1].periodo}` :
              "Sin datos" }}</option>
            <option value="Semana3">{{ datos.ventasPorSemanas ? `Ventas semana ${datos.ventasPorSemanas[2].periodo}` :
              "Sin datos" }}</option>
            <option value="Semana4">{{ datos.ventasPorSemanas ? `Ventas semana ${datos.ventasPorSemanas[3].periodo}` :
              "Sin datos" }}</option>
          </select>
          <div class="chart-container" v-show="graficaSemanaSeleccionada == 'Semana1'">

            <canvas id="ventasPorSemana1"></canvas>
          </div>
          <div class="chart-container" v-show="graficaSemanaSeleccionada == 'Semana2'">
            <canvas id="ventasPorSemana2"></canvas>
          </div>
          <div class="chart-container" v-show="graficaSemanaSeleccionada == 'Semana3'">
            <canvas id="ventasPorSemana3"></canvas>
          </div>
          <div class="chart-container" v-show="graficaSemanaSeleccionada == 'Semana4'">
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
  name: "ReporteVentas",
  props: {

  },
  components: {

  },
  data() {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth() + 1; // Los meses son 0-indexados en JavaScript
    return {
      meses: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      mesActual: mesActual,
      anioActual: anioActual, fechaDesdeActual: `${anioActual}-${mesActual}-01`,
      mesSeleccionado: mesActual,
      anioSeleccionado: anioActual,
      graficaSemanaSeleccionada: "Semana1",
      encabezado: "",
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
    async consultarVentas() {
      try {
        // Validar que mes y año estén seleccionados
        if (!this.mesSeleccionado || !this.anioSeleccionado) {
          Swal.fire('Error', 'Por favor seleccione un mes y un año', 'error');
          return;
        }
        const mes = this.mesSeleccionado || new Date().getMonth() + 1;
        const anio = this.anioSeleccionado || new Date().getFullYear();

        const url = `${apiEmpleado.consultarVentas}?mes=${mes}&anio=${anio}`;

        Swal.fire({
          title: 'Consultando...',
          text: 'Por favor, espere.',
          didOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        });

        const respuesta = await axios.get(url);

        if (respuesta.status === 200) {

          Swal.close();
          console.log(respuesta.data);
          this.datos = respuesta.data;
          this.configurarGraficas();
          this.fechaDesdeActual = moment(`${this.anioSeleccionado}-${this.mesSeleccionado}-01`).format('YYYY-MM-DD');
          this.obtenerFechaReporte();
        }
      } catch (error) {
        Swal.close();
        this.manejarError(error);
      }
    },

    async seleccionarMesAnio() {
      try {
        const { value: fechaSeleccionada } = await Swal.fire({
          title: 'Selecciona mes y año',
          html: `
          <label for="swal-mes">Mes:</label>
          <select id="swal-mes" class="swal2-input">
            ${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
          </select>
          <label for="swal-anio">Año:</label>
          <input id="swal-anio" type="number" class="swal2-input" min="2000" max="${new Date().getFullYear()}" value="${new Date().getFullYear()}">`,
          focusConfirm: false,
          confirmButtonText: 'Consultar',
          preConfirm: () => {
            const mes = document.getElementById('swal-mes').value;
            const anio = document.getElementById('swal-anio').value;

            if (!mes || !anio) {
              Swal.showValidationMessage("Debes seleccionar un mes y un año");
              return false;
            }

            return { mes, anio };
          }
        });

        if (fechaSeleccionada) {
          this.mesSeleccionado = fechaSeleccionada.mes;
          this.anioSeleccionado = fechaSeleccionada.anio;
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error al obtener mes y año: ', error);
        return false;
      }
    },
    async consultarFechas() {
      if (await this.seleccionarMesAnio()) {
        this.consultarVentas();
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
      console.log()
      this.graficas.ventasPorSemana1 = new Chart(document.getElementById('ventasPorSemana1').getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: this.datos.ventasPorSemanas[0].labels.map(dia => dia),
          datasets: [{
            label: 'Ventas por la semana 1',
            data: this.datos.ventasPorSemanas[0].data.map(item => item),
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
          labels: this.datos.ventasPorSemanas[1].labels.map(dia => dia),
          datasets: [{
            label: 'Ventas por la semana 2',
            data: this.datos.ventasPorSemanas[1].data.map(item => item),
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
          labels: this.datos.ventasPorSemanas[2].labels.map(item => item),
          datasets: [{
            label: 'Ventas por la semana 3',
            data: this.datos.ventasPorSemanas[2].data.map(item => item),
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
          labels: this.datos.ventasPorSemanas[3].labels.map(item => item),
          datasets: [{
            label: 'Ventas por la semana 4',
            data: this.datos.ventasPorSemanas[3].data.map(item => item),
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

      console.log(this.datos.ventasPorTipoUltimoMes.map(item => item.tipo))
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

              }
            }
          },
          maintainAspectRatio: false,
          responsive: true
        }
      }
      );

    },
    obtenerFechaReporte() {
      moment.locale('es')
      this.encabezado = moment(this.fechaDesdeActual).format('MMMM YYYY')
    },
    destruirGraficas() {
      Object.keys(this.graficas).forEach(key => {
        if (this.graficas[key] != null) {
          this.graficas[key].destroy();
          this.graficas[key] = null;
        }
      });
    },
    calcularInicioSemana(fecha, semana) {
      let momento = moment(fecha).subtract(4, "weeks");
      let inicioSemana = momento.startOf('isoWeek');
      return inicioSemana.add((semana - 1) * 7, 'days').format('YYYY-MM-DD');
    },
    descargarReporte() {
      moment.locale('es');
      const currencyFormatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
      });
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      doc.setFontSize(10);
      doc.setFontSize(12);
      doc.text(`Reporte de ventas ${moment(this.fechaDesde).format('MMMM YYYY')}`, 14, 20);

      // Ventas por los últimos seis meses
      doc.setFontSize(10);
      doc.text('Ventas del último semestre', 14, 30);
      const columnasVentasMeses = ['Mes', 'Total de Ventas ($)'];
      const registrosVentasMeses = this.datos.ventasPorSemestre.map(registro => [
        registro.mes || 'N/A',
        currencyFormatter.format(registro.total)
      ]);
      doc.autoTable({
        startY: 35,
        head: [columnasVentasMeses],
        body: registrosVentasMeses,
        theme: 'grid'
      });

      let totalSemestre = this.datos.ventasPorSemestre.reduce((acc, item) => acc + item.total, 0);
      let startY = doc.previousAutoTable.finalY + 10;
      doc.text(`Total ventas del semestre: ${currencyFormatter.format(totalSemestre)}`, 14, startY);

      startY += 15;

      // Ventas individuales por las últimas 4 semanas
      doc.text('Ventas del mes', 14, startY);
      startY += 5; // Añadir un poco de espacio extra
      // eslint-disable-next-line no-unused-vars
      this.datos.ventasIndividualesCuatroSemanas.forEach((semana, index) => {
        doc.text(`Semana (${semana.periodo})`, 14, startY);
        const columnasVentasInd = ['ID Pedido', 'Tipo', 'Concepto', 'Fecha', 'Total ($)', 'Productos'];
        const registrosVentasInd = semana.registros.map(registro => [
          (registro.concepto !== 'Venta en inventario.' && registro.id_pedido) ? registro.id_pedido : 'N/A',
          registro.tipo,
          registro.concepto,
          registro.fecha,
          currencyFormatter.format(registro.total),
          registro.productos.map(prod => `${prod.nombre} (x${prod.cantidad})`).join(', ')
        ]);
        doc.autoTable({
          startY: startY + 5,
          head: [columnasVentasInd],
          body: registrosVentasInd,
          theme: 'grid'
        });

        let totalSemana = semana.registros.reduce((acc, registro) => acc + registro.total, 0);
        startY = doc.previousAutoTable.finalY + 5;
        doc.text(`Total de la semana: ${currencyFormatter.format(totalSemana)}`, 14, startY);

        startY += 15;
      });

      // Ventas por tipo en el último mes
      doc.text('Ventas por tipo', 14, startY);
      const columnasTipo = ['Tipo de Venta', 'Total de Ventas ($)'];
      const registrosVentasTipo = this.datos.ventasPorTipoUltimoMes.map(registro => [
        registro.tipo || 'N/A',
        currencyFormatter.format(registro.total)
      ]);
      doc.autoTable({
        startY: startY + 5,
        head: [columnasTipo],
        body: registrosVentasTipo,
        theme: 'grid'
      });

      
      startY = doc.previousAutoTable.finalY + 5;
      

      startY += 15;

      // Ventas por producto en el último mes
      doc.text('Ventas por producto', 14, startY);
      const columnasProducto = ['Producto', 'Cantidad', 'Total de Ventas ($)'];
      const registrosVentasProductos = this.datos.ventasPorProductoUltimoMes.map(registro => [
        registro.producto || 'N/A',
        `${registro.cantidad}`,
        currencyFormatter.format(registro.total)
      ]);
      doc.autoTable({
        startY: startY + 5,
        head: [columnasProducto],
        body: registrosVentasProductos,
        theme: 'grid'
      });

    
      startY = doc.previousAutoTable.finalY + 5;

      startY += 15;

      // Gastos e ingresos de insumos en el último mes
      doc.text('Gastos e ingresos de insumos', 14, startY);
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
      const nombreArchivo = `Reporte_Ventas_${moment(this.fechaDesde).format('MMMM_YYYY')}.pdf`;
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
