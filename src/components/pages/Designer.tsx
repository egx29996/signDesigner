import React from 'react';
import { DesignerShell } from '../layout/DesignerShell';
import { CanvasArea } from '../canvas/CanvasArea';
import { TokenPanel } from '../controls/TokenPanel';
import { TokenSummary } from '../summary/TokenSummary';
import { ADAStatus } from '../summary/ADAStatus';
import { ConstructionSummary } from '../summary/ConstructionSummary';
import { QuantityEditor } from '../summary/QuantityEditor';

export const Designer: React.FC = () => {
  return (
    <DesignerShell
      leftSidebar={<TokenPanel />}
      canvas={<CanvasArea />}
      rightSidebar={
        <div className="flex flex-col gap-0">
          <QuantityEditor />
          <div className="border-t border-border my-2" />
          <TokenSummary />
          <div className="border-t border-border my-2" />
          <ADAStatus />
          <div className="border-t border-border my-2" />
          <ConstructionSummary />
        </div>
      }
    />
  );
};
