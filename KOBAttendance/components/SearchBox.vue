<template>
  <div>
    <b-card
      border-variant="primary"
      header="Search Box"
      header-bg-variant="primary"
      header-text-variant="white"
    >
      <b-card-text>
        <b-form-input
          id="searchinp"
          v-model="keyword"
          placeholder="Keyword"
          autocomplete="off"
          autofocus
          @keyup.enter="confirmFirst"
          @keyup.up="keyup"
          @keyup.down="keydown"
          @keydown.17="barcodePrevent"
          @keydown.74="barcodePrevent"
        />
      </b-card-text>
      <b-list-group flush>
        <b-list-group-item
          v-for="row in result"
          :key="row.StudentID"
          href="#"
          :class="{
            active: row.StudentID == selected.StudentID,
            'flex-column': true,
            'align-items-start': true
          }"
          @click="onSelectPerson(row)"
        >
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{{ row.Name }} {{ row.Surname }}</h5>
          </div>

          <p class="mb-1">{{ row.ENName }} {{ row.ENSurname }}</p>

          <small>{{ row.StudentID }}</small>
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <b-alert v-if="!firstLetter" variant="info" class="mt-2" show>
      <h4>Instruction</h4>
      <hr />
      <p>
        ระบบรองรับ
      </p>
      <ul>
        <li>ชื่อ หรือ สกุล</li>
        <li>Name or Surname</li>
        <li>รหัสนิสิต</li>
        <li>/ ตามด้วยตัวท้ายรหัสนิสิต</li>
      </ul>
      <p>
        You can type NAME or SURNAME as you hear.
      </p>
      <p>
        เมื่อเลือกข้อมูลที่ต้องการแล้ว ระบบจะบันทึกเวลาเข้าโดยอัตโนมัติ
        หากเลือกผิด ให้ยกมือขึ้นแล้วหมุน ๆ ชูมือขึ้นโบกไปมา ให้ผู้ดูแลระบบ
        ยกเลิกข้อมูลให้
      </p>
    </b-alert>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  data: function() {
    return {
      firstLetter: false,
      keyword: '',
      result: [],
      selected: null,
      selected_index: -1,
      enter_loop: 0
    }
  },
  watch: {
    keyword: _.debounce(function() {
      this.firstLetter = true
      this.SearchResult()
    }, 100)
  },
  methods: {
    barcodePrevent(event) {
      event.preventDefault()
    },
    confirmFirst() {
      if (this.selected !== null) {
        this.onSelectPerson(this.selected)
        this.keyword = ''
        this.enter_loop = 0
      } else if (this.enter_loop < 5) {
        setTimeout(() => {
          this.confirmFirst(++this.enter_loop)
        }, 500)
      } else {
        this.enter_loop = 0
      }
    },
    setCaretPosition(ctrl, pos) {
      ctrl.focus()
      ctrl.setSelectionRange(pos, pos)
    },
    highlight() {
      this.selected = this.result[this.selected_index]
    },
    keyup() {
      if (this.result.length > 0) {
        this.selected_index += this.result.length - 1
        this.selected_index %= this.result.length
        this.highlight()
      }
      const myInput = document.getElementById('searchinp')
      this.setCaretPosition(myInput, this.keyword.length)
    },
    keydown() {
      if (this.result.length > 0) {
        this.selected_index += 1
        this.selected_index %= this.result.length
        this.highlight()
      }
    },
    SearchResult() {
      if (this.keyword.length < 2) {
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
            if (this.result.length > 0) {
              this.selected = this.result[0]
              this.selected_index = 0
            } else {
              this.selected = null
              this.selected_index = -1
            }
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
