<template>
  <div>
    <b-card
      border-variant="primary"
      header="Search Box"
      header-bg-variant="primary"
      header-text-variant="white"
    >
      <b-card-text>
        <b-form-input v-model="keyword" placeholder="Keyword" autofocus />
      </b-card-text>
      <b-list-group flush>
        <b-list-group-item
          v-for="row in result"
          :key="row.StudentID"
          href="#"
          class="flex-column align-items-start"
          @click="onSelectPerson(row)"
        >
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{{ row.Name }} {{ row.Surname }}</h5>
          </div>

          <p class="mb-1">{{ row.ENName }} {{ row.ENSurname }}</p>

          <small class="text-muted">{{ row.StudentID }}</small>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data: function() {
    return {
      keyword: '',
      result: [],
      selected: null
    }
  },
  watch: {
    keyword: _.debounce(function() {
      this.SearchResult()
    }, 500)
  },
  methods: {
    SearchResult() {
      if (this.keyword.length < 3) {
        this.result = []
      } else {
        this.$http
          .get('/student/search', {
            params: {
              keyword: this.keyword
            }
          })
          .then(resp => {
            this.result = resp.data.result
          })
      }
    },
    onSelectPerson(selected) {
      this.selected = selected
      this.$emit('selectperson', this.selected)
    }
  }
}
</script>
