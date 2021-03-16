import { SgetItem } from '@/utils/storage'

const role = {
  state: {
    menus: [],
    menusAll: [],
    collapsed: false,
    levelObj: {},
    breadcrumb: []
  },
  mutations: {
    FIND_MENU: (state, val) => {
      let menus = SgetItem('menus') || state.menus
      let arr = menus.filter(s => {
        let comName = s.path.replace(/\/\w{1}/g, function (val) {
          return val.substring(1, 2).toUpperCase()
        })
        s.name = comName
        s.meta = {
          title: s.title
        }
        return s.title.indexOf(val) !== -1 && s.isLast && s.menus
      })
      if (val) {
        state.menus = arr
      } else {
        state.menus = state.menusAll
      }
    },
    SET_MENU_ALL: (state, menus) => {
      state.menusAll = menus
      state.menus = menus
      console.log('菜单:', menus)
    },
    SET_COLLAPSED: (state, flag) => {
      state.collapsed = flag
    },
    SET_LEVEL_OBJ: (state, data) => {
      state.levelObj = data
    },
    SET_BREADCRUMB: (state, data) => {
      let arr = new Array(data.level).fill('')
      let id = data.id
      if (!id) {
        return
      }
      let level = data.level
      let completeArr = []
      console.log(state.levelObj)
      arr.map(() => {
        completeArr.unshift(state.levelObj[level][id])
        id = state.levelObj[level][id]['parentId']
        level--
      })
      state.breadcrumb = completeArr
      console.log(completeArr)
    }
  },
  getters: {
    collapsed: state => state.collapsed,
    menus: state => state.menus,
    breadcrumb: state => state.breadcrumb
  }
}
export default role