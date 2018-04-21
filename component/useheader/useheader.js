// component/useheader/useheader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listHidden: {
      type: Boolean,
      value: false,
      observer: '_listHidden'
    },
    useData: {
      type: null,
      observer: '_updateUseData'
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    isListHidden: false,
    useData: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _listHidden: function(){
      const that = this;
      that.setData({
        isListHidden: !that.data.isListHidden
      })
    },
    _updateUseData: function(nv){
      const that = this;
      that.setData({
        useData: nv
      })
    }
  }
})
