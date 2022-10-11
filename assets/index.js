const timeDialog = document.querySelector('#time-dialog');

const successDialog = document.getElementById('sucess-dialog');
const buttonAnimation = document.getElementById('checkmark-svg');
const submitBtn = document.getElementById('submit-btn');

const multistepForm = document.getElementById('multistep-form');
const formSteps = [...multistepForm.querySelectorAll('[data-step]')];

const nextButton = [...multistepForm.querySelectorAll('[data-next-btn]')];
const navBarSteps = [...document.querySelectorAll('.navbar-step')];

const appointmentOptionsLabels = [...document.querySelectorAll('input[name="appointment-type"]')];
const appointmentOptionsInputContainers = [...document.querySelectorAll('.form-group-radio')];

const calendarBody = document.querySelector('.calendar-body');
const currentMonth = document.querySelector('#month-name');
const currentYear = document.querySelector('#year');
const today = new Date();
const todayDay = today.getDate();
const date = new Date();

const monthsArray = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const SCHEDULES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

let buttonPrevMonth;
let buttonNextMonth;
let monthIndex;

let selctedAppointmentType;
let selctedAppointmentTime;
let fullName = document.getElementById('fullName').value;
let email = '';
let description = '';

// Render Weather Card Functions and variables
const longitude = -99.1331785;
const latitude = 19.4326296;
const currentDate = new Date();
const currentDateTimestamp = currentDate.getTime();
const currentTimeAmPm =  currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

const currentTime = document.getElementById('currentTime');
const currentDeg = document.getElementById('curret-deg');
const highestTemp = document.getElementById('hi-temp');
const lowestTemp = document.getElementById('lo-temp');
const weatherIcon = document.getElementById('weather-icon');


const API_KEY = '33e210e3244afb4f2582929f61935a15';
const urlApi= `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&dt=${currentDateTimestamp}&appid=${API_KEY}&units=metric`; 

let weatherResponseJson;
let iconResponseJson;
let timesResponseJsonArray;

const getCurrentWeather = async () => {
    const response = await fetch(urlApi);
    weatherResponseJson = await response.json();
};

const renderWeather = () => {
    const currentWeatherResults = weatherResponseJson.main;
    currentTime.innerText = currentTimeAmPm;
    currentDeg.innerText = currentWeatherResults.temp;
    highestTemp.innerText = currentWeatherResults.temp_max;
    lowestTemp.innerText = currentWeatherResults.temp_min;
};

const getWeatherIcon = async () => {
    const iconResponse = await fetch('./assets/icons.json');
    iconResponseJson = await iconResponse.json();
};

const renderWeatherIcon = () => {
    const iconDescription = weatherResponseJson.weather[0].description;
    const weatherIconsArray = iconResponseJson.weatherIcons;
    const matchingIndexIconName = weatherIconsArray.findIndex(name => name.name == iconDescription);
    if (matchingIndexIconName >= 0) {
        weatherIcon.innerHTML = weatherIconsArray[matchingIndexIconName].svg
    } else {
        weatherIcon.innerHTML = weatherIconsArray[2].svg
    }
};

(async() => {
    await getCurrentWeather();
    renderWeather();
    await getWeatherIcon();
    renderWeatherIcon();
})();

//Adds event listener to radio buttons indicating the Appointment type 
//and adds the class to distinguish wich one was selected
appointmentOptionsLabels.forEach(input => {
    input.addEventListener('click', (e)=> {
        appointmentOptionsInputContainers.forEach(type => {
            let radioOptions = [...document.querySelectorAll('input[name="appointment-type"] + label')];
            radioOptions.forEach(radio => {
                radio.removeAttribute('checked');
                radio.parentElement.classList.remove('checked-radio');
            });
        });
        e.target.setAttribute('checked', true);
        e.target.parentElement.classList.add('checked-radio');
        selctedAppointmentType = e.target.value;
    })
})

let currentStep = formSteps.findIndex(step => {
    return step.classList.contains('active');
});

if (currentStep < 0) {
    currentStep = 0;
    formSteps[currentStep].classList.add('active');
    cardCurrentStep();
    navbarCurrentStep();
}

nextButton.forEach(button => {
    button.addEventListener('click', ()=> {
        currentStep += 1;
        cardCurrentStep();
        navbarCurrentStep();
        setsButtonsMoveMonth();
    });
})

