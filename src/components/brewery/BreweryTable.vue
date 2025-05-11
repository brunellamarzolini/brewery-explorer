<template>
  <Table
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
          :options="['all', ...stateOptions]"
          v-model="stateFilter"
          :key="stateFilter"
        />

        <!-- Type -->
        <Dropdown
          label="Type"
          :options="['all', ...typeOptions]"
          v-model="typeFilter"
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
        <!-- todo check if lat and long exist-->
        <a :href="`https://www.google.com/maps?q=${row.latitude},${row.longitude}`" target="_blank">
          {{ row.street }}
        </a>
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

    <div v-if="error" class="status error">{{ error }}</div>

</template>

<script setup>
import { computed, ref } from 'vue'
import { useBreweries } from '@/composables/useBreweries'
import Dropdown from '@/components/common/Dropdown.vue'
import Pagination from '@/components/common/Pagination.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import Table from '@/components/common/Table.vue'

const {
  breweries,
  loading,
  error,
  page,
  perPage,
  q,
  sort,
  countryFilter,
  stateFilter,
  typeFilter,
  allByState,
  allByType,
  total,
  totalPages
} = useBreweries()

function handleSort({ dir, key }) {
  sort.value = `${key}:${dir}`
}

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

const stateOptions = computed(() =>
  Object.keys(allByState.value).sort()
)
const typeOptions  = computed(() =>
  Object.keys(allByType.value).sort()
)

</script>

<style scoped lang="scss">
.status.error {
  margin-top: $space-3;
  color: $color-error;
}
</style>
