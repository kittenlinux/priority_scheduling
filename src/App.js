import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import Title from './Title';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1,
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
    height: 300,
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

  const [process_new, processNew] = useState([]);
  const [process_ready, processReady] = useState([]);
  const [process_terminated, processTerminated] = useState([]);

  const [cpu_busy, setCPUBusy] = useState(false);
  const [running_priority, setRunningPriority] = useState(0);
  const [running_process, setRunningProcess] = useState(0);
  const [running_bursttime, setBurstTime] = useState(0);
  const [running_remainingtime, setRemainingTime] = useState(0);

  const [io1_busy, setIO1Busy] = useState(false);
  const [io1_process, setIO1Process] = useState(0);

  const [io2_busy, setIO2Busy] = useState(false);
  const [io2_process, setIO2Process] = useState(0);

  const [process_count, addProcessCount] = useState(1);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  // ???????????????????????????/?????????
  function toggle() {
    setIsActive(!isActive);
  }
  // ??????????????????????????????
  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  function createData(process, burst_time, priority, status) {
    return { process, burst_time, priority, status };
  }
  function createData_Ready(process, burst_time, priority, status, remaining_time) {
    return { process, burst_time, priority, status, remaining_time };
  }
  // ????????????????????????????????????
  function processing() {
    let max_processready = 5;
    if (process_ready.length < max_processready && process_new.length > 0) {
      let max;
      if (process_new.length < max_processready) {
        if (process_new.length > max_processready - process_ready.length) {
          max = max_processready - process_ready.length
        } else if (process_new.length < max_processready - process_ready.length) {
          max = process_new.length
        } else if (process_new.length === max_processready - process_ready.length) {
          max = process_new.length
        }
      } else if (process_new.length >= max_processready) {
        if (process_ready.length < max_processready) {
          max = max_processready - process_ready.length
        } else if (process_ready.length === max_processready) {
          max = 0
        }
      }

      let temp_array = Array.from(process_new);
      for (let i = 0; i < max; ++i) {
        let temp = temp_array[0];
        let newElement = createData_Ready(temp.process, temp.burst_time, temp.priority, 'Ready', temp.burst_time)
        processReady(oldArray => [...oldArray, newElement]);
        temp_array.reverse()
        temp_array.pop()
        temp_array.reverse()
      }
      processNew(temp_array);
    }
    if (!cpu_busy && !process_ready.length) {
      // setIsActive(false);
    } else if (cpu_busy && running_remainingtime === 1) {
      // ????????????????????????????????????????????????????????????????????????
      let newElement = createData(running_process, running_bursttime, running_priority, 'Terminated')
      processTerminated(oldArray => [...oldArray, newElement]);
      if (process_ready.filter((item) => item.status !== 'Waiting').length) {
        prioritySelect();
      } else if (!process_ready.filter((item) => item.status !== 'Waiting').length) {
        setCPUBusy(false);
        // setIsActive(false);
      }
    } else if (cpu_busy && running_remainingtime > 0) {
      setRemainingTime(remaining_time => remaining_time - 1);
    } else if (!cpu_busy && process_ready.filter((item) => item.status !== 'Waiting').length) {
      // ??????????????????????????????????????? ???????????????????????????????????????????????????????????????????????????
      prioritySelect();
    }
  }
  function terminate_current_process() {
    let newElement = createData(running_process, running_bursttime, running_priority, 'Terminated')
    processTerminated(oldArray => [...oldArray, newElement]);
    setCPUBusy(false);
  }
  function prioritySelect() {
    let temp = Array.from(process_ready.filter((item) => item.status !== 'Waiting'));
    temp.sort((a, b) => {
      return a.priority - b.priority;
    });
    let temp1 = temp[0];
    setCPUBusy(true);
    setRunningProcess(temp1.process);
    setRunningPriority(temp1.priority);
    setBurstTime(temp1.burst_time);
    setRemainingTime(temp1.remaining_time);
    processReady(process_ready.filter((item) => item.process !== temp1.process));
  }
  //?????????????????????????????????????????????????????????????????????????????????????????????
  function addProcess() {
    let min_bursttime = 1
    let max_bursttime = 10
    let min_priority = 1
    let max_priority = 10

    let add_bursttime = Math.floor(Math.random() * (max_bursttime - min_bursttime + 1) + min_bursttime)
    let add_priority = Math.floor(Math.random() * (max_priority - min_priority + 1) + min_priority)

    let newElement = createData(process_count, add_bursttime, add_priority, 'New')
    processNew(oldArray => [...oldArray, newElement]);
    addProcessCount(process_count => process_count + 1);
  }
  //????????????????????????????????????????????????????????????????????????????????????????????????
  const removeProcess = (process) => {
    processNew(process_new.filter((item) => item.process !== process));
  }
  function usingIO1_runningProcess() {
    setIO1Busy(true);
    setIO1Process(running_process);
    setCPUBusy(false);
    let newElement = createData_Ready(running_process, running_bursttime, running_priority, 'Waiting', running_remainingtime)
    processReady(oldArray => [...oldArray, newElement]);
  }
  function usingIO2_runningProcess() {
    setIO2Busy(true);
    setIO2Process(running_process);
    setCPUBusy(false);
    let newElement = createData_Ready(running_process, running_bursttime, running_priority, 'Waiting', running_remainingtime)
    processReady(oldArray => [...oldArray, newElement]);
  }
  const usingIO1selectedProcess = (process) => {
    let temp1 = process_ready.filter((item) => item.process === process)
    setIO1Busy(true);
    setIO1Process(temp1[0].process);
    processReady(process_ready.map(x => {
      if (x.process !== process) return x
      return { ...x, status: 'Waiting' }
    }))
  }
  const usingIO2selectedProcess = (process) => {
    let temp1 = process_ready.filter((item) => item.process === process)
    setIO2Busy(true);
    setIO2Process(temp1[0].process);
    processReady(process_ready.map(x => {
      if (x.process !== process) return x
      return { ...x, status: 'Waiting' }
    }))
  }
  function unloadIO1() {
    setIO1Busy(false);
    setIO1Process(0);
    processReady(process_ready.map(x => {
      if (x.process !== io1_process) return x
      return { ...x, status: 'Ready' }
    }))
  }
  function unloadIO2() {
    setIO2Busy(false);
    setIO2Process(0);
    processReady(process_ready.map(x => {
      if (x.process !== io2_process) return x
      return { ...x, status: 'Ready' }
    }))
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        processing();
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, false && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Priority Scheduling
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {/* ????????????????????????????????????????????????????????? */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <React.Fragment>
                  <Title>?????????????????????????????????????????????????????????</Title>
                  <Typography component="p" variant="h4">
                    {cpu_busy ? 'P' + running_process : '????????????'}
                  </Typography>
                  <Typography color="textSecondary" className={classes.depositContext}>
                    Burst time : {cpu_busy ? running_bursttime : 'N/A'}
                  </Typography>
                  <Typography color="textSecondary" className={classes.depositContext}>
                    ???????????????????????????????????? : {cpu_busy ? running_remainingtime : 'N/A'}
                  </Typography>
                  <Typography color="textSecondary" className={classes.depositContext}>
                    Priority : {cpu_busy ? running_priority : 'N/A'}
                  </Typography>
                  <Button variant="outlined" color="primary" disabled={!cpu_busy || io1_busy} onClick={usingIO1_runningProcess}>
                    ??????????????????????????????????????????
                  </Button>
                  <Button variant="outlined" color="primary" disabled={!cpu_busy || io2_busy} onClick={usingIO2_runningProcess}>
                    ?????????????????????????????????????????????
                  </Button>
                  <Button variant="outlined" color="primary" onClick={terminate_current_process} disabled={!cpu_busy}>
                    ??????????????????????????????
                  </Button>
                </React.Fragment>
              </Paper>
            </Grid>
            {/* ?????????????????????????????????????????? */}
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <React.Fragment>
                  <Title>??????????????????????????????????????????</Title>
                  <div className="app">
                    <Typography component="p" variant="h4">
                      {seconds} ??????????????????
                    </Typography>
                    <div className="row">
                      <Button variant="outlined" color="primary" className={`button button-primary button-primary-${isActive ? 'active' : 'inactive'}`} onClick={toggle}>
                        {isActive ? '?????????' : '???????????????'}
                      </Button>&nbsp;
                      <Button variant="outlined" color="primary" onClick={reset}>
                        ??????????????????
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <React.Fragment>
                  <Title>?????????????????????????????????</Title>
                  <div className="app">
                    <Typography component="p" variant="h4">
                      {io1_busy ? 'P' + io1_process : '????????????'}
                    </Typography>
                    <div className="row">
                      <Button variant="outlined" color="primary" onClick={unloadIO1} disabled={!io1_busy}>
                        ??????????????????????????????
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <Paper className={fixedHeightPaper}>
                <React.Fragment>
                  <Title>????????????????????????????????????</Title>
                  <div className="app">
                    <Typography component="p" variant="h4">
                      {io2_busy ? 'P' + io2_process : '????????????'}
                    </Typography>
                    <div className="row">
                      <Button variant="outlined" color="primary" onClick={unloadIO2} disabled={!io2_busy}>
                        ??????????????????????????????
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              </Paper>
            </Grid>
            {/* ????????????????????????????????????????????????????????? */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={classes.paper}>
                <React.Fragment>
                  <Title>?????????????????????????????????????????????????????????</Title>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>??????????????????</TableCell>
                        <TableCell>Burst Time</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>???????????????</TableCell>
                        <TableCell>???????????????????????????</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {process_ready.map((row) => (
                        <TableRow key={row.process}>
                          <TableCell>{'P' + row.process}</TableCell>
                          <TableCell>{row.burst_time}</TableCell>
                          <TableCell>{row.priority}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell><Button variant="outlined" color="primary" disabled={io1_busy || io1_process === row.process || io2_process === row.process} onClick={(e) => usingIO1selectedProcess(row.process, e)}>
                            ??????????????????????????????????????????
                          </Button>&nbsp;<Button variant="outlined" color="primary" disabled={io2_busy || io1_process === row.process || io2_process === row.process} onClick={(e) => usingIO2selectedProcess(row.process, e)}>
                              ?????????????????????????????????????????????
                            </Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </React.Fragment>
              </Paper>
            </Grid>
            {/* ???????????????????????????????????????????????????????????????????????? */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={classes.paper}>
                <React.Fragment>
                  <Title>????????????????????????????????????????????????????????????????????????</Title>
                  <Button variant="outlined" color="primary" onClick={addProcess}>
                    ?????????????????????????????????
                  </Button>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>??????????????????</TableCell>
                        <TableCell>Burst Time</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>???????????????</TableCell>
                        <TableCell>???????????????????????????</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {process_new.map((row) => (
                        <TableRow key={row.process}>
                          <TableCell>{'P' + row.process}</TableCell>
                          <TableCell>{row.burst_time}</TableCell>
                          <TableCell>{row.priority}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell><Button variant="outlined" color="primary" onClick={(e) => removeProcess(row.process, e)}>
                            ??????????????????
                          </Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {/* <div className={classes.seeMore}>

                  </div> */}
                </React.Fragment>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Paper className={classes.paper}>
                <React.Fragment>
                  <Title>?????????????????????????????????????????????????????????????????????</Title>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>??????????????????</TableCell>
                        <TableCell>Burst Time</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>???????????????</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {process_terminated.map((row) => (
                        <TableRow key={row.process}>
                          <TableCell>{'P' + row.process}</TableCell>
                          <TableCell>{row.burst_time}</TableCell>
                          <TableCell>{row.priority}</TableCell>
                          <TableCell>{row.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </React.Fragment>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}