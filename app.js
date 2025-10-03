// Car Price Prediction App JavaScript

// Application Data
const appData = {
  "car_brands": ["Toyota", "Honda", "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Ford", "Chevrolet", "Nissan", "Skoda", "Kia"],
  "cities": ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur"],
  "fuel_types": ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
  "transmission_types": ["Manual", "Automatic"],
  "owner_types": ["First Owner", "Second Owner", "Third Owner", "Fourth Owner & Above"],
  "brand_values": {
    "Toyota": 1.2,
    "Honda": 1.15,
    "BMW": 1.8,
    "Mercedes-Benz": 1.9,
    "Audi": 1.7,
    "Maruti Suzuki": 1.0,
    "Hyundai": 1.1,
    "Tata": 0.9,
    "Mahindra": 0.95,
    "Volkswagen": 1.3,
    "Ford": 1.05,
    "Chevrolet": 0.95,
    "Nissan": 1.1,
    "Skoda": 1.2,
    "Kia": 1.15
  },
  "depreciation_rates": {
    "0-2": 0.85,
    "3-5": 0.65,
    "6-8": 0.45,
    "9-12": 0.3,
    "13+": 0.2
  },
  "fuel_multipliers": {
    "Petrol": 1.0,
    "Diesel": 1.1,
    "CNG": 0.95,
    "Electric": 1.3,
    "Hybrid": 1.25
  }
};

// Base prices for different engine categories (in rupees)
const basePrices = {
  "800-1200": 400000,
  "1201-1500": 600000,
  "1501-2000": 800000,
  "2001-3000": 1200000,
  "3001+": 1800000
};

// City multipliers for different markets
const cityMultipliers = {
  "Mumbai": 1.15,
  "Delhi": 1.12,
  "Bangalore": 1.10,
  "Chennai": 1.08,
  "Kolkata": 1.05,
  "Pune": 1.08,
  "Hyderabad": 1.06,
  "Ahmedabad": 1.04,
  "Jaipur": 1.02,
  "Lucknow": 1.00,
  "Kanpur": 0.98,
  "Nagpur": 1.00
};

// Owner type multipliers
const ownerMultipliers = {
  "First Owner": 1.0,
  "Second Owner": 0.85,
  "Third Owner": 0.72,
  "Fourth Owner & Above": 0.60
};

// Condition multipliers
const conditionMultipliers = {
  "excellent": 1.1,
  "good": 1.0,
  "fair": 0.85,
  "poor": 0.65
};

// DOM Elements
let form, resultsSection, predictBtn, btnText, btnLoading;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Get DOM elements
    form = document.getElementById('carPredictionForm');
    resultsSection = document.getElementById('resultsSection');
    predictBtn = document.getElementById('predictBtn');
    btnText = predictBtn.querySelector('.btn-text');
    btnLoading = predictBtn.querySelector('.btn-loading');

    // Populate form dropdowns
    populateDropdowns();

    // Add form submit event listener
    form.addEventListener('submit', handleFormSubmit);

    // Add smooth scrolling
    addSmoothScrolling();
}

function populateDropdowns() {
    // Populate brand dropdown
    const brandSelect = document.getElementById('brand');
    appData.car_brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });

    // Populate year dropdown (1990 to current year)
    const yearSelect = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1990; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Populate fuel type dropdown
    const fuelSelect = document.getElementById('fuelType');
    appData.fuel_types.forEach(fuel => {
        const option = document.createElement('option');
        option.value = fuel;
        option.textContent = fuel;
        fuelSelect.appendChild(option);
    });

    // Populate transmission dropdown
    const transmissionSelect = document.getElementById('transmission');
    appData.transmission_types.forEach(transmission => {
        const option = document.createElement('option');
        option.value = transmission;
        option.textContent = transmission;
        transmissionSelect.appendChild(option);
    });

    // Populate owner type dropdown
    const ownerSelect = document.getElementById('ownerType');
    appData.owner_types.forEach(owner => {
        const option = document.createElement('option');
        option.value = owner;
        option.textContent = owner;
        ownerSelect.appendChild(option);
    });

    // Populate city dropdown
    const citySelect = document.getElementById('city');
    appData.cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Show loading state
    showLoadingState();

    // Get form data
    const formData = new FormData(form);
    const carData = Object.fromEntries(formData.entries());

    // Validate form data
    if (!validateFormData(carData)) {
        hideLoadingState();
        return;
    }

    // Simulate API call delay
    setTimeout(() => {
        const prediction = calculateCarPrice(carData);
        displayResults(prediction, carData);
        hideLoadingState();
        scrollToResults();
    }, 2000);
}

