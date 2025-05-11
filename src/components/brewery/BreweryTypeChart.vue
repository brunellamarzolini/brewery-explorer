<template>
  <div class="brewery-type-chart" v-if="chartData">
    <Bar :data="chartData" :options="chartOptions"/>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import DataLabelsPlugin from 'chartjs-plugin-datalabels'
import { useBreweries } from '@/composables/useBreweries'

const { allByType } = useBreweries()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, DataLabelsPlugin)

// Compute the chart data dynamically based on the selected country
const chartData = computed(() => {
  const types = Object.keys(allByType.value)
  const counts = Object.values(allByType.value)  

  return {
    labels: types,
    datasets: [
      {
        data: counts,
        backgroundColor: types.map((_, index) => getRandomColor(index)),
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

// Generate a random color for each bar
function getRandomColor(index) {
  const colors = ['#659B5E', '#FF9F43', '#4A90E2', '#9B59B6', '#FF66CC']
  return colors[index % colors.length]
}

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

<style scoped lang="scss">
.brewery-type-chart {
  width: 100%;
  height: 400px;
}
</style>

