"use client"

import { useState, useEffect } from "react"
import { INSTITUTION_ROLES } from "@/lib/constants/institution-roles"

export function useInstitutionRole() {
  const [role, setRole] = useState<string>(INSTITUTION_ROLES.PROJECT_LEADER)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("institution_role")
      console.log("[v0] useInstitutionRole - Loaded role:", storedRole)
      if (storedRole) {
        setRole(storedRole)
      }
      setLoading(false)
    }
  }, [])

  const isProjectLeader = role === INSTITUTION_ROLES.PROJECT_LEADER || role === "project_leader"
  const isInstitutionAdmin = role === INSTITUTION_ROLES.ADMIN || role === "institution_admin"

  return {
    role,
    loading,
    isProjectLeader,
    isInstitutionAdmin,
  }
}
