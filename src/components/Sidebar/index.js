import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { get, toLower } from 'lodash';
import { gql } from 'apollo-boost';
import { Helmet } from 'react-helmet';
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
import { makeStyles, useTheme } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import StorefrontIcon from '@material-ui/icons/Storefront';
import BuildIcon from '@material-ui/icons/Build';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import AccountBalanceRoundedIcon from '@material-ui/icons/AccountBalanceRounded';
import CreditCardRoundedIcon from '@material-ui/icons/CreditCardRounded';
import { useAuth } from '../../auth/useAuth';
import NavBar from '../NavBar';
import './style.scss';

const whitelistEmails = [
  {
    email: 'adam@collider.vc',
  },
  {
    email: 'Adamsulliwong@gmail.com',
  },
  {
    email: 'levanon.adi@gmail.com',
  },
  {
    email: 'Aditya.nagarsheth@gmail.com',
  },
  {
    email: 'altcoinco@gmail.com',
  },
  {
    email: 'ajay@apavp.com',
  },
  {
    email: 'akshay@pensiveibis.com',
  },
  {
    email: 'alain@psionpartners.com',
  },
  {
    email: 'ah323@cornell.edu',
  },
  {
    email: 'alecotto2@gmail.com',
  },
  {
    email: 'ataggart28@gmail.com',
  },
  {
    email: 'alex@apavp.com',
  },
  {
    email: 'alex@creativeventures.vc',
  },
  {
    email: 'alexm@skunk.capital',
  },
  {
    email: 'alexmsimon@gmail.com',
  },
  {
    email: 'theylos@gmail.com',
  },
  {
    email: 'pikovsky.alexej@gmail.com',
  },
  {
    email: 'alex@3h.com.hk',
  },
  {
    email: 'alistairgalloway@gmail.com',
  },
  {
    email: 'amanda_mi@icloud.com',
  },
  {
    email: 'amber.illig@gmail.com',
  },
  {
    email: 'ABURMAN@WESTGROVE.COM',
  },
  {
    email: 'amrit@saxecap.com',
  },
  {
    email: 'ana@ana.vc',
  },
  {
    email: 'aphancox@gmail.com',
  },
  {
    email: 'rewkang@gmail.com',
  },
  {
    email: 'ankush@sumaria.biz',
  },
  {
    email: 'annaescher@gmail.com',
  },
  {
    email: 'anubhavsaxena.usa@gmail.com',
  },
  {
    email: 'jolly@ajollylife.com',
  },
  {
    email: 'arilitan@gmail.com',
  },
  {
    email: 'adevabhaktuni@gmail.com',
  },
  {
    email: 'asfandyarnadeem@gmail.com',
  },
  {
    email: 'ashishrvce@gmail.com',
  },
  {
    email: 'ayanna@precursorvc.com',
  },
  {
    email: 'aylonmorley@gmail.com',
  },
  {
    email: 'backus@proof.vc',
  },
  {
    email: 'beatriz.zeno@gmail.com',
  },
  {
    email: 'clark.ben@gmail.com',
  },
  {
    email: 'ben.clarkesf@gmail.com',
  },
  {
    email: 'ben.forman@parafi.capital',
  },
  {
    email: 'william.arzt@gmail.com',
  },
  {
    email: 'brad@genesisblock.com',
  },
  {
    email: 'bsfeldman10@gmail.com',
  },
  {
    email: 'brian@investingblock.com',
  },
  {
    email: 'bfoster379@gmail.com',
  },
  {
    email: 'bf@ftw.vc',
  },
  {
    email: 'brian@iterative.vc',
  },
  {
    email: 'Brianmcnerney@gmail.com',
  },
  {
    email: 'blwang@gmail.com',
  },
  {
    email: 'brit.yonge@gmail.com',
  },
  {
    email: 'bwalk9208@gmail.com',
  },
  {
    email: 'bbarclay@axon-cp.com',
  },
  {
    email: 'bryan@ebtgroupholdings.com',
  },
  {
    email: 'calvin@compound.finance',
  },
  {
    email: 'calvin.ngo@gmail.com',
  },
  {
    email: 'carl.paulo@live.com.au',
  },
  {
    email: 'jgs2243@gmail.com',
  },
  {
    email: 'crazybcoin@gmail.com',
  },
  {
    email: 'c@chrisyork.co',
  },
  {
    email: 'chulyim@gmail.com',
  },
  {
    email: 'clayton.robbins1@gmail.com',
  },
  {
    email: 'craig.burel@gmail.com',
  },
  {
    email: 'dan@goldsilver.com',
  },
  {
    email: 'dan.shafqat@me.com',
  },
  {
    email: 'dane@batshitcrazy.is',
  },
  {
    email: 'weisspick@gmail.com',
  },
  {
    email: 'bitcoin37@gmail.com',
  },
  {
    email: 'david.hall@philipp-fo.com',
  },
  {
    email: 'david@comma.vc',
  },
  {
    email: 'dennis.schuppert@gmail.com',
  },
  {
    email: 'd.lituiev@gmail.com',
  },
  {
    email: 'Don@pioneerfund.vc',
  },
  {
    email: 'konfortydor@gmail.com',
  },
  {
    email: 'dougspace007@gmail.com',
  },
  {
    email: 'dylan@morganbrookcapital.com',
  },
  {
    email: 'edouard@conduitcapitalpartners.com',
  },
  {
    email: 'edwardwest@gmail.com',
  },
  {
    email: 'ezhen@nea.com',
  },
  {
    email: 'thecompanygardener@gmail.com',
  },
  {
    email: 'efranco@gmail.com',
  },
  {
    email: 'fawaz.hourani@gmail.com',
  },
  {
    email: 'gbudhrani@gmail.com',
  },
  {
    email: 'geoffnoyes@gmail.com',
  },
  {
    email: 'glambeth94@gmail.com',
  },
  {
    email: 'g.depastas@gmail.com',
  },
  {
    email: 'giacomo.mariotti@outlook.com',
  },
  {
    email: 'startale.bomber@gmail.com',
  },
  {
    email: 'harvey.multani@gmail.com',
  },
  {
    email: 'heatks@gmail.com',
  },
  {
    email: 'henry.barclay@barclayetal.com',
  },
  {
    email: 'hershel@mehtaventures.co',
  },
  {
    email: 'hongnjiang@outlook.com',
  },
  {
    email: 'idris@sersoub.com',
  },
  {
    email: 'imess2@morgan.edu',
  },
  {
    email: 'ish@goldenarccap.com',
  },
  {
    email: 'thejackluo@gmail.com',
  },
  {
    email: 'jackleonprior@gmail.com',
  },
  {
    email: 'jmoses.hq@gmail.com',
  },
  {
    email: 'jai@208seedventures.com',
  },
  {
    email: 'jai@208seedventures.com',
  },
  {
    email: 'jjebloemena@gmail.com',
  },
  {
    email: 'inbox.chi@gmail.com',
  },
  {
    email: 'james@spacefund.com',
  },
  {
    email: 'james.shawsworld@gmail.com',
  },
  {
    email: 'jamie@cryptx.capital',
  },
  {
    email: 'jan.stijohann@outlook.com',
  },
  {
    email: 'jborseth@gmail.com',
  },
  {
    email: 'j.byun94@gmail.com',
  },
  {
    email: 'jeff@seraphimcapital.com',
  },
  {
    email: 'jefflieberman@gmail.com',
  },
  {
    email: 'jeffrey.lin@oakskycapital.com',
  },
  {
    email: 'jeff@gpofund.com',
  },
  {
    email: 'jengyang.chia@gmail.com',
  },
  {
    email: 'jennyrator@gmail.com',
  },
  {
    email: 'jerryc@skunk.capital',
  },
  {
    email: 'jessica@somacap.com',
  },
  {
    email: 'Joe@redrock.capital',
  },
  {
    email: 'jojozhao726@gmail.com',
  },
  {
    email: 'joel.karacozoff@gmail.com',
  },
  {
    email: 'joey@firstservepartners.com',
  },
  {
    email: 'jonmcfaul@gmail.com',
  },
  {
    email: 'johnsforms@gmail.com',
  },
  {
    email: 'jgemmeke@gmail.com',
  },
  {
    email: 'josephlizyness@gmail.com',
  },
  {
    email: 'joshk@recvf.com',
  },
  {
    email: 'josh@metzger.ventures',
  },
  {
    email: 'joshua@wiasecapital.com',
  },
  {
    email: 'joshua@donotpay.com',
  },
  {
    email: 'jchiavas@yahoo.fr',
  },
  {
    email: 'kyokley@rrdschicago.com',
  },
  {
    email: 'kendrakinnison@gmail.com',
  },
  {
    email: 'kennethchao66@gmail.com',
  },
  {
    email: 'kevin@consilienceventures.com',
  },
  {
    email: 'key@gpofund.com',
  },
  {
    email: 'kadvani1@gmail.com',
  },
  {
    email: 'komal.sethi@gmail.com',
  },
  {
    email: 'allocationscapital@krisprice.nz',
  },
  {
    email: 'Kylearmour@gmail.com',
  },
  {
    email: 'kyletwang@gmail.com',
  },
  {
    email: 'lwarsavsky@gmail.com',
  },
  {
    email: 'leocheng@gmail.com',
  },
  {
    email: 'lev@dubinets.io',
  },
  {
    email: 'luis@brecci.legal',
  },
  {
    email: 'Lukasjohanneskoch@gmail.com',
  },
  {
    email: 'mac@rarebreed.vc',
  },
  {
    email: 'upyougonow@gmail.com',
  },
  {
    email: 'phaedrus.one@gmail.com',
  },
  {
    email: 'Mcattini@pm.me',
  },
  {
    email: 'mark@centuryinvestmentgroup.com',
  },
  {
    email: 'mark@apenu.com',
  },
  {
    email: 'martinjash@gmail.com',
  },
  {
    email: 'matthew@marbletech.co',
  },
  {
    email: 'max@dover.io',
  },
  {
    email: 'meagan@spacefund.com',
  },
  {
    email: 'yoblaze@hotmail.com',
  },
  {
    email: 'micahjw@gmail.com',
  },
  {
    email: 'michael@lchgv.com',
  },
  {
    email: 'mrmojica@yahoo.com',
  },
  {
    email: 'micheleguo@gmail.com',
  },
  {
    email: 'miguelnnferreira@gmail.com',
  },
  {
    email: 'mj@nucleushg.com',
  },
  {
    email: 'mj@nucleushg.com',
  },
  {
    email: 'mj@nucleushg.com',
  },
  {
    email: 'morgan@manaventures.vc',
  },
  {
    email: 'NANCY@NKHGROUP.COM',
  },
  {
    email: 'nathan@airstreet.com',
  },
  {
    email: 'neel@acesotp.com',
  },
  {
    email: 'neil@necessary.vc',
  },
  {
    email: 'nfrichler@gmail.com',
  },
  {
    email: 'nick@lumenadvisory.com',
  },
  {
    email: 'nick@halfdomeventures.com',
  },
  {
    email: 'nbiv97@gmail.com',
  },
  {
    email: 'Noufalhaqbani@gmail.com',
  },
  {
    email: 'peter@elysium.vc',
  },
  {
    email: 'philippxbeer@gmail.com',
  },
  {
    email: 'philattia@gmail.com',
  },
  {
    email: 'phillip@pimlicopartners.com',
  },
  {
    email: 'rajiv@highhamptoncapital.com',
  },
  {
    email: 'mez@morethanhuman.org',
  },
  {
    email: 'raphael@e2mc.space',
  },
  {
    email: 'regina.chi@gmail.com',
  },
  {
    email: 'Rick@SpaceFund.com',
  },
  {
    email: 'rtheryoung@gmail.com',
  },
  {
    email: 'rklauer@boldrosecapital.com',
  },
  {
    email: 'rogerspitz@gmail.com',
  },
  {
    email: 'rohit.gupta@gmail.com',
  },
  {
    email: 'sajid@myasiavc.com',
  },
  {
    email: 'sam.copley@truventuro.com',
  },
  {
    email: 'swfrank@gmail.com',
  },
  {
    email: 'Sanjay@mehtaventures.co',
  },
  {
    email: 'sanjeev.bhalla.usa@gmail.com',
  },
  {
    email: 'santinocucchiara@hotmail.com',
  },
  {
    email: 'sean@venturecoin.io',
  },
  {
    email: 'sebastian.zhou@alphasquaregroup.com',
  },
  {
    email: 'sergio@methuselahfund.com',
  },
  {
    email: 'howleysv@gmail.com',
  },
  {
    email: 'Sharon.niv@gmail.com',
  },
  {
    email: 'sherman@rocco.ai',
  },
  {
    email: 'sonia.weiss.pick@gmail.com',
  },
  {
    email: 'Spencer@transform.capital',
  },
  {
    email: 'sree@lando.com',
  },
  {
    email: 'spomichter@romuluscap.com',
  },
  {
    email: 'steven@starbridgevc.com',
  },
  {
    email: 'sduyar@rengen.io',
  },
  {
    email: 'sultan@envst.com',
  },
  {
    email: 'choi.sung.h@gmail.com',
  },
  {
    email: 'sunilsrivatsa@gmail.com',
  },
  {
    email: 'sunny@signiavc.com',
  },
  {
    email: 'tejpaulb@google.com',
  },
  {
    email: 'themasap@civilizationventures.com',
  },
  {
    email: 'thomas@newmissioncity.com',
  },
  {
    email: 'tistrazz@gmail.com',
  },
  {
    email: 'reachtommytran@gmail.com',
  },
  {
    email: 't@nyvp.com',
  },
  {
    email: 'vera.futorjanski@gmail.com',
  },
  {
    email: 'vikramsmashru@gmail.com',
  },
  {
    email: 'vlad.vdov@gmail.com',
  },
  {
    email: 'willbholtz@gmail.com',
  },
  {
    email: 'wm@portfolio.ventures',
  },
  {
    email: 'xavier.labatie@gmail.com',
  },
  {
    email: 'ujfmd3048@gmail.com',
  },
  {
    email: 'abramovaya3@gmail.com',
  },
  {
    email: 'yidapb@gmail.com',
  },
  {
    email: 'soloveya@hotmail.com',
  },
  {
    email: 'hargreaves.z@gmail.com',
  },
  {
    email: 'zachary.rapp2@gmail.com',
  },
  {
    email: 'joel@allocations.com',
  },
  {
    email: 'lance@allocations.com',
  },
  {
    email: 'nils@allocations.com',
  },
  {
    email: 'olia@allocations.com',
  },
  {
    email: 'jessica@allocations.com',
  },
  {
    email: 'kingsley@allocations.com',
  },
  {
    email: 'michelle@allocations.com',
  },
  {
    email: 'brandon@allocations.com',
  },
  {
    email: 'tim@allocations.com',
  },
  {
    email: 'luis@allocations.com',
  },
  {
    email: 'robert@allocations.com',
  },
];

