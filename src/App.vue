<template>
  <div class="container">
<!--<h1>Brewery Explorer</h1>-->
    <!-- Card for the Table -->
    <Card title="Brewery Explorer">
      <BreweryTable />
    </Card>

    <!-- Card for the Chart -->
    <Card :title="'Brewery Distribution in ' + (countryFilter === 'all' ? 'all over the world' : countryFilter)">
      <div class="charts">
  
      <BreweryTypeChart />
      <BreweryStateChart />
      
      </div>
    </Card>

  </div>
</template>

<script setup>
import { toRef } from 'vue'
import Card from './components/common/Card.vue'
import BreweryTable from './components/brewery/BreweryTable.vue'
import BreweryTypeChart from './components/brewery/BreweryTypeChart.vue'
import BreweryStateChart from './components/brewery/BreweryStateChart.vue'
import { useBreweries } from '@/composables/useBreweries'

const { countryFilter } = useBreweries()
</script>

<style scoped lang="scss">
.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  .brewery-type-chart,
  .state-chart {
    flex: 1 1 45%;
  }
}
</style>

