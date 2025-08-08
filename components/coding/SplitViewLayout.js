'use client'
import { useState, useRef, useEffect } from 'react'

export default function SplitViewLayout({ 
  leftPanel, 
  rightPanel, 
  initialSplit = 50,
  minLeftWidth = 300,
  minRightWidth = 400 
}) {
  const [splitPercentage, setSplitPercentage] = useState(initialSplit)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const containerRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseDown = () => {
    if (!isMobile) {
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current || isMobile) return

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const containerWidth = containerRect.width
    const mouseX = e.clientX - containerRect.left
    
    const newSplitPercentage = (mouseX / containerWidth) * 100
    
    // Enforce minimum widths
    const minLeftPercentage = (minLeftWidth / containerWidth) * 100
    const minRightPercentage = (minRightWidth / containerWidth) * 100
    
    if (newSplitPercentage >= minLeftPercentage && 
        newSplitPercentage <= (100 - minRightPercentage)) {
      setSplitPercentage(newSplitPercentage)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging])

  if (isMobile) {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        {/* Mobile Tab Navigation */}
        <div className="flex bg-gray-800 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'description'
                ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Problem
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'editor'
                ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Code
          </button>
        </div>

        {/* Mobile Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'description' ? leftPanel : rightPanel}
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="h-full flex bg-gray-900 select-none"
    >
      {/* Left Panel */}
      <div 
        className="overflow-hidden bg-gray-900 border-r border-gray-700"
        style={{ width: `${splitPercentage}%` }}
      >
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors relative group"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -inset-x-1 group-hover:bg-blue-500/20" />
      </div>

      {/* Right Panel */}
      <div 
        className="overflow-hidden bg-gray-900"
        style={{ width: `${100 - splitPercentage}%` }}
      >
        {rightPanel}
      </div>
    </div>
  )
}
