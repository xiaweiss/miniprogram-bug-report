Component({
  options: {
    virtualHost: true
  },
  externalClasses: ['class'],
  properties: {
    /** 样式 */
    style: {type: String, value: ''},
    /** 指定按下去的样式类。opacity 透明度降低（默认）、background 背景色变灰、none 没有点击效果 */
    hoverClass: {type: String, value: 'opacity'},
    /** 指定是否阻止本节点的祖先节点出现点击态 */
    hoverStopPropagation: {type: Boolean, value: true},
    /** 按住后多久出现点击态，单位毫秒 */
    hoverStartTime: {type: Number, value: 0},
    /** 手指松开后点击态保留时间，单位毫秒 */
    hoverStayTime: {type: Number, value: 0},
  }
})
