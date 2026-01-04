// UI统一样式常量
export const UI_CONSTANTS = {
  // 表单控件高度
  INPUT_HEIGHT: "h-10",
  SELECT_HEIGHT: "h-10",
  BUTTON_HEIGHT: "h-10",

  // 表单控件宽度
  INPUT_WIDTH_SM: "w-40",
  INPUT_WIDTH_MD: "w-60",
  INPUT_WIDTH_LG: "w-80",
  INPUT_WIDTH_FULL: "w-full",

  // 间距
  FORM_GAP: "gap-4",
  FORM_ROW_GAP: "gap-2",
  BUTTON_GAP: "gap-2",

  PAGE_SIZES: [10, 20, 50, 100] as const,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_DEFAULT: 10,
  DEFAULT_PAGE: 1,

  PAGINATION: {
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_PAGE: 1,
  },

  // 搜索框
  SEARCH_INPUT_CLASS: "pl-10 h-10",
  SEARCH_ICON_CLASS: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",

  // 按钮
  BUTTON_ICON_SIZE: "h-4 w-4",
  BUTTON_PRIMARY_CLASS: "h-10 gap-2",
  BUTTON_SECONDARY_CLASS: "h-10 gap-2",

  // 表格
  TABLE_CELL_PADDING: "px-4 py-3",
}

// 统一的表单输入框样式
export const getInputClassName = (width: "sm" | "md" | "lg" | "full" = "full") => {
  const widthMap = {
    sm: UI_CONSTANTS.INPUT_WIDTH_SM,
    md: UI_CONSTANTS.INPUT_WIDTH_MD,
    lg: UI_CONSTANTS.INPUT_WIDTH_LG,
    full: UI_CONSTANTS.INPUT_WIDTH_FULL,
  }
  return `${UI_CONSTANTS.INPUT_HEIGHT} ${widthMap[width]}`
}

// 统一的按钮样式
export const getButtonClassName = (variant: "primary" | "secondary" = "primary") => {
  return variant === "primary" ? UI_CONSTANTS.BUTTON_PRIMARY_CLASS : UI_CONSTANTS.BUTTON_SECONDARY_CLASS
}
