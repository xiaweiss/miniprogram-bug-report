let index = -1

Component({
  lifetimes: {
    created() {
      index += 1
      this.data._index = index
      console.log('created', this.data._index)
    },
    attached () {
      console.log('attached', this.data._index)
    },
    ready() {
      console.log('ready', this.data._index)
    },
    moved() {
      console.log('moved', this.data._index)
    },
    detached () {
      console.log('detached', this.data._index)
    }
  },

  options: {
    pureDataPattern: /^_/
  },

  properties: {
    note: Object
  },

  data: {
    _index: null,
    content: ''
  },

  observers: {
    note (value) {
      console.log('setContent', this.data._index, value.uuid)
      this.setContent(value.content)
    }
  },

  methods: {
    setContent (content) {
      this.setData({content})
    }
  }
})