function cardCurrentStep() {
    formSteps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep);
    });
}

function navbarCurrentStep() {
    navBarSteps.forEach((navbarItem, index)=> {
        navbarItem.classList.toggle('current-step', index === currentStep);
    });
}

function setsButtonsMoveMonth() {
    if(currentStep === 2){
        stepThree = document.querySelector('.form-card-container.active')
        buttonPrevMonth = stepThree.querySelector('#prev-btn');
        buttonNextMonth = stepThree.querySelector('#next-btn');
        eventListenerMoveMonths();
        renderCalendar();
        eventListenerForCalendar();
    } else {return}
}

// Render Calendar Functions and variables
const eventListenerForCalendar = () => {
    const currentMonthDaysNodeList = document.querySelectorAll('.current-month-day');
    currentMonthDays = [...currentMonthDaysNodeList];

    // Adds event listener to all days in the month to open the Time modal to select time to book
    currentMonthDays.forEach(currentMonthDay => openTimeModal(currentMonthDay));

    const nextMonthDaysNodeList = document.querySelectorAll('.next-month-day');
    nextMonthDays = [...nextMonthDaysNodeList];
    nextMonthDays.forEach( nextMonthDay => {
        buttonsMonthFunctionClickListener(nextMonthDay, 'next');
    });

    const prevMonthDaysNodeList = document.querySelectorAll('.prev-month-day');
    prevMonthDays = [...prevMonthDaysNodeList];
    prevMonthDays.forEach( prevMonthDay => {
        if (monthIndex > today.getMonth()) {
            buttonsMonthFunctionClickListener(prevMonthDay, 'prev');
        }
    })
};

function eventListenerMoveMonths() {
    buttonsMonthFunctionClickListener(buttonNextMonth, 'next');
    buttonsMonthFunctionClickListener(buttonPrevMonth, 'prev');
}

const renderCalendar = () => {
    date.setDate(1);
    monthIndex = date.getMonth();
    const year = date.getFullYear();

    const firstWeekDayIndex = date.getDay() - 1;
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const lastDayPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

    let days = '';

    currentMonth.innerText = monthsArray[monthIndex];
    currentYear.innerText = year;

    for (let i = firstWeekDayIndex; i >= 1 ; i--) {
        days += `<div class="prev-month-day">${-1 * (i - lastDayPrevMonth)}</div>`;
    }
    
    for ( let i = 1; i <= lastDay; i++) {
        if (monthIndex < today.getMonth() && year <= today.getFullYear()){
            days += `<div class="prev-month-day cursor-not-allowed">${i}</div>`;
        } else if (monthIndex == today.getMonth()){
            if(i <= today.getDate() && year == today.getFullYear()) {
                days += `<div class="prev-month-day cursor-not-allowed">${i}</div>`;
            } else {
                days += `<div class="current-month-day">${i}</div>`;
            }
        } else {
            days += `<div class="current-month-day">${i}</div>`;
        }
    }
    
    for ( let i = 1 ; i <= 42 - firstWeekDayIndex - lastDay ; i++) {
        days += `<div class="next-month-day">${i}</div>`;
        calendarBody.innerHTML = days;
    }    
    showPrevMonth();
};

function showPrevMonth () {
    if (monthIndex <= today.getMonth()) {
        buttonPrevMonth.style.visibility = "hidden";
    } else {
        buttonPrevMonth.style.visibility = "visible";
    }
}

const buttonsMonthFunctionClickListener = (button, move) => {
    button.addEventListener('click', () => {
        switch (move) {
            case 'next':
                date.setMonth(date.getMonth() + 1);
                break;
            case 'prev':
                date.setMonth(date.getMonth() - 1);
                break;
        }
        renderCalendar();
        eventListenerForCalendar();
    });
};

//render TimeSlots in Time Modal
let targetOpenModal;
let selectedTime;
let dateSelectedByUser;
let dateSelectedByUserToPrint;
const morningTagsContainer = document.querySelector('#time-tags-morning');
const eveningTagsContainer = document.querySelector('#time-tags-evening');

function openTimeModal(currentMonthDay) {
    currentMonthDay.addEventListener('click', (e)=> {
        timeDialog.showModal();
        targetOpenModal =  e.target.innerText;
        getTimesRenderTimetags();
    });
}

async function getTimesRenderTimetags() {
    await getAllTimes();
    renderTimeTags();
    eventListenerForTimeTags();
}

