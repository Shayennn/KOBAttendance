<template>
  <div>
    <h2>
      {{ info.name }} {{ info.surname }}
      <span v-show="info.isChecked">
        <b-badge variant="success" size="lg">Checked</b-badge>
      </span>
    </h2>
    <p>{{ info.en_name }}</p>
    <p>
      <span :class="['font-weight-bold']">รหัสนิสิต: </span>{{ info.stdid }}
    </p>
    <p><span :class="['font-weight-bold']">ภาควิชา: </span>{{ info.dep }}</p>
    <p><span :class="['font-weight-bold']">ชั้นปี: </span>{{ info.year }}</p>
    <p v-if="!info.isReg">
      <b-alert show variant="danger"
        >บุคคลนี้ไม่ได้ลงทะเบียนร่วมกิจกรรม</b-alert
      >
    </p>
  </div>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-prop-types
    info: {
      // type: Object,
      default: {
        img: '',
        name: 'กรุณาระบุคำค้น',
        surname: '',
        en_name: '',
        year: '',
        stdid: '',
        dep: '',
        isReg: true,
        isChecked: false
      }
    }
  }
}
</script>
