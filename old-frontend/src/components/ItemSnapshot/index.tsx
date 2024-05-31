import {SocialMediaItem, SocialMediaKind, SocialMediaScraperData} from "../../common/types.ts";
import {TwitterItemSnapshot} from "./twitter.tsx";
import {InstagramItemSnapshot} from "./instagram.tsx";
import {TiktokItemSnapshot} from "./tiktok.tsx";


export interface ItemSnapshotProps {
  item: SocialMediaItem;
  scraper?: SocialMediaScraperData;
  noBorder?: boolean;
}

export function ItemSnapshot(props: ItemSnapshotProps) {
  switch (props.item.kind) {
    case SocialMediaKind.TWITTER_POST:
      return (
        <TwitterItemSnapshot item={props.item} scraper={props.scraper} noBorder={props.noBorder} />
      )

    case SocialMediaKind.INSTAGRAM_POST:
      return (
        <InstagramItemSnapshot item={props.item} scraper={props.scraper} noBorder={props.noBorder} />
      )

    case SocialMediaKind.TIKTOK_VIDEO:
      return (
        <TiktokItemSnapshot item={props.item} scraper={props.scraper} noBorder={props.noBorder} />
      )

    default:
      return (
        <>
        </>
      );
  }
}
