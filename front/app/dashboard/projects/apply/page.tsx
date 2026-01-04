"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Upload, FileText, Edit } from "lucide-react"
// import { mockData } from "@/lib/mock-data" // Removed
import { useToast } from "@/hooks/use-toast"
import { projectApi, institutionApi } from "@/lib/api" // Changed import path
// import { projectLifecycleStore } from "@/lib/project-lifecycle-store" // Removed
// Import message for toast notifications
import { PageHeader } from "@/components/page-header"

// Define interfaces for API payloads
interface ProjectBudget {
  items: Array<{
    category: string
    subcategory: string
    amount: number
    description: string
  }>
}

interface ProjectMember {
  name: string
  title: string
  role: string
  phone: string
  email: string
  institution: string
  idCard: string
}

interface ProjectPerformance {
  paperTarget: string
  patentTarget: string
  softwareTarget: string
  standardTarget: string
  socialBenefit: string
  transformationPlan: string
}

interface FormData {
  // 汇总表
  name: string // Changed back from projectName to match entity
  supportDirection: string
  supportDirectionDesc: string
  purpose: string
  problemToSolve: string
  researchContent: string
  progressPlan: string

  // 项目情况
  projectBatch: string
  innovationPlatform: string
  applicationType: string
  projectCategory: string
  projectType: string
  projectTypeDetail: string
  startDate: string
  endDate: string
  totalBudget: string
  // requestedFunding: string // Kept for UI display if needed, though applyFunding/selfFunding are for backend
  applyBudget: string // Entity uses applyBudget not applyFunding
  selfBudget: string // Entity uses selfBudget not selfFunding
  projectPurpose: string
  mainResearchContent: string
  workingBasis: string
  organizationMeasures: string

  // For API submission
  projectCode: string
  expectedLevel: string
  breakthroughTypes: []
  govFunding: string
  duration: string
  background: string
  objectives: string // This seems to be an older field, might be redundant with projectObjective or objective
  content: string
  methodology: string
  expectedResults: string // This seems to be an older field, might be redundant with expectedResult

  // Updated fields for saveDraft mapping and API submission
  // name: string // Changed back from projectName to match entity
  researchField: string // Changed from supportDirection
  institutionId: string
  institutionName: string
  leaderId: string
  leaderName: string
  leaderPhone: string
  // applyFunding: string // Changed from applyBudget
  // selfFunding: string // Changed from selfBudget
  objective: string // Entity uses objective not researchObjective
  // researchObjective: string // Changed from objective
  // researchContent: string // Changed from content
  content: string // Entity uses content not researchContent
  expectedResult: string // Entity uses expectedResult not expectedResults
  demandId: string
  id?: string | number // For tracking project ID after saving draft
  // Added for new fields
  innovationPoints: string
  applicationProspects: string
}

