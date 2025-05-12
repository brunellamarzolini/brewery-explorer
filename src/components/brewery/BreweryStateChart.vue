<script setup>
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import DataLabelsPlugin from 'chartjs-plugin-datalabels'
import { useBreweries } from '@/composables/useBreweries'

const { stateCounts } = useBreweries()
const chartRef = ref(null)

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, DataLabelsPlugin)

const chartData = computed(() => {
  const states = Object.keys(stateCounts.value)
  const counts = Object.values(stateCounts.value)

  /* const sortedStates = states
    .map((state, index) => ({ state, count: counts[index] }))
    .sort((a, b) => b.count - a.count) */

  // this is because the meta api has an error  and for US returns both Missouri and MIssouri
  const normalizedStateCounts = states.reduce((acc, state, index) => {
    const normalizedState = state.toLowerCase()
    acc[normalizedState] = (acc[normalizedState] || 0) + counts[index]
    return acc
  }, {})

  const sortedStates = Object.entries(normalizedStateCounts)
    .map(([state, count]) => ({ state: state.charAt(0).toUpperCase() + state.slice(1), count })) // Capitalize state names
    .sort((a, b) => b.count - a.count) 

  return {
    labels: sortedStates.map((item) => item.state),
    datasets: [
      {
        data: sortedStates.map((item) => item.count),
        //backgroundColor: sortedStates.map((_, index) => getRandomColor(index)),
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

// chart height based on number of bars
const barHeight = 30
const chartHeight = computed(() => {
  const numberOfBars = chartData.value.labels.length
  return Math.max(numberOfBars * barHeight, 400)
})

/* const chartWidth = computed(() => {
  const numberOfBars = chartData.value.labels.length
  return Math.max(numberOfBars * barHeight, 400)
}) */


// bar colors
function getRandomColor(index) {
  const colors = ['#659B5E', '#FF9F43', '#4A90E2', '#9B59B6', '#FF66CC']
  return colors[index % colors.length]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y', // Horizontal bar chart
  layout: {
    padding: {
      right: 30,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      anchor: 'end',
      align: 'end',
      formatter: (value) => value,
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
  <div class="state-chart">
    <div 
      class="chart-container"
      :style="{ height: chartHeight + 'px' }"
    >
    <!-- <div 
      class="chart-container" 
      :style="{ width: chartWidth + 'px' }"
    > -->
      <Bar ref="chartRef" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.state-chart {
  height: 400px;
  overflow-x: auto;
  //overflow-y: auto;

  .chart-container {
    width: 100%;
    //height: 400px;
  }
}
</style>