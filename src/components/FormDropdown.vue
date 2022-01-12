<template>
  <div v-click-outside="hideDropdown" class="field select">
    <label v-if="label" :for="id">{{ label }}</label>
    <div class="input-group">
      <input
        readonly
        :id="id"
        :value="value"
        @click.stop="handleDropdown"
        :class="{
          invalid: isEmpty,
        }"
      />
      <span
        :class="[
          {
            open: isDropdownOpen === true,
          },
          'arrow',
        ]"
      ></span>
    </div>
    <div v-if="isDropdownOpen" class="select__dropdown">
      <input
        v-if="filter"
        v-model="searchQuery"
        @input="debounceFilter"
        placeholder="Введите название"
        class="select__dropdown__filter"
        ref="filter"
      />
      <ul v-if="allOptions.length">
        <li
          v-for="option in allOptions"
          :key="option"
          @click="selectOption(option)"
        >
          {{ option }}
        </li>
      </ul>
      <div v-else class="empty">Ничего не найдено</div>
    </div>
    <span v-if="isEmpty" class="subtip">Поле должно быть заполнено</span>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';
import _ from 'lodash';

export default {
  directives: {
    ClickOutside,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      required: true,
    },
    label: String,
    options: {
      type: Array || null,
      required: true,
    },
    filter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isDropdownOpen: false,
      allOptions: this.options,
      searchQuery: '',
      isEmpty: false,
      isInvalid: false,
    };
  },
  methods: {
    handleDropdown() {
      this.isDropdownOpen = this.isDropdownOpen ? false : true;
      this.isEmpty = false;
      this.focusSearchFilter();
    },
    async focusSearchFilter() {
      while (!this.$refs.filter) {
        await new Promise((r) => setTimeout(r, 500));
      }
      this.$refs.filter.focus();
    },
    hideDropdown() {
      this.isDropdownOpen = false;
    },
    selectOption(name) {
      this.$emit('input', name);
      this.hideDropdown();
    },
    filterDropdown() {
      this.allOptions = this.options.filter((option) =>
        option.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    validate(value) {
      if (value === '') {
        this.isEmpty = true;
      }
    },
  },
  computed: {
    debounceFilter() {
      return _.debounce(this.filterDropdown, 500);
    },
  },
};
</script>

<style scoped>
.select {
  position: relative;
}
.select .input-group {
  position: relative;
}
.select .input-group input {
  cursor: pointer;
}
.select .input-group .arrow {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 7px 0 7px;
  border-color: #7a838b transparent transparent transparent;
  transition: 0.3s ease;
  pointer-events: none;
}
.select .input-group .arrow.open {
  transform: translateY(-50%) scaleY(-1);
}
.select .select__dropdown {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 100;
  border-radius: 6px;
  box-shadow: 4px 4px 8px 0px rgba(46, 55, 63, 0.507);
}
.select .select__dropdown ul {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 300px;
}
.select .select__dropdown ul li {
  padding: 10px;
  transition: 0.3s ease;
  cursor: pointer;
}
.select .select__dropdown ul li:hover {
  background: #f7f7f7;
}
.select .select__dropdown ul li.selected {
  background: #005bff;
  color: #000;
}
.select .select__dropdown .empty {
  padding: 10px;
}
.select .select__dropdown .select__dropdown__filter {
  border: none;
  border-bottom: 1px solid #b8c3cc;
  border-radius: 0;
}
.select .select__dropdown .select__dropdown__filter::placeholder {
  font-size: 14px;
}
</style>
