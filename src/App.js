import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { mainListItems } from './listItems';
import Title from './Title';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        Priority Scheduling
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function preventDefault(event) {
  event.preventDefault();
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  seeMore: {
    marginTop: theme.spacing(3),
  },
  depositContext: {
    flex: 1,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [open2, setOpenDialog] = React.useState(false);
  const [add_burst_time, addBurstTime] = useState(0);
  const [add_priority, addPriority] = useState(0);
  const [process_waiting, processWaiting] = React.useState([]);
  const [process_terminated, processTerminated] = React.useState([]);
  const [cpu_busy, setCPUBusy] = React.useState(false);
  const [running_process, setRunningProcess] = React.useState(0);
  const [running_bursttime, setBurstTime] = React.useState(0);
  const [running_remainingtime, setRemainingTime] = React.useState(0);
  const [process_count, addProcessCount] = useState(1);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleClose_addData = () => {
    setOpenDialog(false);
  }
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  function createData(process, burst_time, priority, status) {
    return { process, burst_time, priority, status };
  }
  
  function processing(){
    if(!process_waiting.length){
      console.log('No change!')
    }else if (process_waiting.length){
      
    }
  }
  
  function addProcess(){
    let newElement = createData(process_count, add_burst_time, add_priority, 'Waiting')
    processWaiting(oldArray => [...oldArray, newElement]);
    addProcessCount(process_count => process_count + 1)
    setOpenDialog(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
        processing();
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, !open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerClose}
            className={clsx(classes.menuButton, !open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Priority Scheduling
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerOpen}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <React.Fragment>
                  <Title>โปรเซสที่กำลังทำงาน</Title>
                  <Typography component="p" variant="h4">
                    P6
                  </Typography>
                  <Typography color="textSecondary" className={classes.depositContext}>
                    Burst time : 6
                  </Typography>
                  <Typography color="textSecondary" className={classes.depositContext}>
                    เวลาที่เหลือ : 2
                  </Typography>
                </React.Fragment>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <React.Fragment>
                  <Title>ควบคุมการทำงาน</Title>
                  <div className="app">
                    <Typography component="p" variant="h4">
                      {seconds} วินาที
                    </Typography>
                    <div className="row">
                      <Button variant="outlined" color="primary" className={`button button-primary button-primary-${isActive ? 'active' : 'inactive'}`} onClick={toggle}>
                        {isActive ? 'พัก' : 'เริ่ม'}
                      </Button>&nbsp;
                      <Button variant="outlined" color="primary" onClick={reset}>
                        รีเซ็ต
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={classes.paper}>
                <React.Fragment>
                  <Title>โปรเซสที่รอการทำงาน</Title>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>โปรเซส</TableCell>
                        <TableCell>Burst Time</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>สถานะ</TableCell>
                        <TableCell>ดำเนินการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {process_waiting.map((row) => (
                        <TableRow key={row.process}>
                          <TableCell>{'P'+row.process}</TableCell>
                          <TableCell>{row.burst_time}</TableCell>
                          <TableCell>{row.priority}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell><Link color="primary" href="#" onClick={preventDefault}>
          ยกเลิก
        </Link></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className={classes.seeMore}>
                    {/* <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link> */}
                    <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                      เพิ่มโปรเซส
                    </Button>
                    <Dialog open={open2} onClose={handleClose} aria-labelledby="form-dialog-title">
                      <DialogTitle id="form-dialog-title">เพิ่มโปรเซส</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          โปรเซส : P9
                        </DialogContentText>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="burst_time"
                          label="Burst Time"
                          type="number"
                          fullWidth
                          required
                          onChange={event => {
                            const { value } = event.target;
                            addBurstTime(value);
                          }}
                        />
                        <TextField
                          margin="dense"
                          id="priority"
                          label="Priority"
                          type="number"
                          fullWidth
                          required
                          onChange={event => {
                            const { value } = event.target;
                            addPriority(value);
                          }}
                          // defaultValue="1"
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} color="primary">
                          ยกเลิก
                        </Button>
                        <Button onClick={addProcess} color="primary">
                          เพิ่ม
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </React.Fragment>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={classes.paper}>
                <React.Fragment>
                  <Title>โปรเซสที่ทำงานเสร็จแล้ว</Title>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>โปรเซส</TableCell>
                        <TableCell>Burst Time</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>สถานะ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {process_terminated.map((row) => (
                        <TableRow key={row.process}>
                          <TableCell>{row.process}</TableCell>
                          <TableCell>{row.burst_time}</TableCell>
                          <TableCell>{row.priority}</TableCell>
                          <TableCell>{row.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className={classes.seeMore}>
                    {/* <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link> */}
                  </div>
                </React.Fragment>
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            {/* <Copyright /> */}
          </Box>
        </Container>
      </main>
    </div>
  );
}