export default function ProjectApplyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("situation")
  const [loading, setLoading] = useState(false) // State for loading indicator
  const [savingDraft, setSavingDraft] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // CHANGE: Add loading state and list for institutions
  const [institutions, setInstitutions] = useState<Array<{ id: number; name: string }>>([])
  const [loadingInstitutions, setLoadingInstitutions] = useState(false)

  const projectId = searchParams.get("id")
  const [isEditMode, setIsEditMode] = useState(false)

  // REMOVED WORKFLOW STATE VARIABLES
  // const [currentStage, setCurrentStage] = useState<WorkflowStage>("application")
  // const [stageStatuses, setStageStatuses] = useState<Partial<Record<WorkflowStage, StageStatus>>>({
  //   demand: "completed",
  //   market: "completed",
  //   config: "completed",
  //   application: "inProgress",
  // })
  // const [projectStatus, setProjectStatus] = useState<string>("draft")

  const [formData, setFormData] = useState<FormData>({
    // 汇总表
    name: "", // Changed back from projectName
    supportDirection: "",
    supportDirectionDesc: "",
    purpose: "",
    problemToSolve: "",
    researchContent: "",
    progressPlan: "",

    // 项目情况
    projectBatch: "",
    innovationPlatform: "",
    applicationType: "",
    projectCategory: "",
    projectType: "",
    projectTypeDetail: "",
    startDate: "",
    endDate: "",
    totalBudget: "",
    // requestedFunding: "",
    applyBudget: "", // Use applyBudget to match entity
    selfBudget: "", // Use selfBudget to match entity
    projectPurpose: "",
    mainResearchContent: "",
    workingBasis: "",
    organizationMeasures: "",

    // For API submission
    projectCode: "",
    expectedLevel: "",
    breakthroughTypes: [],
    govFunding: "",
    duration: "",
    background: "",
    objectives: "", // Older field
    content: "", // Entity uses content
    methodology: "",
    expectedResults: "", // Older field

    // Updated fields for saveDraft mapping
    // name: "", // Changed back from projectName
    researchField: "", // Changed from supportDirection
    institutionId: "",
    institutionName: "",
    leaderId: "",
    leaderName: "",
    leaderPhone: "",
    // applyFunding: "", // Changed from applyBudget
    // selfFunding: "", // Changed from selfBudget
    objective: "", // Entity uses objective
    // researchObjective: "", // Changed from objective
    // researchContent: "", // Changed from content
    content: "", // Entity uses content
    expectedResult: "", // Entity uses expectedResult
    // expectedResults: "", // Changed from expectedResult
    demandId: "", // Optional
    id: undefined, // For tracking project ID after saving draft
    // Added for new fields
    innovationPoints: "",
    applicationProspects: "",
  })

  const [researchBackground, setResearchBackground] = useState("")
  const [representativeProjects, setRepresentativeProjects] = useState([
    {
      id: 1,
      projectCode: "",
      name: "", // Keep as 'name'
      projectLeader: "",
      projectNature: "",
      projectType: "",
      startDate: "",
      endDate: "",
      totalBudget: "",
      description: "",
      orgName: "",
      orgCode: "",
    },
  ])

  const [representativePatents, setRepresentativePatents] = useState([
    {
      id: 1,
      publishDate: "",
      authorName: "",
      publicationName: "",
      authorRank: "",
      note: "",
    },
  ])

  const [representativePapers, setRepresentativePapers] = useState([
    {
      id: 1,
      publishDate: "",
      paperTitle: "",
      publicationName: "",
      authorRank: "",
      note: "",
    },
  ])

  const [institutionInfo, setInstitutionInfo] = useState({
    name: "",
    nature: "",
    unifiedSocialCreditCode: "", // Changed from unifiedCode
    legalRepresentative: "", // Added from institution data
    contactPerson: "", // Added from institution data
    contactNumber: "", // Changed key
    address: "",
    location: "",
    legalPerson: "", // Kept for legacy, but legalRepresentative is preferred
    contactPhone: "", // Kept for legacy, but contactNumber is preferred
    mobile: "",
    email: "",
  })

  const [participatingUnits, setParticipatingUnits] = useState([
    {
      id: 1,
      sequence: "1",
      name: "",
      nature: "",
      unifiedCode: "",
      address: "",
      location: "",
      legalPerson: "",
      contactPhone: "",
      mobile: "",
      email: "",
    },
  ])

  const [members, setMembers] = useState<any[]>([])
  const [budgetItems, setBudgetItems] = useState<any[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
  const [implementationPlan, setImplementationPlan] = useState<any[]>([])

  const [performanceIndicators, setPerformanceIndicators] = useState({
    technicalIndicators: "",
    economicIndicators: "",
    socialIndicators: "",
    intellectualProperty: "",
    talentDevelopment: "",
    platformConstruction: "",
    otherIndicators: "",
    // For API submission
    paperTarget: "",
    patentTarget: "",
    softwareTarget: "",
    standardTarget: "",
    socialBenefit: "",
    transformationPlan: "",
  })

  const [attachments, setAttachments] = useState([
    {
      id: 1,
      name: "",
      type: "",
      size: "",
      uploadDate: "",
      description: "",
    },
  ])

  // REMOVED WORKFLOW STATUS LOADING
  // useEffect(() => {
  //   if (projectId) {
  //     loadWorkflowStatus()
  //   }
  // }, [projectId])

  // const loadWorkflowStatus = async () => {
  //   if (!projectId) return

  //   try {
  //     const response = await projectApi.getWorkflowStatus(Number(projectId))
  //     if (response.data) {
  //       setCurrentStage(response.data.currentStage || "application")
  //       setProjectStatus(response.data.status || "draft")

  //       // Build stage statuses from completed stages
  //       const statuses: Partial<Record<WorkflowStage, StageStatus>> = {}
  //       response.data.completedStages?.forEach((stage: string) => {
  //         statuses[stage as WorkflowStage] = "completed"
  //       })
  //       statuses[response.data.currentStage as WorkflowStage] = "inProgress"
  //       setStageStatuses(statuses)
  //     }
  //   } catch (error) {
  //     console.error("Failed to load workflow status:", error)
  //   }
  // }

  // CHANGE: Add loading institutions effect
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoadingInstitutions(true)
        const response = await institutionApi.getAll()
        if (response.data) {
          setInstitutions(
            response.data.map((inst: any) => ({
              id: inst.id,
              name: inst.name,
            })),
          )
        }
      } catch (error) {
        console.error("[v0] Failed to fetch institutions:", error)
        toast({
          title: "加载机构列表失败",
          description: "请稍后重试",
          variant: "destructive",
        })
      } finally {
        setLoadingInstitutions(false)
      }
    }

    fetchInstitutions()
  }, [])

  const loadProject = async (id: string) => {
    try {
      console.log("[v0] Loading project with ID:", id)
      const response = await projectApi.getById(Number(id))
      const project = response.data
      console.log("[v0] Loaded project data:", project)

      if (project) {
        setFormData((prev) => ({
          ...prev,
          // Basic info
          name: project.name || "",
          projectBatch: project.projectBatch || "",
          innovationPlatform: project.innovationPlatform || "",
          projectType: project.projectType || "",
          projectCategory: project.projectCategory || "",
          researchField: project.researchField || "",

          // Dates and budget
          startDate: project.startDate || "",
          endDate: project.endDate || "",
          totalBudget: project.totalBudget ? (project.totalBudget / 10000).toFixed(2) : "",
          applyBudget: project.applyBudget ? (project.applyBudget / 10000).toFixed(2) : "",
          selfBudget: project.selfBudget ? (project.selfBudget / 10000).toFixed(2) : "",

          // Institution and leader
          institutionId: project.institutionId?.toString() || "",
          institutionName: project.institutionName || "",
          leaderId: project.leaderId?.toString() || "",
          leaderName: project.leaderName || "",
          leaderPhone: project.leaderPhone || "",

          // Content fields
          objective: project.objective || "",
          content: project.content || "",
          expectedResult: project.expectedResult || "",
          innovationPoints: project.innovationPoints || "",
          applicationProspects: project.applicationProspects || "",

          // Other fields
          demandId: project.demandId?.toString() || "",
          id: project.id || undefined,
        }))
        console.log("[v0] FormData updated with project fields")

        if (project.institutionId) {
          try {
            console.log("[v0] Loading institution with ID:", project.institutionId)
            const instResponse = await institutionApi.getById(project.institutionId)
            if (instResponse.data) {
              const inst = instResponse.data
              console.log("[v0] Loaded institution data:", inst)

              // Map institution fields to institutionInfo state
              setInstitutionInfo({
                name: inst.name || "",
                nature: inst.type || "", // Map type to nature (机构类型 -> 项目性质)
                unifiedSocialCreditCode: inst.creditCode || "",
                legalRepresentative: inst.legalPerson || "",
                contactPerson: inst.contactPerson || "",
                contactNumber: inst.contactPhone || "",
                address: inst.address || "",
                location: `${inst.province || ""}${inst.city || ""}${inst.district || ""}`,
                legalPerson: inst.legalPerson || "",
                contactPhone: inst.contactPhone || "",
                mobile: inst.legalPersonPhone || "",
                email: inst.contactEmail || "",
              })
              console.log("[v0] InstitutionInfo updated successfully")
            }
          } catch (error) {
            console.error("[v0] Failed to load institution details:", error)
          }
        }

        // Load members if available
        if (project.members && project.members.length > 0) {
          setMembers(
            project.members.map((member, index) => ({
              id: Date.now() + index,
              sequence: String(index + 1),
              name: member.name || "",
              gender: member.gender || "",
              birthDate: member.birthDate || "",
              idType: member.idType || "",
              idNumber: member.idNumber || "",
              nationality: member.nationality || "",
              workUnit: member.workUnit || "",
              responsibility: member.responsibility || "",
              department: member.department || "",
              degree: member.degree || "",
              graduateSchool: member.graduateSchool || "",
              contactPhone: member.contactPhone || "",
              mobile: member.mobile || "",
              email: member.email || "",
              // For API submission - ensure these map to backend DTO if different
              title: member.title || "",
              role: member.role || "",
              phone: member.phone || "",
              institution: member.institution || "",
              idCard: member.idCard || "",
            })),
          )
        }

        // Load budget items if available
        if (project.budgetDetails && project.budgetDetails.length > 0) {
          setBudgetItems(
            project.budgetDetails.map((item, index) => ({
              id: Date.now() + index,
              category: item.category || "",
              subcategory: item.subcategory || "",
              amount: Number(item.amount) || 0,
              description: item.description || "",
            })),
          )
        }

        // Load milestones if available
        if (project.milestones && project.milestones.length > 0) {
          setMilestones(
            project.milestones.map((milestone, index) => ({
              id: Date.now() + index,
              phase: milestone.phase || "",
              content: milestone.content || "",
              deliverable: milestone.deliverable || "",
              month: milestone.month || "",
            })),
          )
        }

        // Load implementation plan if available
        if (project.implementationPlan && project.implementationPlan.length > 0) {
          setImplementationPlan(
            project.implementationPlan.map((phase, index) => ({
              id: Date.now() + index,
              phase: phase.phase || "",
              startMonth: phase.startMonth || "",
              endMonth: phase.endMonth || "",
              researchContent: phase.researchContent || "",
              keyTasks: phase.keyTasks || "",
              deliverables: phase.deliverables || "",
              responsiblePerson: phase.responsiblePerson || "",
            })),
          )
        }

        // Load performance indicators if available
        setPerformanceIndicators({
          paperTarget: project.paperTarget || "",
          patentTarget: project.patentTarget || "",
          softwareTarget: project.softwareTarget || "",
          standardTarget: project.standardTarget || "",
          socialBenefit: project.socialBenefit || "",
          transformationPlan: project.transformationPlan || "",
        })

        // Load attachments if available
        if (project.attachments && project.attachments.length > 0) {
          setAttachments(
            project.attachments.map((att, index) => ({
              id: Date.now() + index,
              name: att.fileName || "",
              type: att.fileType || "",
              size: att.fileSize || "",
              uploadDate: att.uploadDate || "",
              description: att.description || "",
            })),
          )
        }
      }
    } catch (error: any) {
      console.error("Failed to load project:", error)
      toast({
        title: "加载失败",
        description: error.message || "无法加载项目信息",
        variant: "destructive",
      })
    }
  }

  // Use projectId from searchParams or formData.id (if editing)
  const editProjectId = projectId || (formData.id ? String(formData.id) : undefined)

  useEffect(() => {
    if (editProjectId) {
      setIsEditMode(true) // Set edit mode if there's an ID
      loadProject(editProjectId)
    } else {
      // Reset form for new project creation if no ID is present
      setIsEditMode(false)
      setFormData({
        // Reset to initial empty state or a default state
        name: "",
        supportDirection: "",
        supportDirectionDesc: "",
        purpose: "",
        problemToSolve: "",
        researchContent: "",
        progressPlan: "",
        projectBatch: "",
        innovationPlatform: "",
        applicationType: "",
        projectCategory: "",
        projectType: "",
        projectTypeDetail: "",
        startDate: "",
        endDate: "",
        totalBudget: "",
        // requestedFunding: "",
        applyBudget: "",
        selfBudget: "",
        projectPurpose: "",
        mainResearchContent: "",
        workingBasis: "",
        organizationMeasures: "",
        projectCode: "",
        expectedLevel: "",
        breakthroughTypes: [],
        govFunding: "",
        duration: "",
        background: "",
        objectives: "",
        content: "",
        methodology: "",
        expectedResults: "",
        // name: "", // Changed back from projectName
        researchField: "",
        institutionId: "",
        institutionName: "",
        leaderId: "",
        leaderName: "",
        leaderPhone: "",
        // applyFunding: "",
        // selfFunding: "",
        objective: "",
        // researchObjective: "",
        // researchContent: "",
        content: "",
        expectedResult: "",
        // expectedResults: "",
        demandId: "",
        id: undefined,
        // Added for new fields
        innovationPoints: "",
        applicationProspects: "",
      })
      setInstitutionInfo({
        name: "",
        nature: "",
        unifiedSocialCreditCode: "",
        legalRepresentative: "",
        contactPerson: "",
        contactNumber: "",
        address: "",
        location: "",
        legalPerson: "",
        contactPhone: "",
        mobile: "",
        email: "",
      })
      setMembers([])
      setBudgetItems([])
      setMilestones([])
      setImplementationPlan([])
      setPerformanceIndicators({
        technicalIndicators: "",
        economicIndicators: "",
        socialIndicators: "",
        intellectualProperty: "",
        talentDevelopment: "",
        platformConstruction: "",
        otherIndicators: "",
        paperTarget: "",
        patentTarget: "",
        softwareTarget: "",
        standardTarget: "",
        socialBenefit: "",
        transformationPlan: "",
      })
      setAttachments([{ id: 1, name: "", type: "", size: "", uploadDate: "", description: "" }])
      setResearchBackground("")
      setRepresentativeProjects([
        {
          id: 1,
          projectCode: "",
          name: "", // Keep as 'name'
          projectLeader: "",
          projectNature: "",
          projectType: "",
          startDate: "",
          endDate: "",
          totalBudget: "",
          description: "",
          orgName: "",
          orgCode: "",
        },
      ])
      setRepresentativePatents([
        { id: 1, publishDate: "", authorName: "", publicationName: "", authorRank: "", note: "" },
      ])
      setRepresentativePapers([
        { id: 1, publishDate: "", paperTitle: "", publicationName: "", authorRank: "", note: "" },
      ])
      setParticipatingUnits([
        {
          id: 1,
          sequence: "1",
          name: "",
          nature: "",
          unifiedCode: "",
          address: "",
          location: "",
          legalPerson: "",
          contactPhone: "",
          mobile: "",
          email: "",
        },
      ])
    }
  }, [projectId, searchParams, toast]) // Re-run effect if projectId or searchParams change

  useEffect(() => {
    // Sync purpose from project situation tab
    if (formData.projectPurpose) {
      updateFormData("purpose", formData.projectPurpose)
    }
    // Sync research content from project situation tab
    if (formData.mainResearchContent) {
      updateFormData("researchContent", formData.mainResearchContent)
    }
    // Sync progress plan from implementation plan
    const progressText = implementationPlan
      .map((phase) => `${phase.phase}: ${phase.researchContent || phase.deliverables}`)
      .join("\n")
    if (progressText) {
      updateFormData("progressPlan", progressText.substring(0, 150))
    }
  }, [formData.projectPurpose, formData.mainResearchContent, implementationPlan])

  // Define totalBudget before it's used. It's calculated from budgetItems.
  const totalBudget = budgetItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

  useEffect(() => {
    // Convert yuan to wan yuan (10000 yuan = 1 wan yuan)
    const totalBudgetInWanYuan = (totalBudget / 10000).toFixed(2)
    updateFormData("totalBudget", totalBudgetInWanYuan)

    // Calculate self-funding = total budget - requested funding
    const requestedFunding = Number(formData.applyBudget) || 0 // Use applyBudget
    const selfFunding = (Number(totalBudgetInWanYuan) - requestedFunding).toFixed(2)
    updateFormData("selfBudget", selfFunding) // Use selfBudget
  }, [totalBudget, formData.applyBudget]) // Use applyBudget

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateInstitutionInfo = (field: string, value: string) => {
    setInstitutionInfo((prev) => ({ ...prev, [field]: value }))
  }

  // CHANGE: Modified to accept string ID and parse it
  const handleInstitutionSelect = async (idStr: string) => {
    const id = Number.parseInt(idStr)
    if (isNaN(id)) return

    try {
      const response = await institutionApi.getById(id)
      if (response.data) {
        const data = response.data
        setInstitutionInfo({
          name: data.name,
          nature: data.type || "", // Corrected: map `type` to `nature`
          unifiedSocialCreditCode: data.creditCode || "",
          legalRepresentative: data.legalPerson || "",
          contactPerson: data.contactPerson || "",
          contactNumber: data.contactPhone || "",
          address: data.address || "",
          location: `${data.province || ""}${data.city || ""}${data.district || ""}`,
          legalPerson: data.legalPerson || "",
          contactPhone: data.contactPhone || "",
          mobile: data.legalPersonPhone || "",
          email: data.contactEmail || "",
        })
        updateFormData("institutionName", data.name)
        updateFormData("institutionId", String(id))
      } else {
        // Handle cases where the API returns a success code but no data, or an error code
        throw new Error(response.message || "获取机构详情失败")
      }
    } catch (error: any) {
      console.error("Failed to fetch institution details:", error)
      toast({
        title: "获取机构详情失败",
        description: error.message || "请稍后重试",
        variant: "destructive",
      })
      // If API fails, fallback to setting name and clearing ID
      // No longer setting name as it will be handled by the Select's placeholder/initial value if it fails
      // updateFormData("institutionName", unitName) // Removed this line as unitName is no longer passed
      updateFormData("institutionId", "")
    }
  }

  const handleParticipatingUnitSelect = async (idStr: string, unitName: string, index: number) => {
    const id = Number.parseInt(idStr)
    if (isNaN(id)) return

    try {
      const response = await institutionApi.getById(id)
      if (response.data) {
        const data = response.data
        const updatedUnit = {
          id: String(id), // Use id from response for consistency
          name: data.name,
          nature: data.type || "", // Corrected: map `type` to `nature`
          unifiedCode: data.creditCode || "",
          address: data.address || "",
          location: `${data.province || ""}${data.city || ""}${data.district || ""}`,
          legalPerson: data.legalPerson || "",
          // Assuming these fields are available from institutionApi.getById
          contactPhone: data.contactPhone || "",
          mobile: data.legalPersonPhone || "", // Assuming legalPersonPhone maps to mobile
          email: data.contactEmail || "",
          sequence: String(index + 1), // Keep sequence updated
        }

        setParticipatingUnits((prev) => {
          const newUnits = [...prev]
          newUnits[index] = updatedUnit
          return newUnits
        })
      } else {
        throw new Error(response.message || "获取协作单位详情失败")
      }
    } catch (error: any) {
      console.error("Failed to fetch participating unit details:", error)
      toast({
        title: "获取协作单位详情失败",
        description: error.message || "请稍后重试",
        variant: "destructive",
      })
      // If API fails, fallback to setting name and clearing other fields
      // No longer adding a new unit, just updating the existing one with partial info
      setParticipatingUnits((prev) => {
        const newUnits = [...prev]
        if (newUnits[index]) {
          newUnits[index] = {
            ...newUnits[index],
            id: String(id),
            name: unitName, // Keep the name if provided or from previous state
            nature: "",
            unifiedCode: "",
            address: "",
            location: "",
            legalPerson: "",
            contactPhone: "",
            mobile: "",
            email: "",
          }
        }
        return newUnits
      })
    }
  }

  const handleFileUpload = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const now = new Date()
      const uploadTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

      const fileExtension = file.name.split(".").pop()?.toLowerCase() || ""

      setAttachments(
        attachments.map((a) =>
          a.id === id
            ? {
                ...a,
                name: file.name,
                type: fileExtension,
                size: `${(file.size / 1024).toFixed(2)} KB`,
                uploadDate: uploadTime,
              }
            : a,
        ),
      )

      toast({
        title: "上传成功",
        description: `文件 ${file.name} 已成功上传`,
      })
    }
  }

  const addRepresentativeProject = () => {
    setRepresentativeProjects([
      ...representativeProjects,
      {
        id: Date.now(),
        projectCode: "",
        name: "", // Keep as 'name'
        projectLeader: "",
        projectNature: "",
        projectType: "",
        startDate: "",
        endDate: "",
        totalBudget: "",
        description: "",
        orgName: "",
        orgCode: "",
      },
    ])
  }

  const removeRepresentativeProject = (id: number) => {
    setRepresentativeProjects(representativeProjects.filter((p) => p.id !== id))
  }

  const updateRepresentativeProject = (id: number, field: string, value: string) => {
    setRepresentativeProjects(representativeProjects.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const addRepresentativePatent = () => {
    setRepresentativePatents([
      ...representativePatents,
      {
        id: Date.now(),
        publishDate: "",
        authorName: "",
        publicationName: "",
        authorRank: "",
        note: "",
      },
    ])
  }

  const removeRepresentativePatent = (id: number) => {
    setRepresentativePatents(representativePatents.filter((p) => p.id !== id))
  }

  const updateRepresentativePatent = (id: number, field: string, value: string) => {
    setRepresentativePatents(representativePatents.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const addRepresentativePaper = () => {
    setRepresentativePapers([
      ...representativePapers,
      {
        id: Date.now(),
        publishDate: "",
        paperTitle: "",
        publicationName: "",
        authorRank: "",
        note: "",
      },
    ])
  }

  const removeRepresentativePaper = (id: number) => {
    setRepresentativePapers(representativePapers.filter((p) => p.id !== id))
  }

  const updateRepresentativePaper = (id: number, field: string, value: string) => {
    setRepresentativePapers(representativePapers.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const addParticipatingUnit = () => {
    setParticipatingUnits([
      ...participatingUnits,
      {
        id: Date.now(),
        sequence: String(participatingUnits.length + 1),
        name: "",
        nature: "",
        unifiedCode: "",
        address: "",
        location: "",
        legalPerson: "",
        contactPhone: "",
        mobile: "",
        email: "",
      },
    ])
  }

  const removeParticipatingUnit = (id: number) => {
    setParticipatingUnits(participatingUnits.filter((u) => u.id !== id))
  }

  const updateParticipatingUnit = (id: number, field: string, value: string) => {
    setParticipatingUnits(participatingUnits.map((u) => (u.id === id ? { ...u, [field]: value } : u)))
  }

  const addMember = () => {
    setMembers([
      ...members,
      {
        id: Date.now(),
        sequence: String(members.length + 1),
        name: "",
        gender: "",
        birthDate: "",
        idType: "",
        idNumber: "",
        nationality: "",
        workUnit: "",
        responsibility: "",
        department: "",
        degree: "",
        graduateSchool: "",
        contactPhone: "",
        mobile: "",
        email: "",
        // For API submission
        title: "",
        role: "",
        phone: "",
        institution: "",
        idCard: "",
      },
    ])
  }

  const removeMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  const updateMember = (id: number, field: string, value: string) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const addBudgetItem = () => {
    setBudgetItems([
      ...budgetItems,
      {
        id: Date.now(),
        category: "",
        subcategory: "",
        amount: 0,
        description: "",
      },
    ])
  }

  const removeBudgetItem = (id: number) => {
    setBudgetItems(budgetItems.filter((b) => b.id !== id))
  }

  const updateBudgetItem = (id: number, field: string, value: any) => {
    setBudgetItems(budgetItems.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
  }

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: Date.now(),
        phase: "",
        content: "",
        deliverable: "",
        month: "",
      },
    ])
  }

  const removeMilestone = (id: number) => {
    setMilestones(milestones.filter((m) => m.id !== id))
  }

  const updateMilestone = (id: number, field: string, value: string) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const addImplementationPhase = () => {
    setImplementationPlan([
      ...implementationPlan,
      {
        id: Date.now(),
        phase: `第${implementationPlan.length + 1}年`,
        startMonth: "",
        endMonth: "",
        researchContent: "",
        keyTasks: "",
        deliverables: "",
        responsiblePerson: "",
      },
    ])
  }

  const removeImplementationPhase = (id: number) => {
    setImplementationPlan(implementationPlan.filter((p) => p.id !== id))
  }

  const updateImplementationPhase = (id: number, field: string, value: string) => {
    setImplementationPlan(implementationPlan.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const updatePerformanceIndicator = (field: string, value: string) => {
    setPerformanceIndicators((prev) => ({ ...prev, [field]: value }))
  }

  const addAttachment = () => {
    setAttachments([
      ...attachments,
      {
        id: Date.now(),
        name: "",
        type: "",
        size: "",
        uploadDate: new Date().toISOString().split("T")[0],
        description: "",
      },
    ])
  }

  const removeAttachment = (id: number) => {
    setAttachments(attachments.filter((a) => a.id !== id))
  }

  const updateAttachment = (id: number, field: string, value: string) => {
    setAttachments(attachments.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  const handleSaveDraft = async () => {
    try {
      setSavingDraft(true) // Use savingDraft state
      const draftData: any = {
        name: formData.name,
        researchField: formData.researchField,
        institutionId: Number(formData.institutionId),
        institutionName: formData.institutionName,
        leaderId: Number(formData.leaderId),
        leaderName: formData.leaderName,
        leaderPhone: formData.leaderPhone,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalBudget: Number(formData.totalBudget) * 10000,
        applyBudget: Number(formData.applyBudget) * 10000, // Use applyBudget
        selfBudget: Number(formData.selfBudget) * 10000, // Use selfBudget
        objective: formData.objective, // Use objective
        content: formData.content, // Use content
        expectedResult: formData.expectedResult, // Use expectedResult
        demandId: formData.demandId,
        // Add other fields that need to be saved as draft if they exist in the DTO
        projectBatch: formData.projectBatch, // Assuming these are also part of the DTO
        innovationPlatform: formData.innovationPlatform,
        applicationType: formData.applicationType,
        projectCategory: formData.projectCategory,
        projectType: formData.projectType,
        projectTypeDetail: formData.projectTypeDetail,
        projectPurpose: formData.projectPurpose,
        mainResearchContent: formData.mainResearchContent,
        workingBasis: formData.workingBasis,
        organizationMeasures: formData.organizationMeasures,
        // Added for new fields
        innovationPoints: formData.innovationPoints,
        applicationProspects: formData.applicationProspects,
        // Ensure other fields like problemToSolve, progressPlan, etc., are mapped if required by backend
      }

      // Only include institutionId and leaderId if they are valid numbers greater than 0
      if (isNaN(draftData.institutionId) || draftData.institutionId <= 0) {
        delete draftData.institutionId
      }
      if (isNaN(draftData.leaderId) || draftData.leaderId <= 0) {
        delete draftData.leaderId
      }

      console.log("[v0] Saving draft with data:", draftData)

      let response
      if (formData.id) {
        // Use formData.id to check if it's an edit operation
        response = await projectApi.updateDraft(Number(formData.id), draftData)
      } else {
        response = await projectApi.saveDraft(draftData)
        if (response.success && response.data) {
          // Update formData with the new project ID
          setFormData((prev) => ({ ...prev, id: response.data }))
        }
      }

      if (response.success) {
        toast({
          title: "保存成功",
          description: "项目草稿已保存",
        })

        setTimeout(() => {
          router.push("/dashboard/my-projects")
        }, 1000)
      } else {
        throw new Error(response.message || "保存失败")
      }
    } catch (error: any) {
      console.error("[v0] Error saving draft:", error)
      toast({
        title: "保存失败",
        description: error.message || "保存项目草稿时发生错误。",
        variant: "destructive",
      })
    } finally {
      setSavingDraft(false) // Use savingDraft state
    }
  }

  const handleSubmit = async () => {
    // Ensure the project has an ID before submitting (either loaded or newly saved)
    let currentProjectId = formData.id // Use the ID from formData

    // If no project ID exists, save as draft first to get an ID
    if (!currentProjectId && !isEditMode) {
      try {
        console.log("[v0] No project ID found and not in edit mode, saving draft first...")
        // Prepare draft data similar to handleSaveDraft
        const draftData: any = {
          name: formData.name,
          researchField: formData.researchField,
          institutionId: Number(formData.institutionId),
          institutionName: formData.institutionName,
          leaderId: Number(formData.leaderId),
          leaderName: formData.leaderName,
          leaderPhone: formData.leaderPhone,
          startDate: formData.startDate,
          endDate: formData.endDate,
          totalBudget: Number(formData.totalBudget) * 10000,
          applyBudget: Number(formData.applyBudget) * 10000, // Use applyBudget
          selfBudget: Number(formData.selfBudget) * 10000, // Use selfBudget
          objective: formData.objective, // Use objective
          content: formData.content, // Use content
          expectedResult: formData.expectedResult, // Use expectedResult
          demandId: formData.demandId,
          projectBatch: formData.projectBatch,
          innovationPlatform: formData.innovationPlatform,
          applicationType: formData.applicationType,
          projectCategory: formData.projectCategory,
          projectType: formData.projectType,
          projectTypeDetail: formData.projectTypeDetail,
          projectPurpose: formData.projectPurpose,
          mainResearchContent: formData.mainResearchContent,
          workingBasis: formData.workingBasis,
          organizationMeasures: formData.organizationMeasures,
          innovationPoints: formData.innovationPoints,
          applicationProspects: formData.applicationProspects,
        }

        // Clean up invalid IDs
        if (isNaN(draftData.institutionId) || draftData.institutionId <= 0) delete draftData.institutionId
        if (isNaN(draftData.leaderId) || draftData.leaderId <= 0) delete draftData.leaderId

        const saveResponse = await projectApi.saveDraft(draftData)
        if (saveResponse.success && saveResponse.data) {
          currentProjectId = saveResponse.data // Update currentProjectId with the new ID
          console.log("[v0] Draft saved successfully with ID:", currentProjectId)
          // Update the URL with the new project ID
          router.push(`/dashboard/projects/apply?id=${currentProjectId}`)
          // Update form data with the new ID to reflect in subsequent operations
          setFormData((prev) => ({ ...prev, id: currentProjectId }))
          toast({
            title: "草稿已保存",
            description: "项目草稿已保存，请继续填写并提交",
          })
        } else {
          throw new Error(saveResponse.message || "无法创建项目草稿")
        }
      } catch (error: any) {
        console.error("[v0] Error saving draft before submit:", error)
        toast({
          title: "保存草稿失败",
          description: "提交前需要先保存项目草稿",
          variant: "destructive",
        })
        return
      }
    } else if (!currentProjectId && isEditMode) {
      // This case should ideally not happen if editing an existing project, but as a safeguard:
      toast({
        title: "错误",
        description: "无法找到正在编辑的项目ID。",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true) // Use submitting state

      console.log("[v0] Starting project submission process for ID:", currentProjectId)

      // 1. Save budget items
      if (budgetItems && budgetItems.length > 0) {
        console.log("[v0] Saving", budgetItems.length, "budget items for project ID:", currentProjectId)
        const fullBudgetData: ProjectBudget = {
          items: budgetItems
            .filter((item) => item.category && item.amount > 0) // Filter out empty or zero-amount items
            .map((item) => ({
              category: item.category,
              subcategory: item.subcategory || "",
              amount: Number(item.amount) || 0,
              description: item.description || "",
            })),
        }

        if (fullBudgetData.items.length > 0) {
          const budgetResponse = await projectApi.saveBudget(Number(currentProjectId), fullBudgetData)
          if (!budgetResponse.success) {
            console.warn(`[v0] Failed to save budget items:`, budgetResponse.message)
            throw new Error(`Budget saving failed: ${budgetResponse.message}`)
          }
          console.log("[v0] Budget items saved successfully")
        } else {
          console.log("[v0] No valid budget items to save.")
        }
      }

      // 2. Save team members
      if (members && members.length > 0) {
        console.log("[v0] Adding", members.length, "project members for project ID:", currentProjectId)
        for (const member of members) {
          if (!member.name) continue // Skip empty members

          const memberData: ProjectMember = {
            name: member.name,
            title: member.title || member.degree || "",
            role: member.role || member.responsibility || "成员",
            phone: member.phone || member.mobile || member.contactPhone || "",
            email: member.email || "",
            institution: member.institution || member.workUnit || "",
            idCard: member.idCard || member.idNumber || "",
          }

          console.log("[v0] Adding member:", memberData)
          const memberResponse = await projectApi.addMember(Number(currentProjectId), memberData)
          if (!memberResponse.success) {
            console.warn(`[v0] Failed to add member ${member.name}:`, memberResponse.message)
          }
        }
        console.log("[v0] All members processed successfully")
      }

      // 3. Save performance indicators
      if (performanceIndicators) {
        console.log("[v0] Saving performance indicators for project ID:", currentProjectId)
        const performanceData: ProjectPerformance = {
          paperTarget: performanceIndicators.paperTarget || "",
          patentTarget: performanceIndicators.patentTarget || "",
          softwareTarget: performanceIndicators.softwareTarget || "",
          standardTarget: performanceIndicators.standardTarget || "",
          socialBenefit: performanceIndicators.socialBenefit || "",
          transformationPlan: performanceIndicators.transformationPlan || "",
        }
        console.log("[v0] Performance data:", performanceData)
        const performanceResponse = await projectApi.savePerformance(Number(currentProjectId), performanceData)
        if (!performanceResponse.success) {
          console.warn(`[v0] Failed to save performance indicators:`, performanceResponse.message)
          throw new Error(`Performance indicators saving failed: ${performanceResponse.message}`)
        } else {
          console.log("[v0] Performance indicators saved successfully")
        }
      }

      // Step 5: Submit the project
      console.log("[v0] Submitting project with ID:", currentProjectId)
      const response = await projectApi.submit(Number(currentProjectId))

      if (response.success) {
        toast({
          title: "提交成功",
          description: "项目申报已提交，等待机构管理员审核",
        })

        setTimeout(() => {
          router.push("/dashboard/my-projects")
        }, 1500)
      } else {
        throw new Error(response.message || "提交失败")
      }
    } catch (error: any) {
      console.error("[v0] Error submitting project:", error)
      toast({
        title: "提交失败",
        description: error.message || "提交项目申报时发生错误。",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false) // Use submitting state
    }
  }

  const handleWorkflowAction = (action: any) => {
    if (action.id === "submit") {
      handleSubmit()
    } else if (action.id === "save_draft") {
      handleSaveDraft()
    } else if (action.id === "preview") {
      // Preview logic can be added later
      toast({
        title: "预览功能",
        description: "预览功能即将推出",
      })
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <PageHeader
          title={isEditMode ? "编辑项目" : "项目申报"}
          description={isEditMode ? "修改项目申报信息并重新提交" : "填写项目申报信息并提交审核"}
          showBack
          backUrl="/dashboard/my-projects"
        />

        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-9">
                <TabsTrigger value="situation">项目情况</TabsTrigger>
                <TabsTrigger value="summary">汇总表</TabsTrigger>
                <TabsTrigger value="institution">申报单位</TabsTrigger>
                <TabsTrigger value="members">项目成员</TabsTrigger>
                <TabsTrigger value="background">研究背景</TabsTrigger>
                <TabsTrigger value="implementation">实施计划</TabsTrigger>
                <TabsTrigger value="performance">绩效指标</TabsTrigger>
                <TabsTrigger value="budget">预算填报</TabsTrigger>
                <TabsTrigger value="attachments">其它附件</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {" "}
                    {/* Changed id from projectName to name */}
                    项目名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="项目名称"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="researchField">支持方向</Label> {/* Changed from supportDirection */}
                  <Select
                    value={formData.researchField} // Changed from supportDirection
                    onValueChange={(v) => updateFormData("researchField", v)} // Changed from supportDirection
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择支持方向" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="科研类">科研类</SelectItem>
                      <SelectItem value="技术开发">技术开发</SelectItem>
                      <SelectItem value="成果转化">成果转化</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportDirectionDesc">支持方向说明</Label>
                  <Textarea
                    id="supportDirectionDesc"
                    rows={3}
                    value={formData.supportDirectionDesc}
                    onChange={(e) => updateFormData("supportDirectionDesc", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">
                    目的意义 <span className="text-muted-foreground text-xs">(150字以内，继承自项目情况)</span>
                  </Label>
                  <Textarea
                    id="purpose"
                    rows={5}
                    maxLength={150}
                    placeholder="自动继承项目情况中的目的和意义..."
                    value={formData.purpose}
                    readOnly
                    className="bg-muted"
                  />
                  <div className="text-xs text-muted-foreground text-right">{formData.purpose.length}/150</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problemToSolve">
                    拟解决问题 <span className="text-muted-foreground text-xs">(100字以内)</span>
                  </Label>
                  <Textarea
                    id="problemToSolve"
                    rows={4}
                    maxLength={100}
                    placeholder="请描述拟解决的问题..."
                    value={formData.problemToSolve}
                    onChange={(e) => updateFormData("problemToSolve", e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground text-right">{formData.problemToSolve.length}/100</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="researchContent">
                    主要研究内容 <span className="text-muted-foreground text-xs">(150字以内，继承自项目情况)</span>
                  </Label>
                  <Textarea
                    id="researchContent"
                    rows={5}
                    maxLength={150}
                    placeholder="自动继承项目情况中的主要研究内容..."
                    value={formData.researchContent}
                    readOnly
                    className="bg-muted"
                  />
                  <div className="text-xs text-muted-foreground text-right">{formData.researchContent.length}/150</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="progressPlan">
                    主要进度安排 <span className="text-muted-foreground text-xs">(150字以内，继承自实施计划)</span>
                  </Label>
                  <Textarea
                    id="progressPlan"
                    rows={5}
                    maxLength={150}
                    placeholder="自动继承实施计划中的进度安排..."
                    value={formData.progressPlan}
                    readOnly
                    className="bg-muted"
                  />
                  <div className="text-xs text-muted-foreground text-right">{formData.progressPlan.length}/150</div>
                </div>
              </TabsContent>

              <TabsContent value="situation" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectBatch">
                      项目批次 <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.projectBatch} onValueChange={(v) => updateFormData("projectBatch", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择项目批次" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="202508自然资源科研（标准）项目">202508自然资源科研（标准）项目</SelectItem>
                        <SelectItem value="202508自然资源科研（创新）项目">202508自然资源科研（创新）项目</SelectItem>
                        <SelectItem value="202508其他科研项目">202508其他科研项目</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="innovationPlatform">
                      创新平台 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.innovationPlatform}
                      onValueChange={(v) => updateFormData("innovationPlatform", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择创新平台" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="第一工程中心">第一工程中心</SelectItem>
                        <SelectItem value="第二工程中心">第二工程中心</SelectItem>
                        <SelectItem value="科研实验室">科研实验室</SelectItem>
                        <SelectItem value="技术研发中心">技术研发中心</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    {" "}
                    {/* Changed from situationName */}
                    项目名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name" // Changed from situationName
                    placeholder="请输入项目名称"
                    value={formData.name} // Changed from name
                    onChange={(e) => updateFormData("name", e.target.value)} // Changed from name
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Reorganized fields to match the form layout in image */}
                  <div className="space-y-2">
                    <Label htmlFor="projectTypeDetail">
                      项目类型 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.projectTypeDetail}
                      onValueChange={(v) => updateFormData("projectTypeDetail", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择项目类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="启补助项目">启补助项目</SelectItem>
                        <SelectItem value="自筹项目">自筹项目</SelectItem>
                        <SelectItem value="联合项目">联合项目</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leaderName">
                      项目负责人 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="leaderName"
                      placeholder="请输入"
                      value={formData.leaderName}
                      onChange={(e) => updateFormData("leaderName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">
                      项目开始时间 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormData("startDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">
                      项目截止时间 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateFormData("endDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalBudget">项目总预算（万元）</Label>
                    <Input
                      id="totalBudget"
                      type="number"
                      step="0.01"
                      placeholder="请输入"
                      value={formData.totalBudget}
                      onChange={(e) => updateFormData("totalBudget", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="applyBudget">申请专项经费（万元）</Label> {/* Changed from requestedFunding */}
                    <Input
                      id="applyBudget" // Changed from requestedFunding
                      type="number"
                      step="0.01"
                      placeholder="请输入"
                      value={formData.applyBudget} // Changed from requestedFunding
                      onChange={(e) => updateFormData("applyBudget", e.target.value)} // Changed from requestedFunding
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="selfBudget">自筹/其他经费（万元）</Label> {/* Changed key */}
                    <Input
                      id="selfBudget" // Changed key
                      type="number"
                      step="0.01"
                      placeholder="请输入"
                      value={formData.selfBudget} // Changed key
                      onChange={(e) => updateFormData("selfBudget", e.target.value)} // Changed key
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective">
                    {" "}
                    {/* Changed from projectPurpose */}
                    项目目的和意义 <span className="text-muted-foreground text-xs">(限300字)</span>
                  </Label>
                  <Textarea
                    id="objective" // Changed from projectPurpose
                    rows={6}
                    maxLength={300}
                    placeholder="1、项目提出背景与意义&#10;2、国内外发展现状与趋势&#10;3、项目拟重点解决的问题"
                    value={formData.objective} // Changed from projectPurpose
                    onChange={(e) => updateFormData("objective", e.target.value)} // Changed from projectPurpose
                  />
                  <div className="text-xs text-muted-foreground text-right">{formData.objective.length}/300</div>{" "}
                  {/* Changed from projectPurpose */}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">
                    {" "}
                    {/* Changed from mainResearchContent */}
                    项目主要研究内容 <span className="text-muted-foreground text-xs">(限800字)</span>
                  </Label>
                  <Textarea
                    id="content" // Changed from mainResearchContent
                    rows={8}
                    maxLength={800}
                    placeholder="主要研究内容，关键技术和创新点"
                    value={formData.content} // Changed from mainResearchContent
                    onChange={(e) => updateFormData("content", e.target.value)} // Changed from mainResearchContent
                  />
                  <div className="text-xs text-muted-foreground text-right">{formData.content.length}/800</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingBasis">
                    现有工作基础与优势 <span className="text-muted-foreground text-xs">(限800字)</span>
                  </Label>
                  <Textarea
                    id="workingBasis"
                    rows={8}
                    maxLength={800}
                    placeholder="项目申报单位及主要参与单位研究基础及条件"
                    value={formData.workingBasis}
                    onChange={(e) => updateFormData("workingBasis", e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground text-right">{formData.workingBasis.length}/800</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationMeasures">
                    项目的组织实施与保障措施 <span className="text-muted-foreground text-xs">(限500字)</span>
                  </Label>
                  <Textarea
                    id="organizationMeasures"
                    rows={7}
                    maxLength={500}
                    placeholder="1、组织管理措施&#10;2、进度安排（分年度列出项目实施进度安排、主要工作内容和主要目标）"
                    value={formData.organizationMeasures}
                    onChange={(e) => updateFormData("organizationMeasures", e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {formData.organizationMeasures.length}/500
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="innovationPoints">
                    创新点 <span className="text-muted-foreground text-xs">(限300字)</span>
                  </Label>
                  <Textarea
                    id="innovationPoints"
                    rows={5}
                    maxLength={300}
                    placeholder="请在此处填写项目的创新点..."
                    value={formData.innovationPoints}
                    onChange={(e) => updateFormData("innovationPoints", e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground text-right">{formData.innovationPoints.length}/300</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicationProspects">
                    应用前景 <span className="text-muted-foreground text-xs">(限300字)</span>
                  </Label>
                  <Textarea
                    id="applicationProspects"
                    rows={5}
                    maxLength={300}
                    placeholder="请在此处填写项目的应用前景..."
                    value={formData.applicationProspects}
                    onChange={(e) => updateFormData("applicationProspects", e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {formData.applicationProspects.length}/300
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="institution" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label>
                    项目名称 <span className="text-red-500">*</span>
                  </Label>
                  <Input value={formData.name} disabled className="bg-muted" /> {/* Changed from name */}
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">一、申报单位信息</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>单位名称</Label>
                      {/* CHANGE: Use Select with loaded institutions */}
                      <Select
                        value={formData.institutionId}
                        onValueChange={handleInstitutionSelect}
                        disabled={loadingInstitutions}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingInstitutions ? "加载中..." : "请选择单位"} />
                        </SelectTrigger>
                        <SelectContent>
                          {institutions.map((inst) => (
                            <SelectItem key={inst.id} value={String(inst.id)}>
                              {inst.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>单位性质</Label>
                      <Input value={institutionInfo.nature} disabled className="bg-muted" />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label>
                        统一社会信用代码 <span className="text-red-500">*</span>
                      </Label>
                      <Input value={institutionInfo.unifiedSocialCreditCode} disabled className="bg-muted" />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label>通讯地址</Label>
                      <Input value={institutionInfo.address} disabled className="bg-muted" />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label>单位所在地</Label>
                      <Input value={institutionInfo.location} disabled className="bg-muted" />
                    </div>

                    <div className="space-y-2">
                      <Label>法人代表</Label>
                      <Input value={institutionInfo.legalRepresentative} disabled className="bg-muted" />
                    </div>

                    <div className="space-y-2">
                      <Label>联系人</Label>
                      <Input
                        placeholder="请输入联系人"
                        value={institutionInfo.contactPerson}
                        onChange={(e) => updateInstitutionInfo("contactPerson", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>联系电话</Label>
                      <Input
                        placeholder="请输入联系电话"
                        value={institutionInfo.contactNumber}
                        onChange={(e) => updateInstitutionInfo("contactNumber", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>电子邮箱</Label>
                      <Input
                        type="email"
                        placeholder="请输入电子邮箱"
                        value={institutionInfo.email}
                        onChange={(e) => updateInstitutionInfo("email", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">二、参与单位信息</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        批量删除
                      </Button>
                      <Button size="sm" onClick={addParticipatingUnit}>
                        <Plus className="h-4 w-4 mr-2" />
                        新增
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-12">
                            <Checkbox />
                          </TableHead>
                          <TableHead>序号</TableHead>
                          <TableHead>单位名称</TableHead>
                          <TableHead>单位性质</TableHead>
                          <TableHead>统一社会信用代码</TableHead>
                          <TableHead>通讯地址</TableHead>
                          <TableHead>单位所在地</TableHead>
                          <TableHead>法人代表</TableHead>
                          <TableHead>联系电话</TableHead>
                          <TableHead>手机</TableHead>
                          <TableHead>电子邮箱</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participatingUnits.map((unit, index) => (
                          <TableRow key={unit.id}>
                            <TableCell>
                              <Checkbox />
                            </TableCell>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Select
                                // Fixed Select to use institution id as value and pass index to handler
                                value={unit.id}
                                onValueChange={(v) => handleParticipatingUnitSelect(v, "", index)}
                                disabled={loadingInstitutions}
                              >
                                <SelectTrigger className="min-w-[150px]">
                                  <SelectValue
                                    placeholder={loadingInstitutions ? "加载中..." : unit.name || "选择单位"}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {institutions.map((inst) => (
                                    <SelectItem key={inst.id} value={String(inst.id)}>
                                      {inst.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input value={unit.nature} disabled className="min-w-[100px] bg-muted" />
                            </TableCell>
                            <TableCell>
                              <Input value={unit.unifiedCode} disabled className="min-w-[180px] bg-muted" />
                            </TableCell>
                            <TableCell>
                              <Input value={unit.address} disabled className="min-w-[250px] bg-muted" />
                            </TableCell>
                            <TableCell>
                              <Input value={unit.location} disabled className="min-w-[150px] bg-muted" />
                            </TableCell>
                            <TableCell>
                              <Input value={unit.legalPerson} disabled className="min-w-[100px] bg-muted" />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={unit.contactPhone}
                                onChange={(e) =>
                                  updateParticipatingUnit(Number(unit.id), "contactPhone", e.target.value)
                                }
                                placeholder="联系电话"
                                className="min-w-[120px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={unit.mobile}
                                onChange={(e) => updateParticipatingUnit(Number(unit.id), "mobile", e.target.value)}
                                placeholder="手机"
                                className="min-w-[120px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={unit.email}
                                onChange={(e) => updateParticipatingUnit(Number(unit.id), "email", e.target.value)}
                                placeholder="邮箱"
                                className="min-w-[150px]"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="link"
                                size="sm"
                                className="text-red-600"
                                onClick={() => removeParticipatingUnit(Number(unit.id))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="members" className="space-y-6 mt-6">
                <div className="space-y-2 mb-4">
                  <Label>项目名称</Label>
                  <Input value={formData.name} disabled className="bg-muted" /> {/* Changed from name */}
                </div>

                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">项目团队成员</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      批量删除
                    </Button>
                    <Button size="sm" onClick={addMember}>
                      <Plus className="h-4 w-4 mr-2" />
                      新增
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-12">
                          <Checkbox />
                        </TableHead>
                        <TableHead>序号</TableHead>
                        <TableHead>姓名</TableHead>
                        <TableHead>性别</TableHead>
                        <TableHead>出生年月</TableHead>
                        <TableHead>证件类型</TableHead>
                        <TableHead>证件号</TableHead>
                        <TableHead>民族</TableHead>
                        <TableHead>单位/职称</TableHead>
                        <TableHead>职责/职务</TableHead>
                        <TableHead>所在部门</TableHead>
                        <TableHead>学位</TableHead>
                        <TableHead>毕业院校</TableHead>
                        <TableHead>联系电话</TableHead>
                        <TableHead>手机</TableHead>
                        <TableHead>电子邮箱</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell>{member.sequence}</TableCell>
                          <TableCell>
                            <Input
                              value={member.name}
                              onChange={(e) => updateMember(member.id, "name", e.target.value)}
                              placeholder="姓名"
                              className="min-w-[80px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Select value={member.gender} onValueChange={(v) => updateMember(member.id, "gender", v)}>
                              <SelectTrigger className="min-w-[70px]">
                                <SelectValue placeholder="性别" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="男">男</SelectItem>
                                <SelectItem value="女">女</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={member.birthDate}
                              onChange={(e) => updateMember(member.id, "birthDate", e.target.value)}
                              className="min-w-[130px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Select value={member.idType} onValueChange={(v) => updateMember(member.id, "idType", v)}>
                              <SelectTrigger className="min-w-[100px]">
                                <SelectValue placeholder="证件类型" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="居民身份证">居民身份证</SelectItem>
                                <SelectItem value="护照">护照</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.idNumber}
                              onChange={(e) => updateMember(member.id, "idNumber", e.target.value)}
                              placeholder="证件号"
                              className="min-w-[180px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.nationality}
                              onChange={(e) => updateMember(member.id, "nationality", e.target.value)}
                              placeholder="民族"
                              className="min-w-[80px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.workUnit}
                              onChange={(e) => updateMember(member.id, "workUnit", e.target.value)}
                              placeholder="单位/职称"
                              className="min-w-[150px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.responsibility}
                              onChange={(e) => updateMember(member.id, "responsibility", e.target.value)}
                              placeholder="职责/职务"
                              className="min-w-[120px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.department}
                              onChange={(e) => updateMember(member.id, "department", e.target.value)}
                              placeholder="所在部门"
                              className="min-w-[120px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Select value={member.degree} onValueChange={(v) => updateMember(member.id, "degree", v)}>
                              <SelectTrigger className="min-w-[100px]">
                                <SelectValue placeholder="学位" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="学士学位">学士学位</SelectItem>
                                <SelectItem value="硕士学位">硕士学位</SelectItem>
                                <SelectItem value="博士学位">博士学位</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.graduateSchool}
                              onChange={(e) => updateMember(member.id, "graduateSchool", e.target.value)}
                              placeholder="毕业院校"
                              className="min-w-[150px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.contactPhone}
                              onChange={(e) => updateMember(member.id, "contactPhone", e.target.value)}
                              placeholder="联系电话"
                              className="min-w-[120px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.mobile}
                              onChange={(e) => updateMember(member.id, "mobile", e.target.value)}
                              placeholder="手机"
                              className="min-w-[120px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.email}
                              onChange={(e) => updateMember(member.id, "email", e.target.value)}
                              placeholder="电子邮箱"
                              className="min-w-[150px]"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1">
                              <Button variant="link" size="sm" className="text-blue-600">
                                <Edit className="h-3 w-3 mr-1" />
                                编辑
                              </Button>
                              <Button
                                variant="link"
                                size="sm"
                                className="text-red-600"
                                onClick={() => removeMember(member.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                删除
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="background" className="space-y-6 mt-6">
                <div className="space-y-2 mb-4">
                  <Label>项目名称</Label>
                  <Input value={formData.name} disabled className="bg-muted" /> {/* Changed from name */}
                </div>

                <div className="space-y-2">
                  <Label>项目负责人研究背景</Label>
                  <Textarea
                    rows={5}
                    placeholder="请描述项目负责人的研究背景..."
                    value={researchBackground}
                    onChange={(e) => setResearchBackground(e.target.value)}
                  />
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">项目负责人及团队成员承担的代表性科研项目</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        下载模板
                      </Button>
                      <Button variant="outline" size="sm">
                        导入
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除
                      </Button>
                      <Button size="sm" onClick={addRepresentativeProject}>
                        <Plus className="h-4 w-4 mr-2" />
                        新增
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-12">
                            <Checkbox />
                          </TableHead>
                          <TableHead>项目编号</TableHead>
                          <TableHead>项目名称</TableHead>
                          <TableHead>项目负责人</TableHead>
                          <TableHead>项目性质</TableHead>
                          <TableHead>项目类型</TableHead>
                          <TableHead>项目开始时间</TableHead>
                          <TableHead>项目结束时间</TableHead>
                          <TableHead>项目总费预算(万元)</TableHead>
                          <TableHead>项目简介</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {representativeProjects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell>
                              <Checkbox />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={project.projectCode}
                                onChange={(e) => updateRepresentativeProject(project.id, "projectCode", e.target.value)}
                                placeholder="请输入项目编号"
                                className="min-w-[120px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={project.name}
                                onChange={(e) => updateRepresentativeProject(project.id, "name", e.target.value)}
                                placeholder="请输入项目名称"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={project.projectLeader}
                                onChange={(e) =>
                                  updateRepresentativeProject(project.id, "projectLeader", e.target.value)
                                }
                                placeholder="请输入项目负责人"
                                className="min-w-[100px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={project.projectNature}
                                onValueChange={(v) => updateRepresentativeProject(project.id, "projectNature", v)}
                              >
                                <SelectTrigger className="min-w-[120px]">
                                  <SelectValue placeholder="项目性质" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="计划下达类">计划下达类</SelectItem>
                                  <SelectItem value="购买服务类">购买服务类</SelectItem>
                                  <SelectItem value="科研类">科研类</SelectItem>
                                  <SelectItem value="信息化类">信息化类</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={project.projectType}
                                onValueChange={(v) => updateRepresentativeProject(project.id, "projectType", v)}
                              >
                                <SelectTrigger className="min-w-[100px]">
                                  <SelectValue placeholder="项目类型" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="科技项目">科技项目</SelectItem>
                                  <SelectItem value="技术开发">技术开发</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={project.startDate}
                                onChange={(e) => updateRepresentativeProject(project.id, "startDate", e.target.value)}
                                className="min-w-[130px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={project.endDate}
                                onChange={(e) => updateRepresentativeProject(project.id, "endDate", e.target.value)}
                                className="min-w-[130px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={project.totalBudget}
                                onChange={(e) => updateRepresentativeProject(project.id, "totalBudget", e.target.value)}
                                placeholder="100,000.00"
                                className="min-w-[120px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={project.description}
                                onChange={(e) => updateRepresentativeProject(project.id, "description", e.target.value)}
                                placeholder="项目简介"
                                className="min-w-[150px]"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1">
                                <Button variant="link" size="sm" className="text-blue-600">
                                  <Edit className="h-3 w-3 mr-1" />
                                  编辑
                                </Button>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => removeRepresentativeProject(project.id)}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  删除
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                    <span>共 {representativeProjects.length} 条</span>
                    <div className="flex gap-2 items-center">
                      <Select defaultValue="10">
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10条/页</SelectItem>
                          <SelectItem value="20">20条/页</SelectItem>
                          <SelectItem value="50">50条/页</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          上一页
                        </Button>
                        <Button variant="outline" size="sm">
                          1
                        </Button>
                        <Button variant="outline" size="sm">
                          2
                        </Button>
                        <Button variant="outline" size="sm">
                          3
                        </Button>
                        <Button variant="outline" size="sm">
                          ...
                        </Button>
                        <Button variant="outline" size="sm">
                          23
                        </Button>
                        <Button variant="outline" size="sm">
                          下一页
                        </Button>
                      </div>
                      <span className="ml-2">前往</span>
                      <Input className="w-12 h-8" defaultValue="1" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">项目负责人及团队在相关方向的代表性论文或专利</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        下载模板
                      </Button>
                      <Button variant="outline" size="sm">
                        导入
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除
                      </Button>
                      <Button size="sm" onClick={addRepresentativePatent}>
                        <Plus className="h-4 w-4 mr-2" />
                        新增
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-12">
                            <Checkbox />
                          </TableHead>
                          <TableHead>发表时间</TableHead>
                          <TableHead>著作名称</TableHead>
                          <TableHead>出版杂志名称</TableHead>
                          <TableHead>作者排名</TableHead>
                          <TableHead>备注</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {representativePatents.map((patent) => (
                          <TableRow key={patent.id}>
                            <TableCell>
                              <Checkbox />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="date"
                                value={patent.publishDate}
                                onChange={(e) => updateRepresentativePatent(patent.id, "publishDate", e.target.value)}
                                className="min-w-[130px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={patent.authorName}
                                onChange={(e) => updateRepresentativePatent(patent.id, "authorName", e.target.value)}
                                placeholder="请输入著作名称"
                                className="min-w-[200px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={patent.publicationName}
                                onChange={(e) =>
                                  updateRepresentativePatent(patent.id, "publicationName", e.target.value)
                                }
                                placeholder="请输入出版杂志名称"
                                className="min-w-[150px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={patent.authorRank}
                                onChange={(e) => updateRepresentativePatent(patent.id, "authorRank", e.target.value)}
                                placeholder="1"
                                className="min-w-[80px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={patent.note}
                                onChange={(e) => updateRepresentativePatent(patent.id, "note", e.target.value)}
                                placeholder="备注说明"
                                className="min-w-[120px]"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1">
                                <Button variant="link" size="sm" className="text-blue-600">
                                  <Edit className="h-3 w-3 mr-1" />
                                  编辑
                                </Button>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => removeRepresentativePatent(patent.id)}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  删除
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                    <span>共 {representativePatents.length} 条</span>
                    <div className="flex gap-2 items-center">
                      <Select defaultValue="10">
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10条/页</SelectItem>
                          <SelectItem value="20">20条/页</SelectItem>
                          <SelectItem value="50">50条/页</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          上一页
                        </Button>
                        <Button variant="outline" size="sm">
                          1
                        </Button>
                        <Button variant="outline" size="sm">
                          2
                        </Button>
                        <Button variant="outline" size="sm">
                          3
                        </Button>
                        <Button variant="outline" size="sm">
                          ...
                        </Button>
                        <Button variant="outline" size="sm">
                          23
                        </Button>
                        <Button variant="outline" size="sm">
                          下一页
                        </Button>
                      </div>
                      <span className="ml-2">前往</span>
                      <Input className="w-12 h-8" defaultValue="1" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="implementation" className="space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">实施进度安排</h3>
                  <Button onClick={addImplementationPhase} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    添加节点
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">实施阶段</TableHead>
                        <TableHead>研究内容</TableHead>
                        <TableHead>考核指标/成果</TableHead>
                        <TableHead className="w-[180px]">完成时间</TableHead>
                        <TableHead className="w-[80px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {implementationPlan.map((phase, index) => (
                        <TableRow key={phase.id}>
                          <TableCell>
                            <Input
                              placeholder="第一年"
                              value={phase.phase}
                              onChange={(e) => updateImplementationPhase(phase.id, "phase", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Textarea
                              rows={2}
                              placeholder="研究内容"
                              value={phase.researchContent}
                              onChange={(e) => updateImplementationPhase(phase.id, "researchContent", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Textarea
                              rows={2}
                              placeholder="考核指标"
                              value={phase.deliverables}
                              onChange={(e) => updateImplementationPhase(phase.id, "deliverables", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={phase.endMonth}
                              onChange={(e) => updateImplementationPhase(phase.id, "endMonth", e.target.value)}
                              className="min-w-[130px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeImplementationPhase(phase.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="paperTarget">论文数量目标</Label>
                    <Input
                      id="paperTarget"
                      type="number"
                      placeholder="预计发表论文数量"
                      value={performanceIndicators.paperTarget || ""}
                      onChange={(e) => updatePerformanceIndicator("paperTarget", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patentTarget">专利数量目标</Label>
                    <Input
                      id="patentTarget"
                      type="number"
                      placeholder="预计申请专利数量"
                      value={performanceIndicators.patentTarget || ""}
                      onChange={(e) => updatePerformanceIndicator("patentTarget", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="softwareTarget">软件著作权目标</Label>
                    <Input
                      id="softwareTarget"
                      type="number"
                      placeholder="预计获得软著数量"
                      value={performanceIndicators.softwareTarget || ""}
                      onChange={(e) => updatePerformanceIndicator("softwareTarget", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="standardTarget">技术标准目标</Label>
                    <Input
                      id="standardTarget"
                      type="number"
                      placeholder="预计制定标准数量"
                      value={performanceIndicators.standardTarget || ""}
                      onChange={(e) => updatePerformanceIndicator("standardTarget", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialBenefit">社会经济效益</Label>
                  <Textarea
                    id="socialBenefit"
                    rows={4}
                    placeholder="请描述项目实施后预期产生的社会经济效益..."
                    value={performanceIndicators.socialBenefit || ""}
                    onChange={(e) => updatePerformanceIndicator("socialBenefit", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transformationPlan">成果转化计划</Label>
                  <Textarea
                    id="transformationPlan"
                    rows={4}
                    placeholder="请描述项目成果的转化应用计划..."
                    value={performanceIndicators.transformationPlan || ""}
                    onChange={(e) => updatePerformanceIndicator("transformationPlan", e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="budget" className="space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">预算明细</h3>
                  <Button onClick={addBudgetItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    添加预算项
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>预算科目</TableHead>
                      <TableHead>明细</TableHead>
                      <TableHead>金额（元）</TableHead>
                      <TableHead>说明</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select value={item.category} onValueChange={(v) => updateBudgetItem(item.id, "category", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择科目" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="设备费">设备费</SelectItem>
                              <SelectItem value="材料费">材料费</SelectItem>
                              <SelectItem value="差旅费">差旅费</SelectItem>
                              <SelectItem value="会议费">会议费</SelectItem>
                              <SelectItem value="劳务费">劳务费</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.subcategory}
                            onChange={(e) => updateBudgetItem(item.id, "subcategory", e.target.value)}
                            placeholder="明细项"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.amount}
                            onChange={(e) => updateBudgetItem(item.id, "amount", Number.parseFloat(e.target.value))}
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateBudgetItem(item.id, "description", e.target.value)}
                            placeholder="说明"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBudgetItem(item.id)}
                            disabled={budgetItems.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end items-center gap-4 pt-4 border-t">
                  <span className="text-lg font-semibold">总预算：</span>
                  <span className="text-2xl font-bold text-primary">{totalBudget.toLocaleString()} 元</span>
                </div>
              </TabsContent>

              <TabsContent value="attachments" className="space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">其它附件</h3>
                  <div className="flex gap-2">
                    <Button onClick={addAttachment} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      添加附件
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-12">
                          <Checkbox />
                        </TableHead>
                        <TableHead>附件名称</TableHead>
                        <TableHead>文件名称</TableHead>
                        <TableHead>文件类型</TableHead>
                        <TableHead>文件大小</TableHead>
                        <TableHead>上传时间</TableHead>
                        <TableHead>说明</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attachments.map((attachment) => (
                        <TableRow key={attachment.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell>
                            <div className="min-w-[150px]">附件{attachments.indexOf(attachment) + 1}</div>
                          </TableCell>
                          <TableCell>
                            <div className="min-w-[150px]">{attachment.name || "-"}</div>
                          </TableCell>
                          <TableCell>
                            <div className="min-w-[100px]">{attachment.type || "-"}</div>
                          </TableCell>
                          <TableCell>
                            <div className="min-w-[100px]">{attachment.size || "-"}</div>
                          </TableCell>
                          <TableCell>
                            <div className="min-w-[160px]">{attachment.uploadDate || "-"}</div>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={attachment.description}
                              onChange={(e) => updateAttachment(attachment.id, "description", e.target.value)}
                              placeholder="请输入说明"
                              className="min-w-[150px]"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1">
                              <label htmlFor={`file-upload-${attachment.id}`}>
                                <Button variant="link" size="sm" className="text-blue-600" asChild>
                                  <span>
                                    <Upload className="h-3 w-3 mr-1" />
                                    上传
                                  </span>
                                </Button>
                              </label>
                              <input
                                id={`file-upload-${attachment.id}`}
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileUpload(attachment.id, e)}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                              />
                              {attachment.name && (
                                <Button variant="link" size="sm" className="text-green-600">
                                  <FileText className="h-3 w-3 mr-1" />
                                  预览
                                </Button>
                              )}
                              <Button
                                variant="link"
                                size="sm"
                                className="text-red-600"
                                onClick={() => removeAttachment(attachment.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                删除
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">附件上传说明：</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 支持的文件格式：PDF、Word、Excel、图片（JPG/PNG）</li>
                    <li>• 单个文件大小不超过20MB</li>
                    <li>• 必须上传的附件：承诺书、推荐书、查重报告</li>
                    <li>• 其他材料可根据项目实际情况选择性上传</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="border-t bg-muted/20 px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {isEditMode ? "修改项目信息后，请重新提交审核" : "请完整填写所有必填项后提交"}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSaveDraft} disabled={savingDraft || submitting}>
                {savingDraft ? "保存中..." : "保存草稿"}
              </Button>
              <Button onClick={handleSubmit} disabled={savingDraft || submitting}>
                {submitting ? "提交中..." : isEditMode ? "更新提交" : "提交申报"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
