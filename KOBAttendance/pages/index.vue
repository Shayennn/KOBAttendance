<template>
  <section class="container">
    <b-row class="pt-3">
      <b-col xs="3">
        <UserImg :imgurl="info.img" />
      </b-col>
      <b-col xs="5">
        <UserInfo :info="info" />
        <b-button
          v-if="showConfirm"
          :disabled="disableConfirm"
          size="lg"
          block
          variant="success"
          @click="confirmCheck"
          >Check-in</b-button
        >
        <b-button
          v-if="StaffInfo.level >= 2 && showCancel"
          size="lg"
          block
          variant="danger"
          @click="cancelCheck"
          >Undo Check-in</b-button
        >
      </b-col>
      <b-col md="4">
        <SearchBox @selectperson="SearchConfirm" />
      </b-col>
    </b-row>
    <Footer />
  </section>
</template>

<script>
import Footer from '~/components/Footer.vue'
import UserInfo from '~/components/UserInfo.vue'
import UserImg from '~/components/UserImg.vue'
import SearchBox from '~/components/SearchBox.vue'

export default {
  // auth: false, // Temp disable auth
  components: {
    Footer,
    UserInfo,
    UserImg,
    SearchBox
  },
  data() {
    return {
      info: {
        img: '/unknow.png',
        name: 'กรุณาระบุคำค้น',
        surname: '',
        en_name: ' ',
        year: '',
        stdid: '',
        dep: '',
        isReg: true,
        isChecked: false
      },
      raw_dat: null,
      StaffInfo: {
        level: 0
      },
      showCancel: false,
      showConfirm: false,
      disableConfirm: false
    }
  },
  async created() {
    await this.$http.get('/auth/check').then(resp => {
      this.StaffInfo = resp.data
    })
  },
  methods: {
    confirmCheck() {
      this.disableConfirm = true
      this.$http
        .get('/checkin/check', {
          params: {
            id: this.info.stdid
          }
        })
        .then(() => {
          this.SearchConfirm(this.raw_dat)
        })
    },
    cancelCheck() {
      this.$http
        .get('/checkin/undo', {
          params: {
            id: this.info.stdid
          }
        })
        .then(() => {
          this.info.isChecked = false
          this.disableConfirm = false
          this.showConfirm = true
        })
    },
    async SearchConfirm(SearchData) {
      this.raw_dat = SearchData
      this.showCancel = true
      const thisyear = 61
      this.info.img =
        '/api/student/image?id=' +
        SearchData.StudentID +
        '&rand=' +
        Math.random()
      this.info.stdid = SearchData.StudentID
      this.info.name = SearchData.Name
      this.info.surname = SearchData.Surname
      this.info.en_name = SearchData.ENName + ' ' + SearchData.ENSurname
      this.info.year =
        thisyear - Math.floor(SearchData.StudentID / 100000000) + 1
      this.info.isReg = SearchData.isRegis === undefined || SearchData.isRegis

      if (this.info.isReg) {
        await this.$http.get('/checkin/check', {
          params: {
            id: this.info.stdid
          }
        })
      }

      this.$http
        .get('/student/info', {
          params: {
            id: SearchData.StudentID
          }
        })
        .then(resp => {
          this.info.name = resp.data.thainame.split(' ')[1]
          this.info.surname = resp.data.thainame.split(this.info.name + ' ')[1]
          this.info.en_name = resp.data.engname
          this.info.dep = resp.data['major-id']
          this.info.isReg = resp.data.registered
          this.info.isChecked = resp.data.checked
          if (!(this.info.isReg || this.info.isChecked)) {
            this.disableConfirm = false
            this.showConfirm = true
          }
        })
    }
  }
}
</script>