const drawerWidth = 250;

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
    width: '100%',
    background: '#fff',
    color: '#868c97',
    boxShadow: 'none !important',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  icon: {
    boxShadow: '0px 3px 6px #00000029',
    width: 64,
    height: 64,
    borderRadius: '50%',
    padding: 20,
    marginRight: 16,
    color: '#8593a6',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    paddingTop: 8,
    borderRight: '1px solid #dfe2e5',
    borderLeft: 0,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(4),
    maxWidth: '100%',
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
      showInvestAndMrkPlc
      showCredit
      showBuild
      organizations_admin {
        _id
        slug
        name
        logo
      }
    }
  }
`;

export default function Sidebar(props) {
  const { userProfile } = useAuth(GET_INVESTOR);
  const [investTab, setInvestTab] = useState(false);
  const [creditTab, setCreditTab] = useState(false);
  const [buildTab, setBuildTab] = useState(false);
  const location = useLocation();
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  useEffect(() => {
    if (userProfile.showInvestAndMrkPlc || location.pathname === '/invest') {
      setInvestTab(true);
    }
    if (userProfile.showCredit || location.pathname === '/credit') {
      setCreditTab(true);
    }
    if (userProfile.showBuild || location.pathname === '/get-started') {
      setBuildTab(true);
    }
  }, [userProfile.showInvestAndMrkPlc, userProfile.showCredit, location.pathname, userProfile.showBuild]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const menus = [
    {
      to: '/',
      title: 'Home',
      icon: <HomeIcon />,
    },
  ];
  if (buildTab) {
    menus.push({
      to: '/get-started',
      title: 'Get Started',
      icon: <BuildIcon />,
    });
  }
  menus.push({
    to: '/profile',
    title: 'Profile',
    icon: <PersonIcon />,
  });

  if (whitelistEmails.find((p) => toLower(p.email) === toLower(userProfile.email)) || investTab)
    menus.push({
      to: '/marketplace',
      title: 'Marketplace',
      icon: <StorefrontIcon />,
    });

  if (investTab)
    menus.push({
      to: '/invest',
      title: 'Invest',
      icon: <MonetizationOnRoundedIcon />,
    });

  if (creditTab) {
    menus.push({
      to: '/credit',
      title: 'Credit',
      icon: <CreditCardRoundedIcon />,
    });
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        {menus.map(({ to, title, icon }) => (
          <div
            key={`menu-${title}`}
            onClick={mobileOpen ? handleDrawerClose : null}
            className={`sidebar-nav-item ${location.pathname === to ? 'sidebar-nav-item-active' : ''}`}
          >
            <ListItem component={Link} to={to} button>
              <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          </div>
        ))}
      </List>
      {userProfile.admin && (
        <>
          <Divider />
          <List>
            <div
              className={`sidebar-nav-item ${location.pathname === '/admin/funds' ? 'sidebar-nav-item-active' : ''}`}
            >
              <ListItem component={Link} to="/admin/funds" button>
                <ListItemIcon className={classes.icon}>
                  <AccountBalanceRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Funds" />
              </ListItem>
            </div>
            <AdminLinks location={location} />
          </List>
        </>
      )}
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  const onboarding = location.pathname === '/get-started';
  return (
    <>
      <div className={classes.root}>
        {!onboarding && <CssBaseline />}
        {!onboarding ? (
          <>
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
                <div className={classes.brand}>
                  <Brand organizations_admin={userProfile.organizations_admin || []} />
                </div>
                <NavBar />
              </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
              <Hidden mdUp implementation="css">
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
              <Hidden smDown implementation="css">
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
            <main className={classes.content} style={{ background: 'rgba(0,0,0,0.01)' }}>
              <div className={classes.toolbar} />
              <Helmet>
                <title>Allocations</title>
              </Helmet>
              {props.children}
            </main>
          </>
        ) : (
          <main style={{}}>
            <Helmet>
              <title>Allocations</title>
            </Helmet>
            {props.children}
          </main>
        )}
      </div>
    </>
  );
}

const whitelist = ['allocations', 'organizations', 'funds', 'investments'];

function Brand({ organizations_admin }) {
  const history = useHistory();
  const match = useRouteMatch('/admin/:organization');
  const dealMatch = useRouteMatch('/deals/:organization/:id');

  const adminMatches = match && match.params.organization && !whitelist.includes(match.params.organization);
  const dealMatches = dealMatch && dealMatch.params.organization && !whitelist.includes(dealMatch.params.organization);
  if (adminMatches || dealMatches) {
    const slug = adminMatches ? match.params.organization : dealMatch.params.organization;
    const orgName = get(
      (organizations_admin || []).find((org) => org.slug === slug),
      'name',
      false,
    );
    return <OrgLogo slug={slug} name={orgName} />;
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <img
      onClick={() => history.push('/')}
      src="https://allocations-public.s3.us-east-2.amazonaws.com/allocations-logo.svg"
      alt="allocations"
      style={{ height: '60px', width: 'auto' }}
    />
  );
}

function deSlugify(slug) {
  try {
    return slug
      .split('-')
      .map((str) => `${str[0].toUpperCase()}${str.slice(1)}`)
      .join(' ');
  } catch (e) {
    return slug;
  }
}

function OrgLogo({ slug, name }) {
  const history = useHistory();
  const [img, setImg] = useState();
  useEffect(() => {
    setImg(`https://allocations-public.s3.us-east-2.amazonaws.com/organizations/${slug}.png`);
  }, [slug]);
  if (!img) {
    return (
      <div className="brand" onClick={() => history.push(`/admin/${slug}`)}>
        <span style={{ height: '60px', width: '180px', textAlign: 'center', fontSize: '1.5em' }}>
          <b>{name || deSlugify(slug)}</b>
        </span>
      </div>
    );
  }

  return (
    <div className="brand" onClick={() => history.push(`/admin/${slug}`)}>
      <img height="60px" width="180px" alt={slug} onError={() => setImg(null)} src={img} />
    </div>
  );
}

