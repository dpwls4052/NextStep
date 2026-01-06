import { Button } from '@/shared/ui'
import { CustomNodeType } from '../model/types'
import { useState } from 'react'
import { formatKoreaTime } from '@/shared/libs/formatKoreaTime'
import { MemoForm } from '@/features/roadmap/postNodeMemo/ui'
import { LinkForm } from '@/features/roadmap/postNodeLink/ui'
import { TroubleshootingForm } from '@/features/roadmap/postNodeTroubleshooting/ui'
import { useWorkspaceStore } from '../model'
import { DeleteNodeLinkButton } from '@/features/roadmap/deleteNodeLink/ui'
import DeleteNodeTroubleshootingButton from '@/features/roadmap/deleteNodeTroubleshooting/ui/DeleteNodeLinkButton'
import { useSession } from 'next-auth/react'
import useTechRecommendation, {
  TechItem,
} from '@/features/ai/model/useTechRecommendation'
import TechRecommendationList from '@/features/tech/ui/TechRecommendationList'
import useAddChildNode from '../model/useAddChildNode'
import { Check } from '@/shared/ui/icon'

interface NodeInformationProps {
  selectedNode: CustomNodeType
  handleEditTech: () => void
  handleUpdateNode: (techItem: TechItem) => void
}

const NodeInformationMenu = [
  { key: 'memo', label: '메모', color: 'bg-blue-500' },
  { key: 'link', label: '자료', color: 'bg-green-500' },
  { key: 'troubleshooting', label: '트러블슈팅', color: 'bg-red-500' },
]

