
import { LgetItem, LsetItem } from '@/utils/storage'
import { USER_INFO } from '@/config/const'

const user = {
  state: {
    userInfo: LgetItem(USER_INFO) || {},
  },

  mutations: {
    SET_userInfo: (state, data) => {
      LsetItem(USER_INFO, data)
      state.userInfo = data
    }
  }
}

export default user