const getAllTimes = async () => {
    const timesResponse = await fetch('./assets/appointment-slots.json');
    const timesResponseJson = await timesResponse.json();
    timesResponseJsonArray = timesResponseJson.appointmentSlots; 
};

const renderTimeTags = () => {
    morningTagsContainer.innerHTML= ''; 
    eveningTagsContainer.innerHTML= ''; 
    for (let i = 0; i < SCHEDULES.length; i++) {
        const newTimeTag = document.createElement('div');
        newTimeTag.classList.add('time-tag');
        const monthSelected = monthIndex + 1;
        const padStartMonth= monthSelected.toLocaleString('default', { month: 'numeric' }).padStart(2, '0');
        const padStartDay= targetOpenModal.toLocaleString('default', { day: 'numeric' }).padStart(2, '0');

        dateSelectedByUser = `${date.getFullYear()}-${padStartMonth}-${padStartDay}`;
        
        const timeValue = SCHEDULES[i];
        let isAvailable = true;

        for (const dbSchedule of timesResponseJsonArray) {

            if (dbSchedule.date == dateSelectedByUser && dbSchedule.time === SCHEDULES[i]) {
                isAvailable = false;
                break;
            }
        }
        
        let timetagInnerHTML = '';
        if (isAvailable) {
            timetagInnerHTML = `
                <input type="radio" id="${timeValue}" name="appt-time" value="${timeValue}">
                <label for="${timeValue}" id="${timeValue}-label" class="time-tag-label">
                    <div class="time-icon">
                        <svg class="plus-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21V12M12 12V3M12 12H22M12 12H2" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                        <svg class="checkmark" width="24" height="24" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.2274 37.2083C17.8926 37.2073 17.5616 37.1374 17.255 37.0032C16.9484 36.8689 16.6727 36.6731 16.445 36.4279L4.57836 23.8182C4.13476 23.346 3.89713 22.7171 3.91774 22.0699C3.93835 21.4227 4.2155 20.8101 4.68823 20.367C5.16096 19.9239 5.79055 19.6866 6.43849 19.7071C7.08642 19.7277 7.69964 20.0046 8.14323 20.4768L18.203 31.184L38.7377 8.74518C38.9461 8.48597 39.2053 8.27205 39.4995 8.11656C39.7936 7.96107 40.1165 7.86729 40.4483 7.84099C40.7801 7.81469 41.1137 7.85641 41.4287 7.9636C41.7438 8.07079 42.0336 8.24119 42.2803 8.46432C42.527 8.68745 42.7254 8.9586 42.8634 9.26113C43.0014 9.56366 43.076 9.89117 43.0827 10.2236C43.0893 10.5559 43.0279 10.8862 42.9021 11.194C42.7764 11.5018 42.589 11.7806 42.3514 12.0134L20.0343 36.4035C19.8088 36.6531 19.534 36.8535 19.2273 36.992C18.9205 37.1305 18.5884 37.2042 18.2518 37.2083H18.2274Z" fill="white"/>
                        </svg>
                        <svg class="x-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.37764 3.37764C3.49705 3.25794 3.6389 3.16296 3.79507 3.09816C3.95123 3.03336 4.11865 3 4.28773 3C4.45681 3 4.62423 3.03336 4.7804 3.09816C4.93656 3.16296 5.07841 3.25794 5.19782 3.37764L12.0003 10.1827L18.8029 3.37764C18.9224 3.25813 19.0643 3.16333 19.2204 3.09864C19.3766 3.03396 19.5439 3.00067 19.7129 3.00067C19.882 3.00067 20.0493 3.03396 20.2055 3.09864C20.3616 3.16333 20.5035 3.25813 20.623 3.37764C20.7425 3.49716 20.8373 3.63904 20.902 3.7952C20.9667 3.95135 21 4.11871 21 4.28773C21 4.45675 20.9667 4.62411 20.902 4.78027C20.8373 4.93642 20.7425 5.0783 20.623 5.19782L13.8179 12.0003L20.623 18.8029C20.7425 18.9224 20.8373 19.0643 20.902 19.2204C20.9667 19.3766 21 19.5439 21 19.7129C21 19.882 20.9667 20.0493 20.902 20.2055C20.8373 20.3616 20.7425 20.5035 20.623 20.623C20.5035 20.7425 20.3616 20.8373 20.2055 20.902C20.0493 20.9667 19.882 21 19.7129 21C19.5439 21 19.3766 20.9667 19.2204 20.902C19.0643 20.8373 18.9224 20.7425 18.8029 20.623L12.0003 13.8179L5.19782 20.623C5.0783 20.7425 4.93642 20.8373 4.78027 20.902C4.62411 20.9667 4.45675 21 4.28773 21C4.11871 21 3.95135 20.9667 3.7952 20.902C3.63904 20.8373 3.49716 20.7425 3.37764 20.623C3.25813 20.5035 3.16333 20.3616 3.09864 20.2055C3.03396 20.0493 3.00067 19.882 3.00067 19.7129C3.00067 19.5439 3.03396 19.3766 3.09864 19.2204C3.16333 19.0643 3.25813 18.9224 3.37764 18.8029L10.1827 12.0003L3.37764 5.19782C3.25794 5.07841 3.16296 4.93656 3.09816 4.7804C3.03336 4.62423 3 4.45681 3 4.28773C3 4.11865 3.03336 3.95123 3.09816 3.79507C3.16296 3.6389 3.25794 3.49705 3.37764 3.37764Z" fill="white"/>
                        </svg>
                    </div>
                    <span id="possible-time">${timeValue}</span>
                </label>
            `;
        } else {
            timetagInnerHTML = `
                <input type="radio" id="${timeValue}" name="appt-time" value="${timeValue}">
                <label for="${timeValue}" id="${timeValue}-label" class="disabled time-tag-label">
                    <div class="time-icon">
                        <svg class="plus-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21V12M12 12V3M12 12H22M12 12H2" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                        <svg class="checkmark" width="24" height="24" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.2274 37.2083C17.8926 37.2073 17.5616 37.1374 17.255 37.0032C16.9484 36.8689 16.6727 36.6731 16.445 36.4279L4.57836 23.8182C4.13476 23.346 3.89713 22.7171 3.91774 22.0699C3.93835 21.4227 4.2155 20.8101 4.68823 20.367C5.16096 19.9239 5.79055 19.6866 6.43849 19.7071C7.08642 19.7277 7.69964 20.0046 8.14323 20.4768L18.203 31.184L38.7377 8.74518C38.9461 8.48597 39.2053 8.27205 39.4995 8.11656C39.7936 7.96107 40.1165 7.86729 40.4483 7.84099C40.7801 7.81469 41.1137 7.85641 41.4287 7.9636C41.7438 8.07079 42.0336 8.24119 42.2803 8.46432C42.527 8.68745 42.7254 8.9586 42.8634 9.26113C43.0014 9.56366 43.076 9.89117 43.0827 10.2236C43.0893 10.5559 43.0279 10.8862 42.9021 11.194C42.7764 11.5018 42.589 11.7806 42.3514 12.0134L20.0343 36.4035C19.8088 36.6531 19.534 36.8535 19.2273 36.992C18.9205 37.1305 18.5884 37.2042 18.2518 37.2083H18.2274Z" fill="white"/>
                        </svg>
                        <svg class="x-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.37764 3.37764C3.49705 3.25794 3.6389 3.16296 3.79507 3.09816C3.95123 3.03336 4.11865 3 4.28773 3C4.45681 3 4.62423 3.03336 4.7804 3.09816C4.93656 3.16296 5.07841 3.25794 5.19782 3.37764L12.0003 10.1827L18.8029 3.37764C18.9224 3.25813 19.0643 3.16333 19.2204 3.09864C19.3766 3.03396 19.5439 3.00067 19.7129 3.00067C19.882 3.00067 20.0493 3.03396 20.2055 3.09864C20.3616 3.16333 20.5035 3.25813 20.623 3.37764C20.7425 3.49716 20.8373 3.63904 20.902 3.7952C20.9667 3.95135 21 4.11871 21 4.28773C21 4.45675 20.9667 4.62411 20.902 4.78027C20.8373 4.93642 20.7425 5.0783 20.623 5.19782L13.8179 12.0003L20.623 18.8029C20.7425 18.9224 20.8373 19.0643 20.902 19.2204C20.9667 19.3766 21 19.5439 21 19.7129C21 19.882 20.9667 20.0493 20.902 20.2055C20.8373 20.3616 20.7425 20.5035 20.623 20.623C20.5035 20.7425 20.3616 20.8373 20.2055 20.902C20.0493 20.9667 19.882 21 19.7129 21C19.5439 21 19.3766 20.9667 19.2204 20.902C19.0643 20.8373 18.9224 20.7425 18.8029 20.623L12.0003 13.8179L5.19782 20.623C5.0783 20.7425 4.93642 20.8373 4.78027 20.902C4.62411 20.9667 4.45675 21 4.28773 21C4.11871 21 3.95135 20.9667 3.7952 20.902C3.63904 20.8373 3.49716 20.7425 3.37764 20.623C3.25813 20.5035 3.16333 20.3616 3.09864 20.2055C3.03396 20.0493 3.00067 19.882 3.00067 19.7129C3.00067 19.5439 3.03396 19.3766 3.09864 19.2204C3.16333 19.0643 3.25813 18.9224 3.37764 18.8029L10.1827 12.0003L3.37764 5.19782C3.25794 5.07841 3.16296 4.93656 3.09816 4.7804C3.03336 4.62423 3 4.45681 3 4.28773C3 4.11865 3.03336 3.95123 3.09816 3.79507C3.16296 3.6389 3.25794 3.49705 3.37764 3.37764Z" fill="white"/>
                        </svg>
                    </div>
                    <span id="possible-time">${timeValue}</span>
                </label>
            `;
        }

        const timeHour = timeValue.slice(0, 2);
        newTimeTag.innerHTML = timetagInnerHTML;
        if(timeHour <= 12) {
            morningTagsContainer.appendChild(newTimeTag);
        } else {
            eveningTagsContainer.appendChild(newTimeTag);
        }   
    }
}

