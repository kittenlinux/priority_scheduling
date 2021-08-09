const process_waiting = [];
const process_terminated = [];
const running_process = 0;
const running_bursttime = 0;
const running_remaining = 0;

export const rows = [
  createData(0, 'P7', '5', '2', 'Waiting'),
  createData(1, 'P8', '3', '3', 'Waiting'),
];

export const rows2 = [
  createData(0, 'P1', '10', '5', 'Terminated'),
  createData(1, 'P2', '1', '1', 'Terminated'),
  createData(2, 'P3', '5', '3', 'Terminated'),
  createData(3, 'P4', '30', '4', 'Terminated'),
  createData(4, 'P5', '3', '2', 'Terminated'),
];

function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

function processing(){
  
}

export default function CPU() {
    return (
      console.log('eiei')
    );
  }
