<template>
  <div class="chart-container">
    <canvas id="pieChart"></canvas>
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
      const ctx = document.getElementById("pieChart");

      if (this.chart) {
        this.chart.destroy();
      }

      const data = {
        labels: ["Lunes", "Martes"],
        datasets: [
          {
            label: "Ganancias",
            data: [2430, 3250],
            backgroundColor: [
              "rgba(255, 192, 203, 0.5)",
              "rgba(255, 192, 203, 0.8)",
              "rgba(255, 192, 203, 1)",
            ],
            hoverOffset: 4,
          },
        ],
      };

      this.chart = new Chart(ctx, {
        type: "pie",
        data: data,
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
