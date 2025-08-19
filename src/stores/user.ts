import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { config } from '../config/index'

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  role: string
  permissions: string[]
  name?: string
  department?: string
  position?: string
}

export interface LoginParams {
  token: string
  userInfo: UserInfo
  expiresIn: number
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem(`${config.storagePrefix}token`))
  const userInfo = ref<UserInfo | null>(() => {
    const storedUserInfo = localStorage.getItem(`${config.storagePrefix}userInfo`)
    // 如果没有存储的用户信息，使用默认值
    if (!storedUserInfo) {
      return {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        avatar: '李',
        role: 'admin',
        permissions: ['all'],
        name: '李加高',
        department: '重庆赛普天街店',
        position: '设计师/组长',
      }
    }
    return JSON.parse(storedUserInfo)
  })
  const expiresAt = ref<number | null>(() => {
    const storedExpiresAt = localStorage.getItem(`${config.storagePrefix}expiresAt`)
    return storedExpiresAt ? parseInt(storedExpiresAt, 10) : null
  })

  // 计算用户是否已登录
  const isLoggedIn = computed(() => {
    // 检查token是否存在且未过期
    if (!token.value || !expiresAt.value) {
      return false
    }
    return Date.now() < expiresAt.value
  })

  // 计算用户角色
  const userRole = computed(() => {
    return userInfo.value?.role || ''
  })

  // 计算用户权限列表
  const userPermissions = computed(() => {
    return userInfo.value?.permissions || []
  })

  // 登录方法
  function login(params: LoginParams) {
    const { token: newToken, userInfo: newUserInfo, expiresIn } = params

    // 设置token和用户信息
    token.value = newToken
    userInfo.value = newUserInfo
    expiresAt.value = Date.now() + expiresIn * 1000

    // 保存到localStorage
    localStorage.setItem(`${config.storagePrefix}token`, newToken)
    localStorage.setItem(`${config.storagePrefix}userInfo`, JSON.stringify(newUserInfo))
    localStorage.setItem(`${config.storagePrefix}expiresAt`, expiresAt.value.toString())
  }

  // 登出方法
  function logout() {
    // 清空状态
    token.value = null
    userInfo.value = null
    expiresAt.value = null

    // 清除localStorage
    localStorage.removeItem(`${config.storagePrefix}token`)
    localStorage.removeItem(`${config.storagePrefix}userInfo`)
    localStorage.removeItem(`${config.storagePrefix}expiresAt`)
  }

  // 检查权限
  function hasPermission(permission: string) {
    // 管理员拥有所有权限
    if (userRole.value === 'admin') {
      return true
    }
    // 检查用户是否有指定权限
    return userPermissions.value.includes(permission)
  }

  // 初始化用户信息
  function initUserInfo() {
    const storedUserInfo = localStorage.getItem(`${config.storagePrefix}userInfo`)
    if (storedUserInfo) {
      userInfo.value = JSON.parse(storedUserInfo)
    }
  }

  return {
    token,
    userInfo,
    expiresAt,
    isLoggedIn,
    userRole,
    userPermissions,
    login,
    logout,
    hasPermission,
    initUserInfo,
  }
})
