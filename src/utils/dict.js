export function dict(dictName) {
  const dict = this.$i18n.t('dicts.' + dictName)
  return typeof (dict) === 'string' ? {} : dict
}

export function dft(dictName, codeName) {
  const dict = this.$dict(dictName)
  if (dict) {
    return dict[codeName]
  } else {
    return ''
  }
}
