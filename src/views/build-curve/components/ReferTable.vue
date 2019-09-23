<template>
  <div>
    <h4 class="text-center">{{ name }}</h4>
    <List :data="make" :columns="columns" />
  </div>
</template>

<script>
import List from './List'
import { subtract } from '@/utils/math'
export default {
  components: { List },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: ''
    }
  },
  computed: {
    make() {
      return this.list.map((item) => {
        const _ = this.$lodash
        return _.assign(item, {
          rateChange: subtract(item.tRate, item.yRate)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
