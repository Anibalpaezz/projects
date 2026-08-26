document.getElementById('convertBtn').addEventListener('click', () => {
    let convertedTemperature;

    const fromUnitSelect = document.getElementById('fromUnit');
    const selectedFromUnit = fromUnitSelect.value;

    const toUnitSelect = document.getElementById('toUnit');
    const selectedToUnit = toUnitSelect.value;

    const temperatureInput = document.getElementById('temperature').value;
    const temperature = parseFloat(temperatureInput);
    if (isNaN(temperature)) {
        alert('Please enter a valid number for temperature.');
        return;
    }
    else if (selectedFromUnit === selectedToUnit) {
        alert('Please select different units for conversion.');
        return;
    } else {
        // Perform the conversion
        switch (selectedToUnit) {
            case 'celsius':
                convertedTemperature = convertToCelsius(temperature, selectedFromUnit);
                break;
            case 'fahrenheit':
                convertedTemperature = convertToFahrenheit(temperature, selectedFromUnit);
                break;
            case 'kelvin':
                convertedTemperature = convertToKelvin(temperature, selectedFromUnit);
                break;
        }
        document.getElementById('result').innerText = convertedTemperature.toFixed(2);
    }
});

function convertToCelsius(temperature, fromUnit) {
    switch (fromUnit) {
        case 'fahrenheit':
            return (temperature - 32) * 5 / 9;
        case 'kelvin':
            return temperature - 273.15;
        default:
            return temperature; // If it's already in Celsius
    }
}

function convertToFahrenheit(temperature, fromUnit) {
    switch (fromUnit) {
        case 'celsius':
            return (temperature * 9 / 5) + 32;
        case 'kelvin':
            return (temperature - 273.15) * 9 / 5 + 32;
        default:
            return temperature; // If it's already in Fahrenheit
    }
}

function convertToKelvin(temperature, fromUnit) {
    switch (fromUnit) {
        case 'celsius':
            return temperature + 273.15;
        case 'fahrenheit':
            return (temperature - 32) * 5 / 9 + 273.15;
        default:
            return temperature; // If it's already in Kelvin
    }
}
