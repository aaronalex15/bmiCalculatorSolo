document.addEventListener("DOMContentLoaded", () => {
  const bmiForm = document.getElementById("bmiForm");
  const resultDiv = document.getElementById("result");
  const showPreviousButton = document.getElementById("showPrevious");
  const previousResultsDiv = document.getElementById("previousResults");

  function showPreviousBmiScores(userName) {
    console.log("a");
    fetch(`http://localhost:3000/bmiRecords?userName=${userName}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("b");
        previousResultsDiv.innerHTML = ""; // Clear results
        if (data.length > 0) {
          previousResultsDiv.innerHTML = "<h2>Previous BMI Scores:</h2>";
          data.forEach((record) => {
            debugger;
            const bmiScore = record.bmi.toFixed(2);
            const date = record.date;
            previousResultsDiv.innerHTML += `<p>BMI: ${bmiScore}, Date: ${date}</p>`;
          });
        } else {
          previousResultsDiv.innerHTML =
            "<p>No previous BMI scores found for this user.</p>";
        }
      })
      .catch((error) => console.error("Error fetching BMI records:", error));
    console.log("c");
  }

  bmiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userName = document.getElementById("userName").value;
    const date = new Date();
    const currentDate = `
        ${date.getMonth() + 1} - ${date.getDate()} - ${date.getFullYear()}`;

    const weightPounds = parseFloat(
      document.getElementById("weightPounds").value
    );
    const heightFeet = parseFloat(document.getElementById("heightFeet").value);
    const heightInches = parseFloat(
      document.getElementById("heightInches").value
    );

    const heightInchesTotal = heightFeet * 12 + heightInches;

    const bmi = (weightPounds / (heightInchesTotal * heightInchesTotal)) * 703;

    resultDiv.textContent = `Your BMI is: ${bmi.toFixed(
      2
    )} | Current Date: ${currentDate}`;

    fetch("http://localhost:3000/bmiRecords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bmi: bmi, date: currentDate }),
    })
      .then(() => showPreviousBmiScores(userName))
      .catch((error) => console.error("Error creating BMI record:", error));
  });

  showPreviousButton.addEventListener("click", () => {
    const userName = document.getElementById("userName").value;
    showPreviousBmiScores(userName);
  });
});

/* For example, a person who weighs 180 lbs. and is 5 feet and 5 inches tall (65 inches total) 
would calculate their BMI in the following way: 180 x 703 = 126,540. */
