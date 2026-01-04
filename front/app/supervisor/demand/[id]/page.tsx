"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function DemandDetailPage() {
  const router = useRouter()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">需求详情</h1>
          <p className="text-sm text-muted-foreground">查看需求详细信息</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Section 1: 需求提出单位 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">一、需求提出单位</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>单位名称:</Label>
                <Input value="湖南省第三测绘院" readOnly />
              </div>
              <div className="space-y-2">
                <Label>所在市州（县市区）:</Label>
                <Input value="长沙市天心区" readOnly />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>联系人姓名:</Label>
                <Input value="胡歆" readOnly />
              </div>
              <div className="space-y-2">
                <Label>联系人电话:</Label>
                <Input value="13111929202" readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label>联系人身份证号:</Label>
              <Input value="430625199203112931" readOnly className="max-w-md" />
            </div>
          </div>

          {/* Section 2: 需求项体信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">二、需求项体信息</h3>

            <div className="space-y-2">
              <Label>需求名称:</Label>
              <Input placeholder="请输入名称" readOnly />
            </div>

            <div className="space-y-2">
              <Label>所属领域:</Label>
              <div className="flex gap-6 flex-wrap">
                {["工业技术", "工业技术", "工业技术", "工业技术", "工业技术", "工业技术", "工业技术", "工业技术"].map(
                  (item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox id={`domain-${idx}`} disabled />
                      <label htmlFor={`domain-${idx}`} className="text-sm">
                        {item}
                      </label>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>预期水平:</Label>
              <RadioGroup value="国际领先" disabled>
                <div className="flex gap-6 flex-wrap">
                  {["国际领先", "国际先进", "国内领先", "国内先进", "其他"].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <RadioGroupItem value={item} id={`level-${item}`} />
                      <Label htmlFor={`level-${item}`}>{item}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-center">技术成熟度等级</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>当前等级</Label>
                  <Input readOnly />
                </div>
                <div className="space-y-2">
                  <Label>攻关后等级</Label>
                  <Input readOnly />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>攻关类型（可多选）:</Label>
              <div className="flex gap-6 flex-wrap">
                {["卡脖子技术", "增补国内空白技术", "国产化替代", "前沿颠覆性技术", "关键共性技术", "其他"].map(
                  (item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={`type-${item}`} disabled />
                      <label htmlFor={`type-${item}`} className="text-sm">
                        {item}
                      </label>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-center">预期研发投入</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>总投资:</Label>
                  <div className="flex items-center gap-2">
                    <Input value="200.00" readOnly />
                    <span className="text-sm">万元</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>建议财政支持经费:</Label>
                  <div className="flex items-center gap-2">
                    <Input value="200.00" readOnly />
                    <span className="text-sm">万元</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>建议项目类型:</Label>
              <RadioGroup disabled>
                <div className="flex gap-6 flex-wrap">
                  {["重大项目", "一般项目", "重点项目", "一般项目", "其他"].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <RadioGroupItem value={item} id={`proj-type-${item}`} />
                      <Label htmlFor={`proj-type-${item}`}>{item}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>攻关时限:</Label>
              <RadioGroup disabled>
                <div className="flex gap-6">
                  {["1年", "2年", "3年"].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <RadioGroupItem value={item} id={`duration-${item}`} />
                      <Label htmlFor={`duration-${item}`}>{item}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Question sections */}
            <div className="space-y-2">
              <Label>1、研究背景和攻关目的。意义（简要说明研究背景、组织该项科技攻关的必要性和意义，限800字</Label>
              <Textarea rows={4} readOnly />
            </div>

            <div className="space-y-2">
              <Label>2、拟解决的关键科技问题、技术指标及可行性，限800字</Label>
              <Textarea rows={4} readOnly />
            </div>

            <div className="space-y-2">
              <Label>
                3、预期成果及水平，明确预期科技攻关思路和不少于5项的技术指标参数，成果需量化，作为项目结题考核指标，限500字
              </Label>
              <Textarea rows={4} readOnly />
            </div>

            <div className="space-y-2">
              <Label>4、预期效益。（简述关键该项技术在经济、社会、生态等方面的效益，限300字</Label>
              <Textarea rows={4} readOnly />
            </div>

            <div className="space-y-2">
              <Label>5、技术指标对标分析（技术指标包括以上主要量化技术指标，限300字)</Label>
              <Textarea rows={4} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          返回
        </Button>
      </div>
    </div>
  )
}
