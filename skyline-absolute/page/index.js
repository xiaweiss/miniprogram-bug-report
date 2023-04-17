Component({
  options: {
    pureDataPattern: /^_/,
    virtualHost: true,
  },
  properties: {
    background: { type: String, value: '#fff' },
    noBottom: Boolean,
  },
})