function validateFormData(data) {
    const requiredFields = ['brand', 'model', 'year', 'fuelType', 'transmission', 'kilometers', 'engineSize', 'ownerType', 'city', 'condition'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return false;
        }
    }

    // Validate numeric fields
    if (isNaN(data.kilometers) || data.kilometers < 0) {
        alert('Please enter a valid kilometers value');
        return false;
    }

    if (isNaN(data.engineSize) || data.engineSize < 600 || data.engineSize > 5000) {
        alert('Please enter a valid engine size (600-5000 CC)');
        return false;
    }

    return true;
}

function calculateCarPrice(data) {
    // Convert data types
    const year = parseInt(data.year);
    const kilometers = parseInt(data.kilometers);
    const engineSize = parseInt(data.engineSize);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    // Calculate base price based on engine size
    let basePrice = getBasePrice(engineSize);

    // Apply brand multiplier
    const brandMultiplier = appData.brand_values[data.brand] || 1.0;
    basePrice *= brandMultiplier;

    // Apply depreciation based on age
    const depreciationRate = getDepreciationRate(age);
    basePrice *= depreciationRate;

    // Apply fuel type multiplier
    const fuelMultiplier = appData.fuel_multipliers[data.fuelType] || 1.0;
    basePrice *= fuelMultiplier;

    // Apply owner type multiplier
    const ownerMultiplier = ownerMultipliers[data.ownerType] || 1.0;
    basePrice *= ownerMultiplier;

    // Apply city multiplier
    const cityMultiplier = cityMultipliers[data.city] || 1.0;
    basePrice *= cityMultiplier;

    // Apply condition multiplier
    const conditionMultiplier = conditionMultipliers[data.condition] || 1.0;
    basePrice *= conditionMultiplier;

    // Apply kilometers adjustment
    const kmAdjustment = getKilometersAdjustment(kilometers, age);
    basePrice *= kmAdjustment;

    // Calculate final price and range
    const finalPrice = Math.round(basePrice);
    const priceRange = {
        min: Math.round(finalPrice * 0.9),
        max: Math.round(finalPrice * 1.1)
    };

    // Calculate confidence level
    const confidence = calculateConfidence(data, age, kilometers);

    // Generate breakdown
    const breakdown = generatePriceBreakdown(data, {
        basePrice: getBasePrice(engineSize),
        brandMultiplier,
        depreciationRate,
        fuelMultiplier,
        ownerMultiplier,
        cityMultiplier,
        conditionMultiplier,
        kmAdjustment
    });

    // Generate recommendations
    const recommendations = generateRecommendations(data, finalPrice, age, kilometers);

    return {
        price: finalPrice,
        priceRange,
        confidence,
        breakdown,
        recommendations,
        marketAverage: Math.round(finalPrice * 1.05)
    };
}

function getBasePrice(engineSize) {
    if (engineSize <= 1200) return basePrices["800-1200"];
    if (engineSize <= 1500) return basePrices["1201-1500"];
    if (engineSize <= 2000) return basePrices["1501-2000"];
    if (engineSize <= 3000) return basePrices["2001-3000"];
    return basePrices["3001+"];
}

function getDepreciationRate(age) {
    if (age <= 2) return appData.depreciation_rates["0-2"];
    if (age <= 5) return appData.depreciation_rates["3-5"];
    if (age <= 8) return appData.depreciation_rates["6-8"];
    if (age <= 12) return appData.depreciation_rates["9-12"];
    return appData.depreciation_rates["13+"];
}

function getKilometersAdjustment(kilometers, age) {
    const averageKmPerYear = 12000;
    const expectedKm = age * averageKmPerYear;
    
    if (kilometers < expectedKm * 0.5) return 1.1; // Low usage premium
    if (kilometers < expectedKm * 0.8) return 1.05; // Below average usage
    if (kilometers <= expectedKm * 1.2) return 1.0; // Average usage
    if (kilometers <= expectedKm * 1.5) return 0.95; // Above average usage
    return 0.85; // High usage penalty
}

function calculateConfidence(data, age, kilometers) {
    let confidence = 80;
    
    // Adjust based on age
    if (age <= 3) confidence += 10;
    if (age > 10) confidence -= 10;
    
    // Adjust based on brand reliability
    const brandReliability = {
        "Toyota": 10, "Honda": 8, "Maruti Suzuki": 5,
        "BMW": -5, "Mercedes-Benz": -5, "Audi": -5
    };
    confidence += brandReliability[data.brand] || 0;
    
    // Adjust based on condition
    const conditionBonus = {
        "excellent": 10, "good": 5, "fair": -5, "poor": -15
    };
    confidence += conditionBonus[data.condition] || 0;
    
    return Math.min(95, Math.max(60, confidence));
}