const NodeInformation = ({
  selectedNode,
  handleEditTech,
  handleUpdateNode,
}: NodeInformationProps) => {
  const { status } = useSession()
  const isLogin = status === 'authenticated'
  const [mode, setMode] = useState<string>(NodeInformationMenu[0].key)
  const setNodeCompleted = useWorkspaceStore((s) => s.setNodeCompleted)
  const getNodeCompleted = useWorkspaceStore((s) => s.getNodeCompleted)
  const completed = getNodeCompleted(selectedNode.data.techId)
  const getNodeLinks = useWorkspaceStore((s) => s.getNodeLinks)
  const getNodeTroubleshootings = useWorkspaceStore(
    (s) => s.getNodeTroubleshootings
  )
  const { setNodes, setSelectedNode } = useWorkspaceStore()

  const [isLinkFormOpen, setIsLinkFormOpen] = useState<boolean>(false)
  const links = getNodeLinks(selectedNode.data.techId)

  const [isTroubleshootingFormOpen, setIsTroubleshootingFormOpen] =
    useState<boolean>(false)
  const troubleshootings = getNodeTroubleshootings(selectedNode.data.techId)

  const [isRecommendMode, setIsRecommendMode] = useState<boolean>(false)

  // 자식 노드 추가 훅
  const { addChildNode, resetCounter } = useAddChildNode(selectedNode)

  const {
    recommendationData,
    recommendationIsLoading,
    recommendationError,
    fetchRecommendations,
  } = useTechRecommendation()

  const handleRecommendClick = () => {
    const techName = selectedNode.data.label
    if (!techName) return
    setIsRecommendMode(true)
    resetCounter() // 추천 모드 진입 시 카운터 초기화
    fetchRecommendations(techName)
  }

  const handleBackToMenu = () => {
    setIsRecommendMode(false)
  }

  const handleNewTech = (item: any) => {
    const techName = item.name
    if (!techName) return
    fetchRecommendations(techName)
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="px-10 pt-10"></div>
      <div className="flex items-center justify-between px-10 py-10">
        <div className="mb-10 flex w-full items-center justify-between gap-15">
          <div className="flex items-center gap-10">
            <img
              src={selectedNode.data.iconUrl}
              alt={selectedNode.data.label || ''}
              className="h-30 w-30 object-cover"
            />
            <p className="text-20 line-clamp-2 max-w-full break-all">
              {selectedNode.data.label}
            </p>
          </div>

          {completed ? (
            <Button
              variant="none"
              className="bg-green-500 px-10 py-4 text-white"
              onClick={() => setNodeCompleted(selectedNode.data.techId, false)}
            >
              <Check className="stroke-white" />
              <span className="pl-5">학습 완료</span>
            </Button>
          ) : (
            <Button
              variant="none"
              className="rounded-sm bg-white/50 px-10 py-4"
              onClick={() => setNodeCompleted(selectedNode.data.techId, true)}
            >
              학습 미완료
            </Button>
          )}
        </div>
      </div>

      <div className="mx-15 flex justify-center gap-10">
        {!isRecommendMode && (
          <>
            <Button
              className="w-1/2 shrink-0 px-15 py-2"
              onClick={handleEditTech}
            >
              변경
            </Button>
            <Button
              className="point-gradient w-1/2 px-15 py-10 text-white"
              onClick={handleRecommendClick}
            >
              하위 노드 추천받기
            </Button>
          </>
        )}
      </div>

      {isRecommendMode ? (
        <div className="h-full overflow-y-auto p-10">
          <Button
            variant="secondary"
            className="mb-10 w-full py-10"
            onClick={handleBackToMenu}
          >
            ← 돌아가기
          </Button>

          <h3 className="text-foreground mb-10 font-semibold">
            💡 &apos;{selectedNode.data.label}&apos;와 시너지가 좋은 기술
          </h3>

          {recommendationError && (
            <div className="rounded-lg bg-red-50 p-12 text-red-600">
              추천 에러 발생: {recommendationError}
            </div>
          )}

          <TechRecommendationList
            data={recommendationData?.data ?? []}
            isLoading={recommendationIsLoading}
            source={
              recommendationData?.source === 'ai_recommendation'
                ? 'ai'
                : undefined
            }
            onComplete={() => {}}
            handleUpdateNode={handleUpdateNode}
            onNew={handleNewTech}
            onAddNode={addChildNode}
            mode="add"
          />
        </div>
      ) : (
        <>
          <div className="border-b-secondary border-b">
            <ul className="flex">
              {NodeInformationMenu.map((item) => (
                <li
                  key={item.key}
                  className={`text-14 box-content flex h-50 w-full items-center justify-center text-center ${item.key === mode && 'border-b-accent text-accent border-b-2 font-bold'} gap-5 hover:cursor-pointer`}
                  onClick={() => setMode(item.key)}
                >
                  <span className={`h-5 w-5 rounded-full ${item.color}`}></span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {isLogin ? (
            <div className="h-full overflow-y-auto p-10">
              {mode === 'memo' && (
                <MemoForm techId={selectedNode.data.techId} />
              )}

              {mode === 'link' && (
                <>
                  {!isLinkFormOpen ? (
                    <Button
                      variant="accent"
                      className="w-full py-10"
                      onClick={() => setIsLinkFormOpen(true)}
                    >
                      추가하기
                    </Button>
                  ) : (
                    <LinkForm
                      techId={selectedNode.data.techId}
                      handleCloseForm={() => setIsLinkFormOpen(false)}
                      links={links}
                    />
                  )}
                  {links.length > 0 && (
                    <ul className="mt-10 flex flex-col gap-10">
                      {links.map((link) => (
                        <li
                          key={link.nodeLinkId}
                          className="bg-secondary group flex justify-between gap-10 rounded-md p-10"
                        >
                          <div>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent break-all underline hover:cursor-pointer"
                            >
                              {link.title}
                            </a>
                            <p className="text-12 text-foreground-light">
                              {link.url}
                            </p>
                          </div>
                          <DeleteNodeLinkButton
                            techId={selectedNode.data.techId}
                            nodeLinkId={link.nodeLinkId}
                            links={links}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {mode === 'troubleshooting' && (
                <>
                  {!isTroubleshootingFormOpen ? (
                    <>
                      <Button
                        variant="accent"
                        className="w-full py-10"
                        onClick={() => setIsTroubleshootingFormOpen(true)}
                      >
                        추가하기
                      </Button>
                      <ul className="mt-10 flex flex-col gap-10">
                        {troubleshootings.map((item) => (
                          <li
                            key={item.nodeTroubleshootingId}
                            className="bg-secondary group flex justify-between gap-10 rounded-md p-10"
                          >
                            <div>
                              <p className="text-12 mb-5">
                                {formatKoreaTime(item.createdAt, 'date')}
                              </p>
                              <div>{item.troubleshooting}</div>
                            </div>
                            <DeleteNodeTroubleshootingButton
                              techId={selectedNode.data.techId}
                              nodeTroubleshootingId={item.nodeTroubleshootingId}
                              troubleshootings={troubleshootings}
                            />
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <TroubleshootingForm
                      techId={selectedNode.data.techId}
                      handleCloseForm={() =>
                        setIsTroubleshootingFormOpen(false)
                      }
                      troubleshootings={troubleshootings}
                    />
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p>로그인이 필요합니다.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default NodeInformation
