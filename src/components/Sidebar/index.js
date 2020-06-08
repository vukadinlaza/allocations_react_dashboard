import React, {useEffect, useState} from 'react';
import {Link, useHistory, useLocation, useRouteMatch} from 'react-router-dom';
import {useAuth0} from "../../react-auth0-spa";
import {adminWhitelist} from "../../auth/admin-route"
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
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import HomeIcon from "@material-ui/icons/Home";
import BarChartIcon from "@material-ui/icons/BarChart";
import PersonIcon from "@material-ui/icons/Person";
import FundsIcon from "@material-ui/icons/AttachMoney";
import HelpIcon from "@material-ui/icons/Help";
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
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
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    paddingTop: 8,
    border: "0px !important",
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


export default function Sidebar(props) {
  const {user} = useAuth0();
  const history = useHistory();
  const location = useLocation();
  const [admin, setAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      id={menuId}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon/>
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon/>
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle/>
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );


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
    {
      to: "/funds",
      title: "Funds",
      icon: <FundsIcon/>,
    },
    {
      to: "/help",
      title: "Help",
      icon: <HelpIcon/>,
    },
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
                <ListItemIcon style={{paddingLeft: 8}}>{icon}</ListItemIcon>
                <ListItemText primary={title}/>
              </ListItem>
            </div>
          )
        )}
      </List>
      {admin && <>
        <Divider/>
        <List>
          <div className={`sidebar-nav-item ${location.pathname === "/admin/funds" ? "sidebar-nav-item-active" : ""}`}>
            <ListItem component={Link} to="/admin/funds" button>
              <ListItemIcon style={{paddingLeft: 8}}>
                <PersonIcon/>
              </ListItemIcon>
              <ListItemText primary="Funds"/>
            </ListItem>
          </div>
        </List></>}
      {admin && <AdminLinks location={location}/>}
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  useEffect(() => {
    if (user && adminWhitelist.includes(user.email)) setAdmin(true)
  }, [user])

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

            {/* Peer TODO: Migrate old NavBar Logic to Sidebar/index.js
            */}
            <NavBar/>

            <div className={classes.sectionDesktop}>
              <IconButton aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon/>
                </Badge>
              </IconButton>
              <IconButton aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon/>
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle/>
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon/>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
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

  if (!match) return null
  const {params: {organization}} = match
  if (organization === "funds") return null

  return (
    <div className="admin-links">
      <div className="sidebar-admin-header">Admin</div>
      {organization === "allocations" && <div
        className={`sidebar-nav-item ${location.pathname === `/admin/${organization}/investors` ? "sidebar-nav-item-active" : ""}`}>
        <Link to={`/admin/${organization}/investors`}>
          <span>Investors</span>
        </Link>
      </div>}
      {/**<div className={classNames('sidebar-nav-item', {"sidebar-nav-item-active": showAdministration})}
       onClick={() => setShowAdministration(x => !x)}>
       <span>Administration</span>
       </div>
       {showAdministration && <div className={classNames("sidebar-nav-item", {"sidebar-nav-item-active": location.pathname === `/admin/${organization}/master-filing`})}>
        <Link to={`/admin/${organization}/master-filing`}>
          <span>Master Filing</span>
        </Link>
      </div>}**/}
      <div
        className={`sidebar-nav-item ${location.pathname === `/admin/${organization}/deals` ? "sidebar-nav-item-active" : ""}`}>
        <Link to={`/admin/${organization}/deals`}>
          <span>Deals</span>
        </Link>
      </div>
      <div
        className={`sidebar-nav-item ${location.pathname === `/admin/${organization}/investments` ? "sidebar-nav-item-active" : ""}`}>
        <Link to={`/admin/${organization}/investments`}>
          <span>Investments</span>
        </Link>
      </div>
    </div>
  )
}
