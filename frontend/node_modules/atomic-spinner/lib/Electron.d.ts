import * as React from 'react';
export interface ElectronProps {
    pathDefinitionId: string;
    rotationAngle: number;
    orbitTime: number;
    spacetimeOffset: number;
    size: number;
    color: string;
}
declare const Electron: ({ pathDefinitionId, rotationAngle, orbitTime, spacetimeOffset, size, color }: ElectronProps) => React.JSX.Element;
export default Electron;
