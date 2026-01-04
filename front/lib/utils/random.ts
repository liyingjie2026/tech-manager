import { randomBytes } from "crypto"

/**
 * 随机数生成工具类
 * 提供各种随机数生成方法
 */
export class Random {
  /**
   * 生成指定范围内的随机整数（包含最小值和最大值）
   * @param min 最小值
   * @param max 最大值
   * @returns 随机整数
   */
  static integer(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * 生成指定范围内的随机浮点数
   * @param min 最小值
   * @param max 最大值
   * @param decimals 小数位数，默认2位
   * @returns 随机浮点数
   */
  static float(min: number, max: number, decimals = 2): number {
    const value = Math.random() * (max - min) + min
    return Number(value.toFixed(decimals))
  }

  /**
   * 生成随机布尔值
   * @param probability 为true的概率（0-1），默认0.5
   * @returns 随机布尔值
   */
  static boolean(probability = 0.5): boolean {
    return Math.random() < probability
  }

  /**
   * 从数组中随机选择一个元素
   * @param array 源数组
   * @returns 随机选中的元素
   */
  static pick<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  /**
   * 从数组中随机选择多个不重复的元素
   * @param array 源数组
   * @param count 选择数量
   * @returns 随机选中的元素数组
   */
  static picks<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, array.length))
  }

  /**
   * 打乱数组顺序
   * @param array 源数组
   * @returns 打乱后的新数组
   */
  static shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  /**
   * 生成随机字符串
   * @param length 字符串长度
   * @param characters 字符集，默认为字母数字
   * @returns 随机字符串
   */
  static string(length: number, characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"): string {
    let result = ""
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  /**
   * 生成随机UUID（简化版本）
   * @returns UUID字符串
   */
  static uuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /**
   * 生成随机颜色（十六进制格式）
   * @returns 颜色字符串，如 "#3A5F7B"
   */
  static color(): string {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`
  }

  /**
   * 生成指定范围内的随机日期
   * @param start 开始日期
   * @param end 结束日期
   * @returns 随机日期
   */
  static date(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  }

  /**
   * 根据权重随机选择
   * @param items 选项数组
   * @param weights 权重数组
   * @returns 随机选中的元素
   */
  static weighted<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < items.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        return items[i]
      }
    }

    return items[items.length - 1]
  }

  /**
   * 生成加密安全的随机字符串（适用于后端token、密钥等）
   * @param length 字符串长度
   * @returns 加密安全的随机字符串
   */
  static secureString(length: number): string {
    return randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .slice(0, length)
  }

  /**
   * 生成加密安全的随机数字
   * @param min 最小值
   * @param max 最大值
   * @returns 加密安全的随机整数
   */
  static secureInteger(min: number, max: number): number {
    const range = max - min + 1
    const bytesNeeded = Math.ceil(Math.log2(range) / 8)
    const maxValue = Math.pow(256, bytesNeeded)
    const randomValue = randomBytes(bytesNeeded).readUIntBE(0, bytesNeeded)
    return min + (randomValue % range)
  }

  /**
   * 生成数字验证码
   * @param length 验证码长度，默认6位
   * @returns 数字验证码
   */
  static verificationCode(length = 6): string {
    let code = ""
    for (let i = 0; i < length; i++) {
      code += Math.floor(Math.random() * 10)
    }
    return code
  }

  /**
   * 生成唯一的数字ID（基于时间戳和随机数）
   * @returns 唯一数字ID
   */
  static numericId(): string {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    return timestamp + random
  }

  /**
   * 生成短ID（适合URL使用）
   * @param length ID长度，默认8位
   * @returns 短ID字符串
   */
  static shortId(length = 8): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    return this.string(length, chars)
  }

  /**
   * 生成订单号（格式：年月日+6位随机数）
   * @param prefix 前缀，默认为空
   * @returns 订单号
   */
  static orderNumber(prefix = ""): string {
    const now = new Date()
    const datePart =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0")
    const randomPart = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
    return prefix + datePart + randomPart
  }

  /**
   * 生成随机手机号（测试用）
   * @returns 随机手机号
   */
  static phoneNumber(): string {
    const prefixes = [
      "130",
      "131",
      "132",
      "133",
      "134",
      "135",
      "136",
      "137",
      "138",
      "139",
      "150",
      "151",
      "152",
      "153",
      "155",
      "156",
      "157",
      "158",
      "159",
      "180",
      "181",
      "182",
      "183",
      "184",
      "185",
      "186",
      "187",
      "188",
      "189",
    ]
    const prefix = this.pick(prefixes)
    const suffix = Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, "0")
    return prefix + suffix
  }

  /**
   * 生成随机邮箱（测试用）
   * @param domain 域名，默认为example.com
   * @returns 随机邮箱
   */
  static email(domain = "example.com"): string {
    const username = this.string(8, "abcdefghijklmnopqrstuvwxyz0123456789")
    return `${username}@${domain}`
  }

  /**
   * 生成随机IP地址
   * @returns 随机IP地址
   */
  static ipAddress(): string {
    return `${this.integer(1, 255)}.${this.integer(0, 255)}.${this.integer(0, 255)}.${this.integer(1, 255)}`
  }

  /**
   * 生成随机MAC地址
   * @returns 随机MAC地址
   */
  static macAddress(): string {
    const parts = []
    for (let i = 0; i < 6; i++) {
      parts.push(this.integer(0, 255).toString(16).padStart(2, "0"))
    }
    return parts.join(":").toUpperCase()
  }

  /**
   * 生成项目编码（格式：HN+年份-类型-序号）
   * @param year 年份，默认为当前年份
   * @param type 项目类型缩写，默认随机
   * @returns 项目编码，如 HN2025-ZD-001
   */
  static projectCode(year?: number, type?: string): string {
    const currentYear = year || new Date().getFullYear()
    const projectTypes = ["ZD", "YB", "QN", "HZ", "ZX"] // 重大、一般、青年、合作、专项
    const projectType = type || this.pick(projectTypes)
    const sequence = this.integer(1, 999).toString().padStart(3, "0")
    return `HN${currentYear}-${projectType}-${sequence}`
  }
}

// 导出便捷函数
export const randomInt = Random.integer
export const randomFloat = Random.float
export const randomBool = Random.boolean
export const randomPick = Random.pick
export const randomShuffle = Random.shuffle
export const randomString = Random.string
export const randomUuid = Random.uuid
export const randomColor = Random.color
export const randomDate = Random.date
export const randomSecureString = Random.secureString
export const randomSecureInt = Random.secureInteger
export const randomVerificationCode = Random.verificationCode
export const randomNumericId = Random.numericId
export const randomShortId = Random.shortId
export const randomOrderNumber = Random.orderNumber
export const randomPhoneNumber = Random.phoneNumber
export const randomEmail = Random.email
export const randomIpAddress = Random.ipAddress
export const randomMacAddress = Random.macAddress
export const generateProjectCode = Random.projectCode
