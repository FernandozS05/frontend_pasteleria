<template>
  <div class="chart-container">
    <canvas id="lineChart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById("lineChart");

      if (this.chart) {
        this.chart.destroy();
      }

      const labels = [
        "Lunes",
        "Martes",
      ];

      const data = {
        labels: labels,
        datasets: [
          {
            label: "Ganancias",
            data: [2430, 3250],
            fill: false,
            borderColor: "rgba(255, 192, 203, 1)",
            tension: 0.1,
          },
        ],
      };

      this.chart = new Chart(ctx, {
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
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
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
