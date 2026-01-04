import { backendGet, backendPost, backendPut, backendDelete } from "./client"

export interface DictionaryItem {
  id: number
  value: string
  label: string
  sort: number
  description?: string
}

export interface Dictionary {
  id: number
  parentId: number
  dictType: string
  dictName: string
  itemCode?: string
  itemLabel: string
  itemValue?: string
  level: number
  description?: string
  sort: number
  enabled: boolean
  children?: Dictionary[]
  createdAt?: string
  updatedAt?: string
}

export interface DictionaryCreateDTO {
  parentId?: number
  dictType: string
  dictName?: string
  itemCode?: string
  itemLabel: string
  itemValue?: string
  level?: number
  description?: string
  sort?: number
  enabled?: boolean
}

export interface DictionaryUpdateDTO {
  itemLabel?: string
  itemValue?: string
  description?: string
  sort?: number
  enabled?: boolean
}

export const dictionaryApi = {
  // 获取字典列表（分页）
  getList: async (params: { page?: number; size?: number; keyword?: string }) => {
    return backendGet("/dictionaries", params)
  },

  // 根据类型获取字典项（扁平列表）
  getByType: async (type: string) => {
    return backendGet(`/dictionaries/type/${type}`)
  },

  // 根据类型获取字典树形结构
  getTreeByType: async (dictType: string) => {
    return backendGet(`/dictionaries/tree/${dictType}`)
  },

  // 根据父ID获取子节点
  getChildren: async (parentId: number) => {
    return backendGet(`/dictionaries/children/${parentId}`)
  },

  // 获取字典详情
  getById: async (id: number) => {
    return backendGet(`/dictionaries/${id}`)
  },

  // 创建字典（支持指定父节点）
  create: async (data: DictionaryCreateDTO) => {
    return backendPost("/dictionaries", data)
  },

  // 更新字典
  update: async (id: number, data: DictionaryUpdateDTO) => {
    return backendPut(`/dictionaries/${id}`, data)
  },

  // 删除字典（级联删除子节点）
  delete: async (id: number) => {
    return backendDelete(`/dictionaries/${id}`)
  },
}
