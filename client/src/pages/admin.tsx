import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, LogOut, Image, Settings, MessageSquare } from 'lucide-react'
import ProductGallery from '@/components/admin/ProductGallery'
import QnAList from '@/components/admin/QnAList'
import QnADetail from '@/components/admin/QnADetail'
import { type QnaSubmission } from '@shared/schema'

export default function AdminDashboard() {
  const { user, isAdmin, loading, signOut } = useAdminAuth()
  const [selectedQuestion, setSelectedQuestion] = useState<QnaSubmission | null>(null)

  useEffect(() => {
    if (!loading && !isAdmin) {
      // Admin이 아니면 로그인 페이지로 리다이렉트
      window.location.href = '/admin-login'
    }
  }, [loading, isAdmin])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/admin-login'
  }

  const handleSelectQuestion = (question: QnaSubmission) => {
    setSelectedQuestion(question)
  }

  const handleBackToList = () => {
    setSelectedQuestion(null)
  }

  const handleAnswerSubmitted = () => {
    setSelectedQuestion(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin 대시보드</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>로그아웃</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Tabs defaultValue="gallery" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="gallery" className="flex items-center space-x-2">
                <Image className="h-4 w-4" />
                <span>Product Gallery</span>
              </TabsTrigger>
              <TabsTrigger value="qna" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Q&A Management</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>설정</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Product Gallery 관리</h2>
                <p className="mt-1 text-sm text-gray-500">
                  제품 이미지를 등록, 수정, 삭제할 수 있습니다.
                </p>
              </div>
              <ProductGallery />
            </TabsContent>

            <TabsContent value="qna" className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Q&A Management</h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and respond to customer inquiries.
                </p>
              </div>
              {selectedQuestion ? (
                <QnADetail
                  question={selectedQuestion}
                  onBack={handleBackToList}
                  onAnswerSubmitted={handleAnswerSubmitted}
                />
              ) : (
                <QnAList onSelectQuestion={handleSelectQuestion} />
              )}
            </TabsContent>



            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>계정 설정</CardTitle>
                  <CardDescription>
                    관리자 계정 정보를 확인할 수 있습니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">이메일</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">계정 생성일</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : 'N/A'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
