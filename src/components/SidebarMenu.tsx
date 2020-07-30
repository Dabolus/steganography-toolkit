import React, {
  ReactNode,
  FunctionComponent,
  Fragment,
  useState,
  useCallback,
} from 'react';

import { NavLink } from 'react-router-dom';

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Collapse,
} from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';
import TitleIcon from '@material-ui/icons/Title';
import ImageIcon from '@material-ui/icons/Image';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const useStyles = makeStyles((theme) => ({
  active: {
    '& *': {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  nested: {
    background: theme.palette.background.default,
    paddingLeft: theme.spacing(4),
  },
}));

interface MenuItem {
  key: string;
  title: string;
  icon: ReactNode;
  link?: string;
  subitems?: Omit<MenuItem, 'icon' | 'subitems'>[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'home',
    title: 'Home',
    link: '/',
    icon: <HomeIcon />,
  },
  {
    key: 'text',
    title: 'Text',
    icon: <TitleIcon />,
    subitems: [
      {
        key: 'mlp',
        title: 'Missing Letter Puzzle',
      },
      {
        key: 'wordlist',
        title: 'Wordlist',
      },
      {
        key: 'Paragraph',
        title: 'Paragraph',
      },
    ],
  },
  {
    key: 'image',
    title: 'Image',
    icon: <ImageIcon />,
    subitems: [
      {
        key: 'lsb',
        title: 'Least Significant Bit',
      },
      {
        key: 'dct',
        title: 'Discrete Cosine Transform',
      },
    ],
  },
  {
    key: 'audio',
    title: 'Audio',
    icon: <AudiotrackIcon />,
    subitems: [
      {
        key: 'solresol',
        title: 'Solresol',
      },
      {
        key: 'cicada-3301',
        title: 'Cicada 3301',
      },
    ],
  },
];

interface ClosedTogglesState {
  text?: boolean;
  image?: boolean;
  audio?: boolean;
}

interface SidebarMenuProps {
  onItemClick?(): void;
}

const SidebarMenu: FunctionComponent<SidebarMenuProps> = ({ onItemClick }) => {
  const classes = useStyles();

  const [closedToggles, setClosedToggles] = useState<ClosedTogglesState>({});

  const handleListItemClick = useCallback(() => {
    onItemClick?.();
  }, [onItemClick]);

  const createToggleableListItemClickHandler = useCallback(
    (key: keyof ClosedTogglesState) => () => {
      setClosedToggles({
        ...closedToggles,
        [key]: !closedToggles[key],
      });
    },
    [closedToggles],
  );

  return (
    <List component="nav">
      {MENU_ITEMS.map(({ key, title, icon, link, subitems }) => (
        <Fragment key={key}>
          <ListItem
            button
            {...(subitems
              ? {
                  onClick: createToggleableListItemClickHandler(
                    key as keyof ClosedTogglesState,
                  ),
                }
              : {
                  component: NavLink,
                  exact: true,
                  to: link || `/${key}`,
                  activeClassName: classes.active,
                  onClick: handleListItemClick,
                })}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{title}</ListItemText>
            {subitems && (
              <>
                {closedToggles[key as keyof ClosedTogglesState] ? (
                  <ExpandMoreIcon />
                ) : (
                  <ExpandLessIcon />
                )}
              </>
            )}
          </ListItem>
          {subitems && (
            <Collapse
              in={!closedToggles[key as keyof ClosedTogglesState]}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {subitems.map(
                  ({ key: subkey, title: subtitle, link: sublink }) => (
                    <ListItem
                      button
                      className={classes.nested}
                      key={`${key}-${subkey}`}
                      component={NavLink}
                      to={`${sublink || `/${key}/${subkey}`}`}
                      activeClassName={classes.active}
                      onClick={handleListItemClick}
                    >
                      <ListItemText>{subtitle}</ListItemText>
                    </ListItem>
                  ),
                )}
              </List>
            </Collapse>
          )}
        </Fragment>
      ))}
    </List>
  );
};

export default SidebarMenu;
