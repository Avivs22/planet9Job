/// <reference types="react" />
export interface NucleusProps {
    layerCount: number;
    particlesPerLayer: number;
    particleFillColor: string;
    particleBorderColor: string;
    particleBorderWidth: number;
    particleSize: number;
    distanceFromCenter: number;
    orbitTime: number;
    nucleusMaskOverlap: boolean;
}
declare const Nucleus: (props: NucleusProps) => JSX.Element;
export default Nucleus;
