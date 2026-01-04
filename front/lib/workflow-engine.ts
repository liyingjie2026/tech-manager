// Workflow Engine Core

export interface WorkflowNode {
  id: string
  type: "start" | "approval" | "condition" | "notification" | "end"
  name: string
  roles: string[]
  buttons: string[]
  condition?: string
  nextNodes: string[]
}

export interface WorkflowDefinition {
  id: string
  code: string
  name: string
  version: string
  nodes: WorkflowNode[]
  status: "active" | "inactive"
}

export interface WorkflowInstance {
  id: string
  workflowId: string
  businessId: string
  businessType: string
  currentNodeId: string
  status: "running" | "completed" | "rejected" | "cancelled"
  variables: Record<string, any>
  history: WorkflowHistory[]
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowHistory {
  id: string
  nodeId: string
  nodeName: string
  action: string
  operator: string
  operatorName: string
  comment?: string
  createdAt: Date
}

export class WorkflowEngine {
  // Start a new workflow instance
  static async startWorkflow(
    workflowId: string,
    businessId: string,
    businessType: string,
    initiator: string,
  ): Promise<WorkflowInstance> {
    // Implementation: Create workflow instance
    const workflow = await this.getWorkflowDefinition(workflowId)
    const startNode = workflow.nodes.find((n) => n.type === "start")

    if (!startNode) {
      throw new Error("Workflow must have a start node")
    }

    const instance: WorkflowInstance = {
      id: this.generateId(),
      workflowId,
      businessId,
      businessType,
      currentNodeId: startNode.id,
      status: "running",
      variables: {},
      history: [
        {
          id: this.generateId(),
          nodeId: startNode.id,
          nodeName: startNode.name,
          action: "start",
          operator: initiator,
          operatorName: initiator,
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to database
    return instance
  }

  // Process workflow action
  static async processAction(
    instanceId: string,
    action: "approve" | "reject" | "return",
    operator: string,
    comment?: string,
  ): Promise<WorkflowInstance> {
    // Implementation: Process workflow action
    const instance = await this.getWorkflowInstance(instanceId)
    const workflow = await this.getWorkflowDefinition(instance.workflowId)
    const currentNode = workflow.nodes.find((n) => n.id === instance.currentNodeId)

    if (!currentNode) {
      throw new Error("Current node not found")
    }

    // Add to history
    instance.history.push({
      id: this.generateId(),
      nodeId: currentNode.id,
      nodeName: currentNode.name,
      action,
      operator,
      operatorName: operator,
      comment,
      createdAt: new Date(),
    })

    // Determine next node
    if (action === "approve" && currentNode.nextNodes.length > 0) {
      const nextNodeId = currentNode.nextNodes[0]
      const nextNode = workflow.nodes.find((n) => n.id === nextNodeId)

      if (nextNode?.type === "end") {
        instance.status = "completed"
      } else {
        instance.currentNodeId = nextNodeId
      }
    } else if (action === "reject") {
      instance.status = "rejected"
    }

    instance.updatedAt = new Date()

    // Save to database
    return instance
  }

  // Check if user has permission for current node
  static async checkPermission(instanceId: string, userId: string, roleIds: string[]): Promise<boolean> {
    const instance = await this.getWorkflowInstance(instanceId)
    const workflow = await this.getWorkflowDefinition(instance.workflowId)
    const currentNode = workflow.nodes.find((n) => n.id === instance.currentNodeId)

    if (!currentNode) return false

    // Check if user's role matches node's allowed roles
    return currentNode.roles.some((role) => roleIds.includes(role))
  }

  // Get available buttons for current node
  static async getAvailableButtons(instanceId: string, userId: string): Promise<string[]> {
    const instance = await this.getWorkflowInstance(instanceId)
    const workflow = await this.getWorkflowDefinition(instance.workflowId)
    const currentNode = workflow.nodes.find((n) => n.id === instance.currentNodeId)

    if (!currentNode) return []

    return currentNode.buttons
  }

  // Helper methods
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private static async getWorkflowDefinition(workflowId: string): Promise<WorkflowDefinition> {
    // TODO: Fetch from database
    throw new Error("Not implemented")
  }

  private static async getWorkflowInstance(instanceId: string): Promise<WorkflowInstance> {
    // TODO: Fetch from database
    throw new Error("Not implemented")
  }
}
