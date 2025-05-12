import { ref, computed, watch, provide } from 'vue'
import axios from 'axios'
import { debounce } from '@/utils/debounce';
import { useToast } from '@/composables/useToast';
const { showToast } = useToast();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let instance = null

export function useBreweries() {

  if (instance) return instance

  const breweries = ref([])
  const total     = ref(0)

  const stateOptions = ref({})
  const typeOptions  = ref({})

  const stateCounts = ref({})
  const typeCounts  = ref({})

  const page          = ref(1)
  const perPage       = ref(10)
  const q             = ref('')
  //const sort = ref('name:asc')
  const sort          = ref('')
  const countryFilter = ref('United States')
  const stateFilter   = ref('all')
  const typeFilter    = ref('all')

  const loading = ref(false)

  const totalPages = computed(() =>
    perPage.value ? Math.ceil(total.value / perPage.value) : 1
  )


  function buildPaginationParams() {
    const params = {
      page: page.value,
      per_page: perPage.value,
      //sort: sort.value,
    }
    if (sort.value)  params.sort = sort.value

    return params
  }

  function buildMetaParams() {
    const params = {}
    if (q.value.trim() && q.value.trim().length > 2)    params.by_name    = q.value.trim()
    if (countryFilter.value !== 'all')                  params.by_country = countryFilter.value
    if (stateFilter.value   !== 'all')                  params.by_state   = stateFilter.value
    if (typeFilter.value    !== 'all')                  params.by_type    = typeFilter.value
    return params
  }


  async function fetchList(updateMeta = false) {
    loading.value = true

    try {
      const paginationParams = buildPaginationParams()
      const metaParams = buildMetaParams()
      const listParams = { ...paginationParams, ...metaParams }

      // Fetch breweries and metadata
      const [breweriesResponse, metaResponse] = await Promise.all([
        axios.get(API_BASE_URL + '/breweries', { params: listParams }),
        axios.get(API_BASE_URL + '/breweries/meta', { params: metaParams }),
      ])

      breweries.value = breweriesResponse.data
      total.value = metaResponse.data.total || 0
      stateCounts.value = metaResponse.data.by_state || {}
      typeCounts.value  = metaResponse.data.by_type  || {}

      if (updateMeta) {
        stateOptions.value = metaResponse.data.by_state || {}
        typeOptions.value  = metaResponse.data.by_type  || {}
      }
      
    } catch (e) {
      const errorMessage = e.message || 'Failed to load breweries list';
      showToast(errorMessage, 'error');
    } finally {
      loading.value = false
    }
  }

  // Fetch meta by_state and by_type
  // I need to keep it separate beacause i need this only when the country changes
  /* async function fetchMeta() {
    try {
      const params = {}
      params.by_country = countryFilter.value
      const { data } = await axios.get(
        'https://api.openbrewerydb.org/v1/breweries/meta',
        { params }
      )
      stateOptions.value = data.by_state || {}
      typeOptions.value  = data.by_type  || {}
    } catch (e) {
      const errorMessage = 'Failed to load breweries metadata';
      showToast(errorMessage, 'error');
    }
  } */


  watch(countryFilter, () => {
    //fetchMeta()
    stateFilter.value = 'all' 
    typeFilter.value  = 'all'  
    page.value = 1
    fetchList(true)
  }, { immediate: true })

  watch(
    [ stateFilter, typeFilter, perPage, sort ],
    () => {
      page.value = 1
      fetchList()
    }
  )

  watch(page, fetchList)

  const debouncedFetchList = debounce((currentValue) => {
    //if (currentValue.trim().length == 0 || currentValue.trim().length > 2) {
      fetchList();
    //} 
  }, 500);

  //this api works with 3 chars at least. 
  // I didn't used the search api because it has another endpoint and I can't filter by state or type
  watch(q, (newVal) => {
      page.value = 1
      debouncedFetchList(newVal);
  });

 /*  watch(page, () => {
    fetchList()
  })
 */

  instance = {
    breweries,
    total,
    stateOptions,
    typeOptions,
    stateCounts,
    typeCounts,
    loading,
    page,
    perPage,
    q,
    sort,
    countryFilter,
    stateFilter,
    typeFilter,
    totalPages,
    //fetchMeta,
    fetchList,
  }

  return instance
}
