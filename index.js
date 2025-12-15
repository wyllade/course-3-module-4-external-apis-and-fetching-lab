const weatherApi = "https://api.weather.gov/alerts/active?area=";

if (typeof document !== "undefined") {
  const form = document.getElementById('alert-form');
  const stateInput = document.getElementById('state-input');
  const alertsDisplay = document.getElementById('alerts-display');
  const errorEl = document.getElementById('error-message');

  form.addEventListener('submit', event => {
    event.preventDefault();
    const state = stateInput.value.trim().toUpperCase();

    // Validate input
    if (!/^[A-Z]{2}$/.test(state)) {
      displayError("Please enter a valid 2-letter state abbreviation.");
      return;
    }

    clearAlerts();
    clearError();

    fetchWeatherAlerts(state);
  });

  function fetchWeatherAlerts(state) {
    fetch(`${weatherApi}${state}`)
      .then(response => {
        if (!response.ok) throw new Error(`Unable to fetch alerts for ${state}`);
        return response.json();
      })
      .then(data => displayAlerts(data, state))
      .catch(error => displayError(error.message));
  }

  function displayAlerts(data, state) {
    const alerts = data.features || [];
    alertsDisplay.innerHTML = `<p>Weather Alerts: ${alerts.length}</p>`;

    const ul = document.createElement('ul');
    alerts.forEach(alert => {
      const li = document.createElement('li');
      li.textContent = alert.properties.headline || "No headline available";
      ul.appendChild(li);
    });
    alertsDisplay.appendChild(ul);

    stateInput.value = "";           // Clear input
    errorEl.classList.add('hidden'); // Hide error
  }

  function displayError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }

  function clearAlerts() {
    alertsDisplay.innerHTML = "";
  }

  function clearError() {
    errorEl.textContent = "";
    errorEl.classList.add('hidden');
  }
}

// Export functions for Jest
if (typeof module !== "undefined") {
  module.exports = { fetchWeatherAlerts, displayAlerts, displayError, clearAlerts, clearError };
}
