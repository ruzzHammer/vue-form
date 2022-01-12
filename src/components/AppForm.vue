<template>
  <form @submit.prevent="handleForm" autocomplete="off" class="form">
    <p class="form-subtitle">Личные данные</p>
    <div class="form-row">
      <form-input
        id="lastName"
        label="Фамилия"
        v-model="formData.lastName"
        :validation="{ tip: 'Только кириллица', regexp: regexps.cyrillic }"
        ref="lastName"
      />
      <form-input
        id="firstName"
        label="Имя"
        v-model="formData.firstName"
        :validation="{ tip: 'Только кириллица', regexp: regexps.cyrillic }"
        ref="firstName"
      />
      <form-input
        id="thirdName"
        label="Отчество"
        v-model="formData.thirdName"
        :validation="{
          tip: 'Только кириллица',
          regexp: regexps.cyrillic,
          required: false,
        }"
      />
    </div>
    <div class="form-row">
      <date-picker
        id="birthday"
        label="Дата рождения"
        v-model="formData.birthday"
        ref="birthday"
      />
    </div>
    <div class="form-row">
      <form-input
        id="email"
        label="E-mail"
        v-model="formData.email"
        :validation="{ tip: 'Некорректный email', regexp: regexps.email }"
        ref="email"
      />
    </div>
    <p class="form-subtitle">Пол</p>
    <div class="form-row">
      <radio-selection
        :options="{ male: 'Мужской', female: 'Женский' }"
        name="gender"
        v-model="formData.gender"
        ref="gender"
      />
    </div>
    <p class="form-subtitle">Паспортные данные</p>
    <div class="form-row">
      <form-dropdown
        id="citizenship"
        label="Гражданство"
        :options="countries"
        :filter="true"
        v-model="formData.citizenship"
        ref="citizenship"
      />
    </div>
    <div v-if="formData.citizenship === 'Russian Federation'" class="form-row">
      <form-input
        id="russianPassportSeries"
        type="number"
        label="Серия паспорта"
        v-model="formData.russianPassportSeries"
        maxDigits="4"
        :validation="{ tip: 'Серия состоит из 4 цифр', regexp: regexps.four }"
        ref="russianPassportSeries"
      />
      <form-input
        id="russianPassportNumber"
        type="number"
        label="Номер паспорта"
        v-model="formData.russianPassportNumber"
        maxDigits="6"
        :validation="{ tip: 'Серия состоит из 6 цифр', regexp: regexps.six }"
        ref="russianPassportNumber"
      />
      <date-picker
        id="issueDate"
        label="Дата выдачи"
        :minDate.sync="formData.birthday"
        v-model="formData.issueDate"
        ref="issueDate"
      />
    </div>
    <template v-else>
      <div class="form-row">
        <form-input
          id="lastNameLatin"
          label="Фамилия на латинице"
          v-model="formData.lastNameLatin"
          :validation="{ tip: 'Только латинские буквы', regexp: regexps.latin }"
          ref="lastNameLatin"
        />
        <form-input
          id="firstNameLatin"
          label="Имя на латинице"
          v-model="formData.firstNameLatin"
          :validation="{ tip: 'Только латинские буквы', regexp: regexps.latin }"
          ref="firstNameLatin"
        />
        <p class="subtip">
          Иностранцы заполняют латинскими буквами. Например, Ivanov Ivan.
        </p>
      </div>
      <div class="form-row">
        <form-input
          id="foreignPassportNumber"
          label="Номер паспорта"
          v-model.number="formData.foreignPassportNumber"
          ref="foreignPassportNumber"
        />
        <form-dropdown
          id="issueCountry"
          label="Страна выдачи"
          :filter="true"
          :options="countries"
          v-model="formData.issueCountry"
          ref="issueCountry"
        />
        <form-dropdown
          id="foreignPassportType"
          label="Тип паспорта"
          :options="passportTypes"
          v-model="formData.foreignPassportType"
          ref="foreignPassportType"
        />
      </div>
    </template>
    <p class="form-subtitle">Меняли ли фамилию или имя?</p>
    <div class="form-row">
      <RadioSelection
        :options="{ false: 'Нет', true: 'Да' }"
        name="haveNamesBeenChanged"
        v-model="formData.haveNamesBeenChanged"
        ref="haveNamesBeenChanged"
      />
    </div>
    <div v-if="formData.haveNamesBeenChanged" class="form-row">
      <form-input
        id="oldFirstName"
        label="Прежнее имя"
        v-model="formData.oldFirstName"
        :validation="{ tip: 'Только кириллица', regexp: regexps.cyrillic }"
        ref="oldFirstName"
      />
      <form-input
        id="oldLastName"
        label="Прежняя фамилия"
        v-model="formData.oldLastName"
        :validation="{ tip: 'Только кириллица', regexp: regexps.cyrillic }"
        ref="oldLastName"
      />
    </div>
    <button class="button">Отправить</button>
  </form>
