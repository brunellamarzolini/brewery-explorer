<script setup>
import { computed, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import DataLabelsPlugin from 'chartjs-plugin-datalabels'
import { useBreweries } from '@/composables/useBreweries'

const { typeCounts } = useBreweries()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, DataLabelsPlugin)

// Compute the chart data dynamically based on the selected country
const chartData = computed(() => {
  const types = Object.keys(typeCounts.value)
  const counts = Object.values(typeCounts.value)  

  return {
    labels: types,
    datasets: [
      {
        data: counts,
        backgroundColor: '#659B5E',
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: '#FF7043',
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 3,
        maxBarThickness: 30
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  //indexAxis: 'y',
  layout: {
    padding: {
      top: 20,
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function(tooltipItem) {
          const count = tooltipItem.raw
          const percentage = ((count / chartData.value.datasets[0].data.reduce((a, b) => a + b)) * 100).toFixed(2)
          return `${count} (${percentage}%)`
        },
      },
    },
    legend: {
      display: false,
    },
    datalabels: {
      anchor: 'end',
      align: 'end',
    },
  },
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
}
</script>

<template>
  <div class="brewery-type-chart" v-if="chartData">
    <Bar :data="chartData" :options="chartOptions"/>
  </div>
</template>

<style scoped lang="scss">
.brewery-type-chart {
  width: 100%;
  height: 400px;
}
</style>

