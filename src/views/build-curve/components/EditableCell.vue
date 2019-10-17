<template>
  <div>
    <div v-if="!editMode && !showInput" tabindex="0" @click="onFieldClick" @keyup.enter="onFieldClick">
      <slot name="content" />
    </div>
    <component
      :is="editableComponent"
      v-if="editMode || showInput"
      ref="input"
      v-model="model"
      v-bind="$attrs"
      @focus="onFieldClick"
      @keyup.enter.native="onInputExit"
      @change="onInputChange"
      v-on="listeners"
    >
      <slot name="edit-component-slot" />
    </component>
  </div>
</template>

<script>
export default {
  name: 'EditableCell',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    rowData: {
      type: Object,
      default: () => {}
    },
    showInput: {
      type: Boolean,
      default: false
    },
    editableComponent: {
      type: String,
      default: 'el-input'
    },
    closeEvent: {
      type: String,
      default: 'blur'
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editMode: false
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    listeners() {
      return {
        [this.closeEvent]: this.onInputExit,
        ...this.$listeners
      }
    }
  },
  methods: {
    onFieldClick() {
      if (this.canEdit) {
        this.editMode = true
        this.$nextTick(() => {
          const inputRef = this.$refs.input
          if (inputRef && inputRef.focus) {
            inputRef.focus()
          }
        })
      }
    },
    onInputExit() {
      this.editMode = false
      this.$emit('change-data', this.name, this.rowData)
    },
    onInputChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>

</style>
