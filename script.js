document.addEventListener('DOMContentLoaded', function() {
  let timerInterval;
  let isTimerRunning = true;
  let pointsArray = []; // Array to store points

  // Function to update the points list in the HTML
  function updatePointsList() {
    const pointsList = document.getElementById('pointsList');
    pointsList.innerHTML = ''; // Clear existing list

    pointsArray.forEach(point => {
      const listItem = document.createElement('li');
      listItem.textContent = `Point: ${point}`;
      pointsList.appendChild(listItem);
    });
  }

  // Function to save points to the array and update the list
  function savePoints(points) {
    pointsArray.push(points);
    updatePointsList();
  }

  // Function to update the timer
  function updateTimer() {
    let seconds = localStorage.getItem('timerSeconds') || 120;
    const timerElement = document.getElementById('timer');

    timerInterval = setInterval(() => {
      seconds--;
      if (seconds >= 0) {
        timerElement.textContent = seconds;
        localStorage.setItem('timerSeconds', seconds);
      } else {
        clearInterval(timerInterval);
        localStorage.removeItem('timerSeconds');
        console.log('Session ended.');
      }
    }, 1000);
  }

  // Initial call to updateTimer
  updateTimer();

  // Event listener for the reset button
  const resetButton = document.getElementById('resetButton');
  resetButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    let seconds = 120;
    const timerElement = document.getElementById('timer');
    timerElement.textContent = seconds;
    localStorage.removeItem('timerSeconds');
    console.log('Timer reset and paused.');
    // Resetting timerInterval variable
    timerInterval = null;
    location.reload();
  });

  // Event listener for the pause button
  const pauseButton = document.getElementById('pauseSession');
  pauseButton.addEventListener('click', function() {
    clearInterval(timerInterval);
    console.log('Timer paused.');
    document.getElementById('timer').classList.add('pause');
    isTimerRunning = false;
  });

  // Event listener for the start button
  const startButton = document.getElementById('startSession');
  startButton.addEventListener('click', function() {
    console.log('Timer started.');
    document.getElementById('timer').classList.remove('pause');
    isTimerRunning = true;
    updateTimer();
  });

  // Event listeners for circles
  const circles = document.querySelectorAll('.ring');
  let lastClickedId = null;
  let debounceTimeout;
  const beepSound = document.getElementById('beepSound');

  circles.forEach(circle => {
    circle.addEventListener('mouseenter', function(event) {
      const hoveredId = event.target.id;
      this.classList.add('hovered');
      removeLowerHoveredIds(hoveredId);
    });

    circle.addEventListener('mouseleave', function() {
      removeAndAddHovered();
    });

    circle.addEventListener('click', function(event) {
      if (isTimerRunning) {
        beepSound.currentTime = 0;
        beepSound.play();
        debounceTimeout = setTimeout(() => {
          lastClickedId = null;
        }, 1000);

        const clickedId = event.target.id;
        if (lastClickedId !== clickedId) {
          lastClickedId = clickedId;
          if (debounceTimeout) {
            clearTimeout(debounceTimeout);
          }
          if (this.classList.contains('center')) {
            // alert('Clicked on center');
          } else {
            if (clickedId == '') {
              alert(`You have 8 points`);
              savePoints(8);
            } else {
              for (let i = 1; i <= 6; i++) {
                if (clickedId === document.getElementById(`circle${i}`).id) {
                  alert(`You have ${i} points`);
                  savePoints(i);
                  document.getElementById(`circle${i}`).classList.add('clicked');
                }
              }
            }
          }
          debounceTimeout = setTimeout(() => {
            lastClickedId = null;
          }, 1000);
        }
      } else {
        alert('Timer is paused');
      }
    });
  });

  // Function to remove lower hovered IDs
  function removeLowerHoveredIds(id) {
    const idNumber = parseInt(id.replace('circle', ''), 10);

    for (let i = 1; i < idNumber; i++) {
      const elementToRemove = document.getElementById(`circle${i}`);
      if (elementToRemove) {
        elementToRemove.classList.remove('hovered');
      }
    }
  }

  // Function to remove and add hovered elements
  function removeAndAddHovered() {
    let id;
    let hovered = document.querySelectorAll('.hovered');

    hovered.forEach(element => {
      id = element.id;
      element.classList.remove('hovered');
    });

    for (let i = 1; i <= 6; i++) {
      if (id === document.getElementById(`circle${i}`).id) {
        const newID = `circle${i - 1}`;
        const elementToHover = document.getElementById(newID);
        if (elementToHover) {
          elementToHover.classList.add('hovered');
        }
      }
    }
  }
})
