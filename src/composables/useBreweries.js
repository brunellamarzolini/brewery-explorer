import { ref, computed, watch } from 'vue'
import axios from 'axios'

let instance = null

export function useBreweries() {

  if (instance) return instance

  const breweries = ref([])
  const total     = ref(0)

  const allByState = ref({})
  const allByType  = ref({})

  const page          = ref(1)
  const perPage       = ref(10)
  const q             = ref('')
  const sort = ref('name:asc')
  const countryFilter = ref('United States')
  const stateFilter   = ref('all')
  const typeFilter    = ref('all')

  const loading = ref(false)
  const error   = ref(null)

  const totalPages = computed(() =>
    perPage.value ? Math.ceil(total.value / perPage.value) : 1
  )

  function buildParams() {
    const params = {
      page: page.value,
      per_page: perPage.value,
      sort: sort.value,

    }
    if (q.value.trim())                params.by_name    = q.value.trim()
    if (countryFilter.value !== 'all') params.by_country = countryFilter.value
    if (stateFilter.value   !== 'all') params.by_state   = stateFilter.value
    if (typeFilter.value    !== 'all') params.by_type    = typeFilter.value
    return params
  }


  async function fetchList() {
    loading.value = true
    error.value = null

    try {
      const params = buildParams()

      // Fetch breweries and metadata
      const [breweriesResponse, metaResponse] = await Promise.all([
        axios.get('https://api.openbrewerydb.org/v1/breweries', { params }),
        axios.get('https://api.openbrewerydb.org/v1/breweries/meta', { params }),
      ])

      breweries.value = breweriesResponse.data
      total.value = metaResponse.data.total || 0
      
    } catch (e) {
      error.value = e.message || 'Failed to load breweries list'
    } finally {
      loading.value = false
    }
  }

  // Fetch meta by_state and by_type
  // I need to keep it separate beacause i need this only when the country changes
  async function fetchMeta() {
    try {
      const params = {}
      params.by_country = countryFilter.value
      const { data } = await axios.get(
        'https://api.openbrewerydb.org/v1/breweries/meta',
        { params }
      )
      allByState.value = data.by_state || {}
      allByType.value  = data.by_type  || {}
    } catch (e) {
      error.value = 'Failed to load breweries metadata'
    }
  }



  watch(countryFilter, () => {
    fetchMeta()
    stateFilter.value = 'all' // Update the stateFilter value
    page.value = 1
    fetchList()
  }, { immediate: true })

  watch(
    [ stateFilter, typeFilter, perPage, sort ],
    () => {
      page.value = 1
      fetchList()
    }
  )

  watch(q, (newVal)=> {
    newVal.length > 2 ? fetchList() : null //this api works with 3 chars at least. I didn't used the search api because it has another endpoint and I can't filter by state or type

  })

  watch(page, fetchList)

  instance = {
    breweries,
    total,
    allByState,
    allByType,
    loading,
    error,
    page,
    perPage,
    q,
    sort,
    countryFilter,
    stateFilter,
    typeFilter,
    totalPages,
    fetchMeta,
    fetchList,
  }

  return instance
}
