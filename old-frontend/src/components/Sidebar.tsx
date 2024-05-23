import {Box, Divider, Drawer, List, ListItemButton, SxProps, Typography} from '@mui/material';
import {Fragment, ReactNode, useMemo, useState} from 'react';
import {Logout,} from '@mui/icons-material';
import {Link, useLocation, useNavigate} from 'react-router-dom';

import homeIcon from '../assets/icons/sidebar/home.svg';
import dashboardIcon from '../assets/icons/sidebar/dashboard.svg';
import urlScannerIcon from '../assets/icons/sidebar/url-scanner.svg';
import socialMediaIcon from '../assets/icons/sidebar/social-media.svg';
import casesIcon from '../assets/icons/sidebar/cases.svg';
import p9Logo from '../assets/images/p9_logo.svg';
import {isScamsUser} from "../common/utils.ts";

export const SIDEBAR_WIDTH = 280;

interface SidebarItem {
  title: string;
  icon?: () => ReactNode;
  path?: string;
  availableToScams?: boolean;
}

interface SidebarItemGroup {
  title?: string;
  icon?: () => ReactNode;
  items: SidebarItem[];
  bottom?: boolean;
  onlyScamsHack?: boolean;
}

function makeIcon(path: string) {
  return (
    <img
      src={path}
      style={{
        width: 24,
        height: 24,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        // filter: selected ? 'invert(1.0) invert(65%) sepia(50%) saturate(1849%) hue-rotate(220deg) brightness(98%) contrast(94%)' : '',
      }}
    />
  );
}

const SIDEBAR_ITEMS: SidebarItemGroup[] = [
  {
    items: [
      {
        title: 'Home',
        // icon: (color: string) => <HomeOutlined sx={{color,}}/>,
        icon: () => makeIcon(homeIcon),
      },
      {
        title: 'Dashboard',
        // icon: (color: string) => <DashboardOutlined sx={{color,}}/>,
        icon: () => makeIcon(dashboardIcon),
      }
    ]
  },
  {
    title: 'Social media',
    icon: () => makeIcon(socialMediaIcon),
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard/social-media/home',
      },
      {
        title: 'Database',
        path: '/dashboard/social-media/database',
      }
    ]
  },
  {
    items: [
      {
        title: 'Cases',
        icon: () => makeIcon(casesIcon),
        path: '/dashboard/cases',
      },
    ]
  },
  {
    title: 'URL Scanner',
    icon: () => makeIcon(urlScannerIcon),
    onlyScamsHack: true,
    items: [
      {
        title: 'Investigate',
        path: '/dashboard/url/investigate',
        availableToScams: true,
      },
      {
        title: 'Dashboard',
        path: '/dashboard/url/dashboard',
        availableToScams: true,
      },
      {
        title: 'Model Inference',
        path: '/dashboard/url/model-inference',
        availableToScams: true,
      },
      {
        title: 'Database',
        path: '/dashboard/url/database',
        availableToScams: true,
      }
    ]
  },
  {
    bottom: true,
    items: [
      {
        title: 'Logout',
        icon: () => <Logout sx={{color: 'white',}}/>,
        path: '/logout',
        availableToScams: true,
      },
    ],
  }
];

interface SideBarListItemProps {
  title: string;
  icon?: () => ReactNode;
  path?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  sx?: SxProps;
}

function SideBarListItem(props: SideBarListItemProps) {
  const location = useLocation();
  const isSelected = useMemo(() => {
    if (props.selected !== undefined) return props.selected;
    if (!props.path) return false;
    return location.pathname.startsWith(props.path);
  }, [location.pathname, props.path]);

  return (
    <ListItemButton
      sx={{
        color: isSelected ? 'white' : 'white',
        background: isSelected ? 'linear-gradient(to left, #6ab4ff, #c2a6ff)' : 'transparent',
        borderRadius: '48px',
        mb: '4px',
        ...props.sx,

        // ...(isSelected && ({
        //   '&:hover': {
        //     background: 'white',
        //   },
        // }))
      }}
      disabled={props.disabled || (props.selected === undefined && !props.path)}
      onClick={props.onClick}
      {...(props.path ? {component: Link, to: props.path} : {})}
    >
      {props.icon?.() ?? <div style={{width: 24, height: 24}}/>}
      <Typography sx={{ml: 2}}>{props.title}</Typography>
    </ListItemButton>
  );
}

