export function dict(dictName) {
  const dict = this.$i18n.t('dicts.' + dictName)
  return typeof (dict) === 'string' ? {} : dict
}
