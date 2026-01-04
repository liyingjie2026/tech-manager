"use client"

import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, CheckCircle, XCircle, FileText, Send, Download } from "lucide-react"

interface ActionButtonsProps {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onApprove?: () => void
  onReject?: () => void
  onSubmit?: () => void
  onDownload?: () => void
  onDetail?: () => void
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showApprove?: boolean
  showReject?: boolean
  showSubmit?: boolean
  showDownload?: boolean
  showDetail?: boolean
}

export function ActionButtons({
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onSubmit,
  onDownload,
  onDetail,
  showView = false,
  showEdit = false,
  showDelete = false,
  showApprove = false,
  showReject = false,
  showSubmit = false,
  showDownload = false,
  showDetail = false,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      {showView && onView && (
        <Button variant="ghost" size="sm" onClick={onView}>
          <Eye className="h-4 w-4 mr-1" />
          查看
        </Button>
      )}
      {showDetail && onDetail && (
        <Button variant="ghost" size="sm" onClick={onDetail}>
          <FileText className="h-4 w-4 mr-1" />
          详情
        </Button>
      )}
      {showEdit && onEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" />
          编辑
        </Button>
      )}
      {showSubmit && onSubmit && (
        <Button variant="ghost" size="sm" onClick={onSubmit}>
          <Send className="h-4 w-4 mr-1" />
          提交
        </Button>
      )}
      {showApprove && onApprove && (
        <Button variant="ghost" size="sm" onClick={onApprove}>
          <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
          通过
        </Button>
      )}
      {showReject && onReject && (
        <Button variant="ghost" size="sm" onClick={onReject}>
          <XCircle className="h-4 w-4 mr-1 text-red-600" />
          拒绝
        </Button>
      )}
      {showDownload && onDownload && (
        <Button variant="ghost" size="sm" onClick={onDownload}>
          <Download className="h-4 w-4 mr-1" />
          下载
        </Button>
      )}
      {showDelete && onDelete && (
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1 text-red-600" />
          删除
        </Button>
      )}
    </div>
  )
}