let selectedTimeTag;
function eventListenerForTimeTags() {
    const timeTagsInputs = document.querySelectorAll('input[name="appt-time"]');
    for (let i = 0; i < timeTagsInputs.length; i++) {
        timeTagsInputs[i].addEventListener('click', (e)=> {
            for (let j = 0; j < timeTagsInputs.length; j++) {
                timeTagsInputs[j].nextElementSibling.classList.remove('checked');
            }
            timeTagsInputs[i].classList.remove('checked');
            if(timeTagsInputs[i].checked){
                selectedTimeTag = timeTagsInputs[i].value;
                if (!timeTagsInputs[i].nextElementSibling.classList.contains('disabled')) {
                    timeTagsInputs[i].nextElementSibling.classList.add('checked');
                }
            }
            insertSelectedDataToSuccesMsg();
            forecastWeather();
        })
        
    }
}

//About the Success Modal

submitBtn.addEventListener('click', (e)=> {
    e.preventDefault();
    submitBtn.style.pointerEvents = 'none';
    submitBtn.classList.add('animating');
    buttonAnimation.addEventListener('animationend', () => {
        successDialog.showModal();
    })
});

//Inserting Obtained Data in form
function insertSelectedDataToSuccesMsg() {
    selectedDateTimestamp = `${dateSelectedByUser}T${selectedTimeTag}`;
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateSelectedByUserToPrint = new Date(selectedDateTimestamp); 
    const fullDateSuccessMessage = document.getElementById('full-date');
    const timeSucessMessage = document.getElementById('time');
    fullDateSuccessMessage.innerText = dateSelectedByUserToPrint.toLocaleDateString("en-US", dateOptions);
    timeSucessMessage.innerText = selectedTimeTag;
}

//Gets and renders forcast for selected Date
let urlApiForecast;
let weatherForecastResponseJson;
function timeFormatToTimestamp() {
    let timestampForForecast = new Date(selectedDateTimestamp).getTime();
    urlApiForecast = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&dt=${timestampForForecast}&appid=${API_KEY}&units=metric`; 
}

async function getWeatherForecast() {
    const responseForecast = await fetch(urlApiForecast);
    weatherForecastResponseJson = await responseForecast.json();
}

const renderForecastWeather = () => {
    const weatherSuggestionMessage = document.getElementById('weather-suggestion-message');
    weatherSuggestionMessage.innerHTML = `Take your precautions.<br>It's going to be ${weatherForecastResponseJson.main.temp}°C,<br>with ${weatherForecastResponseJson.weather[0].description}`;
};

async function forecastWeather() {
    timeFormatToTimestamp();
    await getWeatherForecast();
    renderForecastWeather();
}

const doneButton = document.getElementById('done');
doneButton.addEventListener('click', () => {
    window.location.reload();
})