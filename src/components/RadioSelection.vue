<template>
  <div class="field radio-selection">
    <div v-for="(option, value) in options" :key="value" class="radio">
      <input
        :value="value"
        :name="name"
        @change="checkRadio($event.target.value)"
        :id="value"
        type="radio"
      />
      <label :for="value">{{ option }}</label>
    </div>
    <span v-if="isEmpty" class="subtip">Поле должно быть заполнено</span>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    options: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isEmpty: false,
      isInvalid: false,
      selectedValue: '',
    };
  },
  methods: {
    checkRadio(value) {
      value = this.tryToBool(value);
      this.$emit('change', value);
      this.selectedValue = value;
      this.isEmpty = false;
    },
    validate(value) {
      if (value === '') {
        this.isEmpty = true;
      }
    },
    tryToBool(value) {
      if (value.toLowerCase() === 'true') return true;
      else if (value.toLowerCase() === 'false') return false;
      else return value;
    },
  },
};
</script>

<style scoped>
.radio-selection.field {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  min-width: 240px;
}
.radio-selection.field .radio {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.radio-selection.field .radio input {
  cursor: inherit;
}
.radio-selection.field .radio label {
  margin-bottom: 0;
  line-height: 0.8;
  color: #001a34;
  cursor: inherit;
}
</style>
