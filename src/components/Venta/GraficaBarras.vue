<template>
  <div class="chart-container">
    <canvas id="barChart"></canvas>
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
      const ctx = document.getElementById("barChart");

      if (this.chart) {
        this.chart.destroy();
      }

      const data = {
        labels: ["Lunes", "Martes"],
        datasets: [
          {
            label: "Ganancias",
            data: [2430, 3250],
            backgroundColor: "rgba(255, 192, 203, 0.5)",
            borderColor: "rgba(255, 192, 203, 1)",
            borderWidth: 1,
          },
        ],
      };

      this.chart = new Chart(ctx, {
        type: "bar",
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
