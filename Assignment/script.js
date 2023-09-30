const fs = require('fs');

// Read the input file
const inputFile = 'employee_data.txt';

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Split the data into lines
  const lines = data.trim().split('\n');

  // Create an object to store employee data
  const employees = {};

  // Iterate over each line in the file
  lines.forEach((line) => {
    const fields = line.split('\t');
    const positionID = fields[0];
    const timeIn = fields[2];
    const timeOut = fields[3];
    const employeeName = fields[7];

    if (!employees[employeeName]) {
      employees[employeeName] = [];
    }

    employees[employeeName].push({ positionID, timeIn, timeOut });
  });

  // Define functions to check conditions
  function hasWorkedFor7ConsecutiveDays(shifts) {
    if (shifts.length < 7) return false;

    const lastSevenShifts = shifts.slice(-7);
    const dayInMillis = 24 * 60 * 60 * 1000;

    for (let i = 0; i < 6; i++) {
      const currentDate = new Date(lastSevenShifts[i].timeOut);
      const nextDate = new Date(lastSevenShifts[i + 1].timeIn);

      if (nextDate - currentDate !== dayInMillis) {
        return false;
      }
    }

    return true;
  }

  function hasLessThan10HoursBetweenShifts(shifts) {
    if (shifts.length < 2) return false;

    for (let i = 0; i < shifts.length - 1; i++) {
      const currentTimeOut = new Date(shifts[i].timeOut);
      const nextTimeIn = new Date(shifts[i + 1].timeIn);
      const timeBetweenShifts = nextTimeIn - currentTimeOut;

      if (timeBetweenShifts < 60 * 60 * 1000 ||timeBetweenShifts >= 10 * 60 * 60 * 1000) {
        return true;
      }
    }

    return false;
  }

  function hasWorkedMoreThan14HoursInAShift(shifts) {
    for (const shift of shifts) {
      const timeIn = new Date(shift.timeIn);
      const timeOut = new Date(shift.timeOut);
      const shiftHours = (timeOut - timeIn) / (60 * 60 * 1000);

      if (shiftHours > 14) {
        return true;
      }
    }

    return false;
  }

  // Iterate over employees and check conditions
  for (const employeeName in employees) {
    const shifts = employees[employeeName];

    if (hasWorkedFor7ConsecutiveDays(shifts)) {
      console.log(`Employee ${employeeName} has worked for 7 consecutive days.`);
    }

    if (hasLessThan10HoursBetweenShifts(shifts)) {
      console.log(`Employee ${employeeName} has less than 10 hours between
      shifts.`);
    }

    if (hasWorkedMoreThan14HoursInAShift(shifts)) {
      console.log(`Employee ${employeeName} has worked for more than 14 hours in a single shift.`);
    }
  }
});