import React, {useEffect, useState} from 'react';
import {Link, useHistory, useLocation, useRouteMatch} from 'react-router-dom';
import {useAuth} from '../../auth/useAuth'

import {gql} from 'apollo-boost'

import "./style.scss"
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import HomeIcon from "@material-ui/icons/Home";
import BarChartIcon from "@material-ui/icons/BarChart";
import PersonIcon from "@material-ui/icons/Person";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import FundsIcon from "@material-ui/icons/AttachMoney";
import HelpIcon from "@material-ui/icons/Help";
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import NavBar from "../NavBar";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  brand: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    zIndex: 1099,
  },
  appBar: {
    width: "100%",
    background: "#fff",
    color: "#868c97",
    boxShadow: "none !important",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  icon: {
    boxShadow: "0px 3px 6px #00000029",
    width: 56,
    height: 56,
    borderRadius: "50%",
    padding: 16,
    marginRight: 16,
    color: "#8593a6",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    paddingTop: 8,
    borderRight: "1px solid #dfe2e5",
    borderLeft: 0,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const GET_INVESTOR = gql`
  {
    investor {
      _id
      name
      admin
      organizations_admin {
        _id
        slug
        name
        logo
      }
    }
  }
`


export default function Sidebar(props) {
  const {userProfile} = useAuth(GET_INVESTOR);
  const location = useLocation();

  const {window} = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const menus = [
    {
      to: "/",
      title: "Home",
      icon: <HomeIcon/>,
    },
    {
      to: "/investments",
      title: "Investments",
      icon: <BarChartIcon/>,
    },
    {
      to: "/profile",
      title: "Profile",
      icon: <PersonIcon/>,
    },
    // {
    //   to: "/funds",
    //   title: "Funds",
    //   icon: <FundsIcon/>,
    // },
    // {
    //   to: "/help",
    //   title: "Help",
    //   icon: <HelpIcon/>,
    // },
  ];

  const drawer = (
    <div>
      <div className={classes.toolbar}/>
      <List>
        {menus.map(
          ({
             to,
             title,
             icon
           }) => (
            <div key={`menu-${title}`} onClick={mobileOpen ? handleDrawerClose : null}
                 className={`sidebar-nav-item ${location.pathname === to ? "sidebar-nav-item-active" : ""}`}>
              <ListItem component={Link} to={to} button>
                <ListItemIcon className={classes.icon}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={title}/>
              </ListItem>
            </div>
          )
        )}
      </List>
      {userProfile.admin && <>
        <Divider/>
        <List>
          <div className={`sidebar-nav-item ${location.pathname === "/admin/funds" ? "sidebar-nav-item-active" : ""}`}>
            <ListItem component={Link} to="/admin/funds" button>
              <ListItemIcon className={classes.icon}>
                <AccountBalanceIcon/>
              </ListItemIcon>
              <ListItemText primary="Funds"/>
            </ListItem>
          </div>
          <AdminLinks location={location}/>
        </List>
      </>}
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (<>
      <div className={classes.root}>
        <CssBaseline/>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}>
              <MenuIcon/>
            </IconButton>
            <div className={classes.brand}>
              <Brand/>
            </div>
            <NavBar/>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar}/>
          {props.children}
        </main>
      </div>
    </>
  )
}

const whitelist = ["allocations", "organizations", "funds", "investments"]

function Brand() {
  const history = useHistory()
  const match = useRouteMatch('/admin/:organization')
  const dealMatch = useRouteMatch('/deals/:organization/:id')

  const adminMatches = match && match.params.organization && !whitelist.includes(match.params.organization)
  const dealMatches = dealMatch && dealMatch.params.organization && !whitelist.includes(dealMatch.params.organization)
  if (adminMatches || dealMatches) {
    const slug = adminMatches ? match.params.organization : dealMatch.params.organization
    return <OrgLogo slug={slug}/>
  }

  return (
    <img onClick={() => history.push('/')}
         src="https://allocations-public.s3.us-east-2.amazonaws.com/allocations-logo.svg"
         alt="allocations"
         style={{height: "60px", width: "auto"}}/>
  )
}

function deSlugify(slug) {
  try {
    return slug.split('-').map(str => `${str[0].toUpperCase()}${str.slice(1)}`).join(' ')
  } catch (e) {
    return slug
  }
}

function OrgLogo({slug}) {
  const history = useHistory()
  const [img, setImg] = useState(`https://allocations-public.s3.us-east-2.amazonaws.com/organizations/${slug}.png`)

  if (!img) {
    return (
      <div className="brand" onClick={() => history.push(`/admin/${slug}`)}>
        <span style={{height: "60px", width: "180px", textAlign: "center", fontSize: "1.5em"}}>
          <b>{deSlugify(slug)}</b>
        </span>
      </div>
    )
  }

  return (
    <div className="brand" onClick={() => history.push(`/admin/${slug}`)}>
      <img height="60px" width="180px"
           alt={slug}
           onError={() => setImg(null)}
           src={img}/>
    </div>
  )
}

function Footer() {
  return (
    <div className="Sidebar-footer">
      <Link to="/getting-started">Getting Started</Link>
    </div>
  )
}

function AdminLinks({location}) {


  const match = useRouteMatch('/admin/:organization')
  const [showAdministration, setShowAdministration] = useState(false)

  const classes = useStyles();

  if (!match) return null
  const {params: {organization}} = match
  if (organization === "funds") return null

  return (
    <div className="admin-links">
      {/* <div className="sidebar-admin-header">Admin</div> */}
      {/* <div
        className={`sidebar-nav-item ${location.pathname === `/admin/${organization}/investors` ? "sidebar-nav-item-active" : ""}`}>
        <Link to={`/admin/${organization}/investors`}>
          <span>Investors</span>
        </Link>
      </div> */}
      {/* <List>
        <div className={`sidebar-nav-item ${location.pathname === `/admin/${organization}/investors` ? "sidebar-nav-item-active" : ""}`}>
        <ListItem component={Link} to={`/admin/${organization}/investors`} button>
        <ListItemIcon>
        <PersonIcon/>
          </ListItemIcon>
          <ListItemText primary="Investors"/>
        </ListItem>
      </div>
      </List> */}
      {/**<div className={classNames('sidebar-nav-item', {"sidebar-nav-item-active": showAdministration})}
       onClick={() => setShowAdministration(x => !x)}>
       <span>Administration</span>
       </div>
       {showAdministration && <div className={classNames("sidebar-nav-item", {"sidebar-nav-item-active": location.pathname === `/admin/${organization}/master-filing`})}>
        <Link to={`/admin/${organization}/master-filing`}>
          <span>Master Filing</span>
        </Link>
      </div>}**/}
      {/* <List>
        <div className={`sidebar-nav-item ${location.pathname === `/admin/${organization}/deals` ? "sidebar-nav-item-active" : ""}`}>
        <ListItem component={Link} to={`/admin/${organization}/deals`} button>
        <ListItemIcon>
        <DonutLargeIcon/>
          </ListItemIcon>
          <ListItemText primary="Deals"/>
        </ListItem>
      </div>
      </List> */}
      <div
        className={`sidebar-nav-item ${location.pathname === `/admin/${organization}/investments` ? "sidebar-nav-item-active" : ""}`}>
        <ListItem component={Link} to={`/admin/${organization}/investments`} button>
          <ListItemIcon className={classes.icon}>
            <BarChartIcon/>
          </ListItemIcon>
          <ListItemText primary="Investments"/>
        </ListItem>
      </div>
    </div>
  )
}
