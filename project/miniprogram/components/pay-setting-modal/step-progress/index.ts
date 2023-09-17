interface StepItem {
  text: string;
}

Component({
  options: {
    virtualHost: true,
  },
  properties: {
    stepList: Array,
    stepIndex: Number
  }
})
