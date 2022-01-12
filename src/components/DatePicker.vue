<template>
  <div class="field">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      :placeholder="placeholder"
      :value="formatDate(value)"
      readonly
      @click.stop="handlePicker"
      :class="{
        invalid: isEmpty,
      }"
    />
    <v-date-picker
      locale="ru"
      :max="maxDate"
      :min="minDate"
      no-title
      :color="color"
      :active-picker="activePicker"
      v-show="isPickerShown"
      v-click-outside="hidePicker"
      :value="value"
      @change="changeValue"
    ></v-date-picker>
    <span v-if="isEmpty" class="subtip">Поле должно быть заполнено</span>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';
import makeTodayDate from '../utils';

export default {
  directives: { ClickOutside },
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      required: true,
    },
    label: String,
    placeholder: {
      type: String,
      default: 'Выберите дату',
    },
    maxDate: {
      default: makeTodayDate,
    },
    minDate: {
      default: '1900-01-01',
    },
    color: {
      type: String,
      default: '#005bff',
    },
  },
  data() {
    return {
      activePicker: null,
      isPickerShown: false,
      isEmpty: false,
      isInvalid: false,
    };
  },
  mounted() {
    this.activePicker = 'YEAR';
  },
  methods: {
    handlePicker() {
      this.isPickerShown = this.isPickerShown === false ? true : false;
      this.isEmpty = false;
    },
    hidePicker() {
      this.isPickerShown = false;
    },
    formatDate(date) {
      if (date) {
        return date.split('-').reverse().join('.');
      }
    },
    changeValue(event) {
      this.$emit('input', event);
      this.hidePicker();
    },
    validate(value) {
      if (value === '') {
        this.isEmpty = true;
      }
    },
  },
};
</script>

<style scoped>
.field input {
  width: 290px;
}
.v-picker {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
}
</style>
