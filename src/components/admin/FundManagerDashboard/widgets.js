import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import { Typography, Tooltip, Button } from '@material-ui/core';
import { phone, tablet } from '../../../utils/helpers'

const styles = theme => ({
	box: {
		width: "100%",
		height: "199px",
		background: "#FBFCFF 0% 0% no-repeat padding-box",
		boxShadow: "0px 3px 6px #00000029",
		border: "1px solid #8493A640",
		borderRadius: "10px",
		marginBottom: "20px",
		[theme.breakpoints.down(phone)]: {
			width: "100vw",
			minWidth: "0 !important",
			maxWidth: "none !important"
		},
	},
	boxContent: {
		padding: "16px",
	},
	boxTitle: {
		fontSize: "20px",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
	boxTitleContainer: {
		width: "100%",
		height: "71px",
		background: "#FFFFFF 0% 0% no-repeat padding-box",
		borderBottom: "1px solid #8493A640",
		borderRadius: "10px 10px 0px 0px",
		display: "flex",
		alignItems: "center",
		padding: "16px"
	},
	boxTitleText: {
		display: "flex",
		alignItems: "center",
	},
	chartBox: {
		minWidth: '430px',
		maxWidth: '49%',
		height: "450px",
		[theme.breakpoints.down(tablet)]: {
			height: "auto"
		},
	},
	chartBoxContent: {
		height: "calc(100% - 71px)",
		padding: "40px",
		display: 'flex',
		justifyContent: 'space-between',
		'& *': {
			color: theme.palette.text.secondary
		},
		[theme.breakpoints.down(tablet)]: {
			flexWrap: "wrap"
		},
	},
	dynamicBoxContent: {
		height: "calc(100% - 110px)"
	},
	dynamicHeight: {
		height: "auto"
	},
	fixedBoxContent: {
		height: "calc(100% - 71px)",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center"
	},
	flatBoxContent: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		[theme.breakpoints.down(phone)]: {
			flexWrap: "wrap",
			justifyContent: "center"
		},
	},
	infoIcon: {
		marginLeft: "0.5em"
	},
	listButton: {
		backgroundColor: "#2A2B54",
		color: "white",
		width: "100%",
		textTransform: "none"
	}
});

const getDimensions = (size) => {
	switch (size) {
		case 'full':
			return {minWidth: "100%"}
		case 'half':
			return {minWidth: '430px', maxWidth: '49%'}
		case 'third':
			return {minWidth: '430px', maxWidth: '32%'};
		case 'fourth':
			return {minWidth: '300px', maxWidth: '24%'};
		default:
			return {}
	}
}


export const SimpleBox = withStyles(styles)(({ classes,
	title,
	info,
	size,
	autoHeight,
	titleData,
	fontSize,
	buttonAction,
	buttonText,
	fullWidthContent,
	children
}) => {
  return(
		<div className={`${classes.box} ${autoHeight? classes.dynamicHeight : ''}`} style={getDimensions(size)}>
			<div className={classes.boxTitleContainer} style={{justifyContent: "space-between"}}>
				<div className={classes.boxTitleText}>
					<Typography className={classes.boxTitle} style={fontSize === "small"? {fontSize: "14px"} : {}}>{title}</Typography>
					{info &&
						<Tooltip title={info}>
							<InfoIcon className={classes.infoIcon}/>
						</Tooltip>
					}
				</div>
				<div>{titleData}</div>
			</div>
			<div className={`${classes.boxContent} ${autoHeight? classes.dynamicBoxContent : classes.fixedBoxContent}`} style={fullWidthContent? {padding: 0} : {}}>
				{children}
			</div>
			{buttonText?
				<Button variant="contained" className={classes.listButton} onClick={buttonAction}>{buttonText}</Button>
				:''
			}
		</div>
	)
})



export const ChartBox = withStyles(styles)(({ classes, title, info, children }) => {
  return(
		<div className={`${classes.box} ${classes.chartBox}`}>
			<div className={classes.boxTitleContainer}>
				<Typography className={classes.boxTitle}>{title}</Typography>
				<Tooltip title={info}>
					<InfoIcon className={classes.infoIcon}/>
				</Tooltip>
			</div>
			<div className={`${classes.boxContent} ${classes.chartBoxContent}`}>
				{children}
			</div>
		</div>
	)
})



export const FlatBox = withStyles(styles)(({ classes, title, info, children }) => {
	return(
		<div className={classes.box} style={{width: "100%", height: "auto", minHeight: "120px"}}>
			<div className={classes.boxTitleContainer} style={{height: "60px"}}>
				<Typography className={classes.boxTitle} style={{fontSize: "14px"}}>{title}</Typography>
				<Tooltip title={info}>
					<InfoIcon className={classes.infoIcon}/>
				</Tooltip>
			</div>
			<div className={`${classes.boxContent} ${classes.flatBoxContent}`}>
				{children}
			</div>
		</div>
	)
})