</template>

<script>
import _ from 'lodash';
import FormInput from './FormInput.vue';
import DatePicker from './DatePicker.vue';
import FormDropdown from './FormDropdown.vue';
import RadioSelection from './RadioSelection.vue';
import citizenships from '@/assets/data/citizenships.json';
import { name } from 'country-emoji';
import passports from '@/assets/data/passport-types.json';
import {
  FORM_DATA,
  CYRILLIC_REGEXP,
  LATIN_REGEXP,
  EMAIL_REGEXP,
  FOUR_DIGITS_REGEXP,
  SIX_DIGITS_REGEXP,
} from '../consts';

export default {
  components: {
    FormInput,
    DatePicker,
    FormDropdown,
    RadioSelection,
  },
  data() {
    return {
      formData: FORM_DATA,
      regexps: {
        cyrillic: CYRILLIC_REGEXP,
        latin: LATIN_REGEXP,
        email: EMAIL_REGEXP,
        four: FOUR_DIGITS_REGEXP,
        six: SIX_DIGITS_REGEXP,
      },
    };
  },
  methods: {
    handleForm() {
      this.getFormDataRefs().forEach((ref) => {
        if (ref.value !== undefined) {
          ref.validate(ref.value);
        } else {
          ref.validate(ref.selectedValue); // for radioselection
        }
      });
      this.checkFilledForm();
      if (this.checkIfEverythingFilled() === true) this.displayFilledForm();
    },
    checkIfEverythingFilled() {
      return this.getFormDataRefs().every((ref) => {
        return !ref.isEmpty && !ref.isInvalid;
      });
    },
    checkFilledForm() {
      if (this.formData.citizenship === 'Russian Federation') {
        this.formData = {
          ...this.formData,
          firstNameLatin: '',
          lastNameLatin: '',
          issueCountry: '',
          foreignPassportNumber: '',
        };
      } else {
        this.formData = {
          ...this.formData,
          russianPassportSeries: '',
          russianPassportNumber: '',
          issueDate: '',
        };
      }

      if (this.formData.haveNamesBeenChanged === 'Нет') {
        this.formData = {
          ...this.formData,
          oldFirstName: '',
          oldLastName: '',
        };
      }
    },
    displayFilledForm() {
      console.log(JSON.stringify(_.omitBy(this.formData, _.isEmpty), null, 2));
    },
    getFormDataRefs() {
      let refs = [];
      Object.keys(this.formData).forEach((key) => refs.push(this.$refs[key]));
      return refs.filter((ref) => ref !== undefined);
    },
  },
  computed: {
    countries() {
      return _.uniq(
        citizenships.map((citizenship) => {
          let countryName = name(citizenship.flag);
          return countryName ? countryName : citizenship.nationality;
        })
      );
    },
    passportTypes() {
      return passports.map((pass) => pass.type);
    },
  },
};
</script>

<style>
.form-subtitle {
  font-weight: 700;
  margin: 10px 0 15px;
}
.form-row {
  display: flex;
  gap: 10px 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.form-row p.subtip {
  width: 100%;
  color: #b3bcc5;
  font-size: 14px;
  margin-top: 5px;
}
.form .field {
  display: flex;
  flex-direction: column;
  position: relative;
}
.form-row .field span.subtip {
  position: absolute;
  top: calc(100% + 3px);
  left: 0;
  font-size: 12px;
  color: #ad0000;
}
.form label {
  color: #7a838b;
  margin-bottom: 6px;
}
.form input {
  border: 2px solid #b3bcc5;
  border-radius: 6px;
  color: #001a34;
  padding: 8px 10px 8px;
  transition: 0.3s ease;
}
.form input:focus {
  border-color: #005bff;
  outline: none;
}
.form input::placeholder {
  color: #96a3ae;
}
.form input.invalid {
  border-color: #ad0000;
}
.form .button {
  background: #005bff;
  color: #fff;
  text-align: center;
  padding: 10px 20px;
  border-radius: 6px;
}
.form .button:disabled {
  opacity: 0.5;
}
</style>
