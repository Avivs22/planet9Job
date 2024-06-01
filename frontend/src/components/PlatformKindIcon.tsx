

import androidIcon from "../assets/icons/platforms/android.svg";
import desktopIcon from "../assets/icons/platforms/desktop.svg"
import iphoneIcon from "../assets/icons/platforms/apple.svg";


export interface PlatformIcons {
  android: string;
  desktop: string;
  iphone: string;
}
export interface PlatformKindIconProps {
  platform: keyof PlatformIcons;
  size?: number;

}


export function PlatformKindIcon(props: PlatformKindIconProps) {
  const platformKindIcons = { android: androidIcon, desktop: desktopIcon, iphone: iphoneIcon }
  const size = props.size ?? 32;

  return (

    <img
      style={{ width: size, height: size, color:"white"}}
      src={platformKindIcons[props.platform]}
      alt={props.platform}
    />

  );

}