function generatePriceBreakdown(data, multipliers) {
    return [
        {
            label: "Base Price (Engine Size)",
            value: `₹${multipliers.basePrice.toLocaleString()}`,
            impact: "baseline"
        },
        {
            label: `Brand Premium (${data.brand})`,
            value: `${((multipliers.brandMultiplier - 1) * 100).toFixed(0)}%`,
            impact: multipliers.brandMultiplier > 1 ? "positive" : "negative"
        },
        {
            label: "Age Depreciation",
            value: `${((1 - multipliers.depreciationRate) * 100).toFixed(0)}%`,
            impact: "negative"
        },
        {
            label: `Fuel Type (${data.fuelType})`,
            value: `${((multipliers.fuelMultiplier - 1) * 100).toFixed(0)}%`,
            impact: multipliers.fuelMultiplier > 1 ? "positive" : "negative"
        },
        {
            label: `Owner History (${data.ownerType})`,
            value: `${((multipliers.ownerMultiplier - 1) * 100).toFixed(0)}%`,
            impact: multipliers.ownerMultiplier > 1 ? "positive" : "negative"
        },
        {
            label: `Location (${data.city})`,
            value: `${((multipliers.cityMultiplier - 1) * 100).toFixed(0)}%`,
            impact: multipliers.cityMultiplier > 1 ? "positive" : "negative"
        },
        {
            label: `Condition (${data.condition})`,
            value: `${((multipliers.conditionMultiplier - 1) * 100).toFixed(0)}%`,
            impact: multipliers.conditionMultiplier > 1 ? "positive" : "negative"
        }
    ];
}

function generateRecommendations(data, price, age, kilometers) {
    const recommendations = [];
    
    if (age <= 3) {
        recommendations.push("Excellent resale value due to low age");
    }
    
    if (data.condition === "excellent") {
        recommendations.push("Premium pricing justified by excellent condition");
    }
    
    if (data.fuelType === "Electric" || data.fuelType === "Hybrid") {
        recommendations.push("Future-proof choice with good resale potential");
    }
    
    if (kilometers < 30000 && age >= 3) {
        recommendations.push("Low mileage adds significant value");
    }
    
    if (["Toyota", "Honda", "Maruti Suzuki"].includes(data.brand)) {
        recommendations.push("Strong brand reputation ensures stable resale value");
    }
    
    if (recommendations.length === 0) {
        recommendations.push("Fair market valuation based on current conditions");
    }
    
    return recommendations;
}

function displayResults(prediction, carData) {
    // Show results section
    resultsSection.style.display = 'block';
    
    // Update price display
    document.getElementById('predictedPrice').textContent = prediction.price.toLocaleString();
    document.getElementById('priceMin').textContent = prediction.priceRange.min.toLocaleString();
    document.getElementById('priceMax').textContent = prediction.priceRange.max.toLocaleString();
    
    // Update confidence
    document.getElementById('confidenceLevel').textContent = `${prediction.confidence}%`;
    
    // Update confidence badge color
    const confidenceBadge = document.getElementById('confidenceBadge');
    if (prediction.confidence >= 80) {
        confidenceBadge.className = 'confidence-badge confidence-high';
    } else if (prediction.confidence >= 70) {
        confidenceBadge.className = 'confidence-badge confidence-medium';
    } else {
        confidenceBadge.className = 'confidence-badge confidence-low';
    }
    
    // Update breakdown
    const breakdownContainer = document.getElementById('breakdownItems');
    breakdownContainer.innerHTML = '';
    
    prediction.breakdown.forEach(item => {
        const breakdownItem = document.createElement('div');
        breakdownItem.className = `breakdown-item breakdown-${item.impact}`;
        breakdownItem.innerHTML = `
            <span class="breakdown-label">${item.label}:</span>
            <span class="breakdown-value">${item.value}</span>
        `;
        breakdownContainer.appendChild(breakdownItem);
    });
    
    // Update market comparison
    document.getElementById('marketAverage').textContent = `₹${prediction.marketAverage.toLocaleString()}`;
    const comparison = prediction.price > prediction.marketAverage ? 'Above Average' : 
                     prediction.price < prediction.marketAverage ? 'Below Average' : 'Average';
    document.getElementById('yourCarValue').textContent = comparison;
    
    // Update recommendations
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    
    prediction.recommendations.forEach(rec => {
        const listItem = document.createElement('li');
        listItem.textContent = rec;
        recommendationsList.appendChild(listItem);
    });
}

function showLoadingState() {
    predictBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
}

function hideLoadingState() {
    predictBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
}

function scrollToResults() {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToPredict() {
    document.getElementById('predict').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    form.reset();
    resultsSection.style.display = 'none';
    document.getElementById('predict').scrollIntoView({ behavior: 'smooth' });
}

function shareResult() {
    const price = document.getElementById('predictedPrice').textContent;
    const confidence = document.getElementById('confidenceLevel').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: 'Car Price Prediction Result',
            text: `My car is valued at ₹${price} with ${confidence} confidence using CarValue Pro!`,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support native sharing
        const shareText = `My car is valued at ₹${price} with ${confidence} confidence using CarValue Pro! Check it out at ${window.location.href}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Result copied to clipboard!');
            });
        } else {
            alert('Share: ' + shareText);
        }
    }
}

function addSmoothScrolling() {
    // Add smooth scrolling to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}