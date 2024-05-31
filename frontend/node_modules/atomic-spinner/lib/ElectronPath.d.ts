import * as React from 'react';
export interface ElectronPathProps {
    pathDefinitionId: string;
    color: string;
    width: number;
    rotationAngle: number;
}
declare const ElectronPath: ({ pathDefinitionId, color, width, rotationAngle }: ElectronPathProps) => React.JSX.Element;
export default ElectronPath;
