export const FORM_DATA = {
  firstName: '',
  lastName: '',
  thirdName: '',
  birthday: '',
  email: '',
  gender: '',
  citizenship: '',
  russianPassportSeries: '',
  russianPassportNumber: '',
  firstNameLatin: '',
  lastNameLatin: '',
  issueDate: '',
  foreignPassportNumber: '',
  issueCountry: '',
  foreignPassportType: '',
  haveNamesBeenChanged: false,
  oldFirstName: '',
  oldLastName: '',
};
export const CYRILLIC_REGEXP = /^[ЁёА-я]+$/m;
export const LATIN_REGEXP = /^[A-z]+$/m;
export const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const FOUR_DIGITS_REGEXP = /^\d{4}$/;
export const SIX_DIGITS_REGEXP = /^\d{6}$/;
