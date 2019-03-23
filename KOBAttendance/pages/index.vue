<template>
  <section class="container">
    <b-row class="pt-3">
      <b-col xs="3">
        <UserImg :imgurl="info.img" />
      </b-col>
      <b-col xs="5">
        <UserInfo :info="info" />
      </b-col>
      <b-col md="4">
        <SearchBox />
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
        img: 'http://bucroccs.bu.ac.th/image/person.png',
        name: 'พิชวัชร',
        surname: 'ลัคนาธิติ',
        en_name: 'Phitchawat Lukkanathiti',
        year: '1',
        stdid: '6110503371',
        dep: 'วิศวกรรมคอมพิวเตอร์'
      }
    }
  },
  computed: {},
  methods: {}
}
</script>
