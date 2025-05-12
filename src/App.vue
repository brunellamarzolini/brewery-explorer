<script setup>
  import Toast from '@/components/common/Toast.vue';
  import Card from './components/common/Card.vue'
  import BreweryTable from './components/brewery/BreweryTable.vue'
  import BreweryTypeChart from './components/brewery/BreweryTypeChart.vue'
  import BreweryStateChart from './components/brewery/BreweryStateChart.vue'
  import { useBreweries } from '@/composables/useBreweries'

  const { countryFilter, stateFilter, typeFilter, q } = useBreweries()
</script>

<template>
  <div class="app">
    <Toast />

    <div class="container">
      <Card title="Brewery Explorer">
        <BreweryTable />
      </Card>

      <Card title="Brewery Distribution">
        
        <div class="filters">
          <div class="row">
            <span class="label">Country:</span>
            <span class="value">{{ countryFilter }}</span>
          </div>
          <div class="row" v-if="stateFilter && stateFilter != 'all'">
            <span class="label">State/Province:</span>
            <span class="value">{{ stateFilter }}</span>
          </div>
          <div class="row" v-if="typeFilter && typeFilter != 'all'">
            <span class="label">Brewery Type:</span>
            <span class="value">{{ typeFilter }}</span>
          </div>
          <div class="row" v-if="q && q.length > 2">
            <span class="label">Name contains:</span>
            <span class="value">{{ q }}</span>
          </div>
        </div>
        
        <div class="charts">
          <BreweryStateChart />
          <BreweryTypeChart />
        </div>
      </Card>

    </div>
  </div>
</template>

<style scoped lang="scss">

.filters {
  display: grid;
  grid-template-columns: 120px auto;
  gap: $space-2 $space-3; 
  margin-bottom: $space-3;

  .row {
    display: contents;
  }

  .label {
    font-weight: bold;
    text-align: left;
  }

  .value {
    text-align: left;
  }
}

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

