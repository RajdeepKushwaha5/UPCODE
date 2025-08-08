'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

export default function SplitViewLayout({ 
  leftPanel, 
  rightPanel, 
  leftPanelWidth = 50, 
  onPanelResize,
  minLeftWidth = 250,
  minRightWidth = 250,
  isMobile = false,
  activeTab = 'problem',
  onTabChange
}) {
  const containerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startLeftWidth, setStartLeftWidth] = useState(leftPanelWidth)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Convert percentage to pixels and vice versa
  const getContainerWidth = () => containerRef.current?.offsetWidth || 1000
  
  const percentageToPixels = (percentage) => {
    return (percentage / 100) * getContainerWidth()
  }
  
  const pixelsToPercentage = (pixels) => {
    return (pixels / getContainerWidth()) * 100
  }

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
    setStartX(e.clientX)
    setStartLeftWidth(leftPanelWidth)
    
    // Add cursor style to body
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [leftPanelWidth])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return

    const deltaX = e.clientX - startX
    const containerWidth = getContainerWidth()
    const deltaPercentage = (deltaX / containerWidth) * 100
    
    let newLeftWidth = startLeftWidth + deltaPercentage
    
    // Enforce minimum widths
    const minLeftPercentage = pixelsToPercentage(minLeftWidth)
    const minRightPercentage = pixelsToPercentage(minRightWidth)
    
    newLeftWidth = Math.max(minLeftPercentage, newLeftWidth)
    newLeftWidth = Math.min(100 - minRightPercentage, newLeftWidth)
    
    onPanelResize?.(newLeftWidth)
  }, [isDragging, startX, startLeftWidth, minLeftWidth, minRightWidth, onPanelResize])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    
    // Remove cursor style from body
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  // Attach global mouse events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Re-validate panel widths on window resize
      const minLeftPercentage = pixelsToPercentage(minLeftWidth)
      const minRightPercentage = pixelsToPercentage(minRightWidth)
      
      let newLeftWidth = leftPanelWidth
      newLeftWidth = Math.max(minLeftPercentage, newLeftWidth)
      newLeftWidth = Math.min(100 - minRightPercentage, newLeftWidth)
      
      if (newLeftWidth !== leftPanelWidth) {
        onPanelResize?.(newLeftWidth)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [leftPanelWidth, minLeftWidth, minRightWidth, onPanelResize])

  return (
    <div 
      ref={containerRef}
      className="flex h-[calc(100vh-64px)] relative"
    >
      {/* Left Panel */}
      <div 
        className="bg-gray-900 border-r border-gray-700 overflow-hidden flex flex-col"
        style={{ width: `${leftPanelWidth}%` }}
      >
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        className={`w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors duration-150 relative group ${
          isDragging ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* Resize handle indicator */}
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
        </div>
        
        {/* Active drag indicator */}
        {isDragging && (
          <div className="absolute inset-y-0 -left-2 -right-2 bg-blue-500/20 pointer-events-none"></div>
        )}
      </div>

      {/* Right Panel */}
      <div 
        className="bg-gray-900 overflow-hidden flex flex-col"
        style={{ width: `${100 - leftPanelWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  )

  // Mobile Tab Layout
  if (isMobile && isClient) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-900">
        {/* Mobile Tab Navigation */}
        <div className="flex border-b border-gray-700 bg-gray-800">
          <button
            onClick={() => onTabChange?.('problem')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'problem'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Problem
          </button>
          <button
            onClick={() => onTabChange?.('code')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'code'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Code Editor
          </button>
        </div>

        {/* Mobile Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'problem' ? leftPanel : rightPanel}
        </div>
      </div>
    )
  }

  // Desktop Split View Layout
  return (
    <div 
      ref={containerRef}
      className="flex h-[calc(100vh-64px)] relative"
    >
      {/* Left Panel */}
      <div 
        className="bg-gray-900 border-r border-gray-700 overflow-hidden flex flex-col"
        style={{ width: `${leftPanelWidth}%` }}
      >
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        className={`w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors duration-150 relative group ${
          isDragging ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* Resize handle indicator */}
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
        </div>
        
        {/* Active drag indicator */}
        {isDragging && (
          <div className="absolute inset-y-0 -left-2 -right-2 bg-blue-500/20 pointer-events-none"></div>
        )}
      </div>

      {/* Right Panel */}
      <div 
        className="bg-gray-900 overflow-hidden flex flex-col"
        style={{ width: `${100 - leftPanelWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  )
}
