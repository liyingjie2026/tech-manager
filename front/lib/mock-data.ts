console.warn("Mock data is deprecated. All data should be fetched from backend API using lib/api-client.ts")

export const mockData = {
  projects: [],
  demands: [],
  batches: [],
  experts: [],
  institutions: [],
  taskBooks: [],
  changeRequests: [],
  inspections: [],
  acceptances: [],
  achievements: [],
}

export function initMockData() {
  console.warn("Mock data initialization is deprecated. Use API client instead.")
}