interface SidebarItemListProps {
  items: SidebarItem[];
  sx?: SxProps;
}

function SidebarItemList(props: SidebarItemListProps) {
  return (
    <List sx={{px: 3, ...props.sx}}>
      {props.items.map(item => (
        <SideBarListItem
          key={item.title}
          title={item.title}
          icon={item.icon}
          path={item.path}
          disabled={!item.availableToScams && isScamsUser()}
        />
      ))}
    </List>
  );
}


interface SidebarItemSingleGroupProps {
  group: SidebarItemGroup;
}

function SidebarItemSingleGroup(props: SidebarItemSingleGroupProps) {
  const {group} = props;

  const location = useLocation();
  const isInsideGroup = useMemo(() => {
    return group.items.some(item => location.pathname.startsWith(item.path ?? ''));
  }, [group, location.pathname]);

  const [expandGroup, setExpandGroup] = useState(false);
  const showGroupItems = useMemo(() => {
    if (!props.group.title)
      // this is not a titled group
      return true;

    return expandGroup || isInsideGroup;
  }, [isInsideGroup, expandGroup]);

  const navigate = useNavigate();
  const handleClickGroupTitle = () => {
    if (!isInsideGroup) {
      setExpandGroup(x => !x);
    }

    const itemWithPath = group.items.find(item => item.path);
    if (itemWithPath)
      navigate(itemWithPath.path!);
  };

  const disabled = useMemo(() => !group.onlyScamsHack && isScamsUser(), [group.onlyScamsHack]);

  return (
    <>
      {group.title && (
        <List sx={{px: 3, mb: group.title ? -2 : 0}}>
          <SideBarListItem
            disabled={disabled}
            title={group.title}
            icon={group.icon}
            selected={false}
            onClick={handleClickGroupTitle}
            sx={{
              pointerEvents: isInsideGroup ? 'none' : 'auto',
            }}
          />
        </List>
      )}

      {showGroupItems && (
        <SidebarItemList items={group.items}/>
      )}
    </>
  )
}


interface SidebarItemGroupCollectionProps {
  groups: SidebarItemGroup[];
}

function SidebarItemGroupCollection(props: SidebarItemGroupCollectionProps) {
  return (
    <>
      {props.groups.map((group, i) => (
        <Fragment key={i}>
          <SidebarItemSingleGroup group={group}/>

          {i !== props.groups.length - 1 && (
            <Divider sx={{background: '#7193b9', mx: 5, my: 2}}/>
          )}
        </Fragment>
      ))}
    </>
  );
}

export default function Sidebar() {
  const topGroups = useMemo(() => SIDEBAR_ITEMS.filter(g => !g.bottom), []);
  const bottomGroups = useMemo(() => SIDEBAR_ITEMS.filter(g => g.bottom), []);

  return (
    <Drawer
      sx={{
        width: SIDEBAR_WIDTH,
        position: 'relative',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          background: 'linear-gradient(#3d334e, #2163a8)',
          borderRight: 0,
          boxSizing: 'border-box',
        }
      }}
      variant="permanent"
      anchor="left"
    >
      {/*<Typography fontFamily="Optien" color="white" fontSize={28} align="center"*/}
      {/*            sx={{mt: 3, userSelect: 'none', mb: 3}}>*/}
      {/*  mynk*/}
      {/*</Typography>*/}
      <img
        src={p9Logo}
        alt="Planet Nine"
        style={{
          width: '70%',
          marginTop: 32,
          marginBottom: 48,
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'table',
        }}
      />

      <SidebarItemGroupCollection groups={topGroups}/>

      <Box sx={{position: 'absolute', bottom: 8, left: 0, right: 0}}>
        <SidebarItemGroupCollection groups={bottomGroups}/>
      </Box>
    </Drawer>
  );
}
