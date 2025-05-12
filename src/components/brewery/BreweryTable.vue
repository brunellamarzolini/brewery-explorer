<script setup>
import { computed } from 'vue'
import { useBreweries } from '@/composables/useBreweries'
import Dropdown from '@/components/common/Dropdown.vue'
import Pagination from '@/components/common/Pagination.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import Table from '@/components/common/Table.vue'

const {
  breweries,
  loading,
  page,
  perPage,
  q,
  sort,
  countryFilter,
  stateFilter,
  typeFilter,
  stateOptions,
  typeOptions,
  total,
  totalPages
} = useBreweries()


const headers = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'brewery_type', label: 'Type', sortable: false },
  { key: 'country', label: 'Country', sortable: false },
  { key: 'state', label: 'State', sortable: false },
  { key: 'city', label: 'City', sortable: true },
  { key: 'address', label: 'Address', sortable: false },
  { key: 'phone', label: 'Phone', sortable: false },
]

const countryOptions = [
  'Austria',
  'England',
  'France',
  'Isle of Man',
  'Ireland',
  'Poland',
  'Portugal',
  'Scotland',
  'Singapore',
  'South Korea',
  'United States'
]

const sortedStateOptions = computed(() =>
  Object.keys(stateOptions.value).sort()
)
const sortedTypeOptions  = computed(() =>
  Object.keys(typeOptions.value).sort()
)

function handleSort({ dir, key }) {
  sort.value = `${key}:${dir}`
}

</script>

<template>
  <Table
      v-if="breweries"
      :headers="headers"
      :rows="breweries"
      :loading="loading"
      @update:sort="handleSort($event)"
    >
      <template #filters>
        <!-- Country -->
        <Dropdown
          label="Country"
          :options="[...countryOptions]"
          v-model="countryFilter"
        />
        <!-- State -->
        <Dropdown
          label="State/Province"
          :options="['all', ...sortedStateOptions]"
          v-model="stateFilter"
          :key="stateFilter"
        />

        <!-- Type -->
        <Dropdown
          label="Type"
          :options="['all', ...sortedTypeOptions]"
          v-model="typeFilter"
          :key="typeFilter"
        />

        <!-- Name search -->
        <SearchInput
          v-model="q"
          placeholder="Search by name (at least 3 characters)"
        />
      </template>

      <template #name="{ row }">
        <a :href="row.website_url" target="_blank">{{ row.name }}</a>
      </template>
      <template #address="{ row }">
        <a v-if="row.latitude && row.longitude"
          :href="`https://www.google.com/maps?q=${row.latitude},${row.longitude}`" target="_blank">
          {{ row.street }}
        </a>
        <span v-else>{{ row.street }}</span>
      </template>
      <template #phone="{ row }">
        <a :href="`tel:${row.phone}`">{{ row.phone }}</a>
      </template>

      <!-- Footer Slot -->
      <template #footer>
        <div>
          <span v-if="total > 0">
            {{ total }} items
          </span>
          <span v-else>
            No items found
          </span>
        </div>

        <Pagination
          :current-page="page"
          :total-pages="totalPages"
          @update:currentPage="page = $event"
        />

        <!-- Per-page -->
        <Dropdown
          :options="['10','20','50']"
          v-model="perPage"
          :style="{ 'min-width': 'auto' }"
        />
      </template>

    </Table>

</template>

<style scoped lang="scss">

</style>
