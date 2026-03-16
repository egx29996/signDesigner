import React from 'react';
import { Header } from './Header';
import { BottomBar } from './BottomBar';

interface DesignerShellProps {
  leftSidebar: React.ReactNode;
  canvas: React.ReactNode;
  rightSidebar: React.ReactNode;
}

export const DesignerShell: React.FC<DesignerShellProps> = ({
  leftSidebar,
  canvas,
  rightSidebar,
}) => {
  return (
    <div className="flex flex-col h-full">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-[280px] min-w-[280px] bg-surface-elevated border-r border-border overflow-y-auto p-4">
          {leftSidebar}
        </aside>

        {/* Center: canvas + bottom bar */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            {canvas}
          </div>
          <BottomBar />
        </div>

        {/* Right sidebar */}
        <aside className="w-[220px] min-w-[220px] bg-surface-elevated border-l border-border overflow-y-auto p-3">
          {rightSidebar}
        </aside>
      </div>
    </div>
  );
};
