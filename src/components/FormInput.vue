<template>
  <div class="field">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      @input="handleInput"
      :value="value"
      @blur="validate($event.target.value)"
      :class="{
        invalid: isInvalid || isEmpty,
      }"
    />
    <span v-if="isInvalid" class="subtip">{{ validation.tip }}</span>
    <span v-else-if="isEmpty" class="subtip">Поле должно быть заполнено</span>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text',
    },
    id: {
      type: String,
      required: true,
    },
    value: {
      required: true,
    },
    label: String,
    validation: {
      type: Object,
      default: () => {
        return {
          tip: '',
          regexp: new RegExp(),
          required: true,
        };
      },
    },
    maxDigits: String,
  },
  data() {
    return {
      isInvalid: false,
      isEmpty: false,
    };
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value);
      this.isInvalid = false;
      this.isEmpty = false;
      if (event.target.value.length > this.maxDigits) {
        this.validate(event.target.value, this.validation.regexp);
      }
    },
    validate(value) {
      if (value === '') {
        if (
          this.validation.required === true ||
          this.validation.required === undefined
        ) {
          this.isEmpty = true;
        }
      } else {
        if (!this.validation.regexp.test(value)) {
          this.isInvalid = true;
        }
      }
    },
  },
};
</script>
