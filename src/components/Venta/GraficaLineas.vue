<template>
  <div class="chart-container">
    <canvas id="lineChart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  mounted() {
    const ctx = document.getElementById("lineChart");

    const labels = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Ganancias",
          data: [1200, 1500, 1800, 1000, 2000, 2500, 800],
          fill: false,
          borderColor: "rgba(255, 192, 203, 1)",
          tension: 0.1,
        },
      ],
    };

    new Chart(ctx, {
      type: "line",
      data: data,
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