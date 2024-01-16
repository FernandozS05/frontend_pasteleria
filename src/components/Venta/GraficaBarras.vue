<template>
    <div class="chart-container">
      <canvas id="myChart"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from "chart.js/auto";
  
  export default {
    mounted() {
      const ctx = document.getElementById("myChart");
  
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
          datasets: [
            {
              label: "Ganancias",
              data: [1200, 1500, 1800, 1000, 2000, 2500, 800],
              borderWidth: 1,
              backgroundColor: "rgba(255, 192, 203, 0.5)",
              borderColor: "rgba(255, 192, 203, 1)",
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    height: 40vh;
    width: 80vw;
    margin: 20px;
    padding: 20px;
  }
  </style>
  