// function Footer() {
//   return (
//     <div className="Sidebar-footer">
//       <Link to="/getting-started">Getting Started</Link>
//     </div>
//   );
// }

function AdminLinks({ location }) {
  const match = useRouteMatch('/admin/:organization');
  // const [showAdministration, setShowAdministration] = useState(false);

  // const classes = useStyles();

  if (!match) return null;
  const {
    params: { organization },
  } = match;
  if (organization === 'funds') return null;

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
      {/** <div className={classNames('sidebar-nav-item', {"sidebar-nav-item-active": showAdministration})}
       onClick={() => setShowAdministration(x => !x)}>
       <span>Administration</span>
       </div>
       {showAdministration && <div className={classNames("sidebar-nav-item", {"sidebar-nav-item-active": location.pathname === `/admin/${organization}/master-filing`})}>
        <Link to={`/admin/${organization}/master-filing`}>
          <span>Master Filing</span>
        </Link>
      </div>}* */}
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
      {/* <div
        className={`sidebar-nav-item ${location.pathname === `/admin/${organization}/investments` ? "sidebar-nav-item-active" : ""}`}>
        <ListItem component={Link} to={`/admin/${organization}/investments`} button>
          <ListItemIcon className={classes.icon}>
            <BarChartIcon/>
          </ListItemIcon>
          <ListItemText primary="Investments"/>
        </ListItem>
      </div> */}
    </div>
  );
}
