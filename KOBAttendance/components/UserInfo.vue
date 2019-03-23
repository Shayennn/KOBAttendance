<template>
  <div>
    <h2>{{ info.name }} {{ info.surname }}</h2>
    <p>{{ info.en_name }}</p>
    <p>
      <span :class="['font-weight-bold']">รหัสนิสิต: </span>{{ info.stdid }}
    </p>
    <p><span :class="['font-weight-bold']">ภาควิชา: </span>{{ info.dep }}</p>
    <p><span :class="['font-weight-bold']">ชั้นปี: </span>{{ info.year }}</p>
  </div>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-prop-types
    info: {
      // type: Object,
      default: {
        img:
          'https://www.cpe.ku.ac.th/wp-content/uploads/2014/10/14-KUENG-PHO-01-44-44-40.jpg',
        name: 'พิชวัชร',
        surname: 'ลัคนาธิติ',
        en_name: 'Phitchawat Lukkanathiti',
        year: '1',
        stdid: '6110503371',
        dep: 'วิศวกรรมคอมพิวเตอร์'
      }
    }
  }
}
</script>
