<template>
  <div>
    <b-modal ref="history-modal" size="xl" hide-footer title="My Checked List">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      >
      </b-pagination>
      <b-table
        responsive="true"
        hover
        striped
        :items="items"
        :per-page="perPage"
        :current-page="currentPage"
        small
      >
        <template v-if="row.value != ''" slot="CheckInTime" slot-scope="row">
          {{ new Date(row.value).toLocaleString() }}
        </template>
        <template v-if="row.value != ''" slot="CancelTime" slot-scope="row">
          {{ new Date(row.value).toLocaleString() }}
        </template>
        <template slot="isRegistered" slot-scope="row">
          <b-badge v-if="row.value == 1" variant="success">
            Reg
          </b-badge>
          <b-badge v-else variant="danger">
            Non-Reg
          </b-badge>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'CheckHistory',
  data() {
    return {
      perPage: 7,
      currentPage: 1,
      items: []
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  methods: {
    showModal() {
      this.$http.get('/checkin/myhistory').then(resp => {
        this.items = resp.data
        this.$refs['history-modal'].show()
      })
    }
  }
}
</script>
