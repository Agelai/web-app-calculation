const tg = window.Telegram.WebApp;

// Инициализация Web App
tg.ready();

// Данные для расчета
const coefficients = {
    "после 1999": { 1: 0.0468, 2: 0.0380, 3: 0.0345, 4: 0.0283, 5: 0.0283 },
    "до 1999": { 1: 0.0468, 2: 0.0380, 3: 0.0309, 4: 0.0309, 5: 0.0283 }
};

const heatingTariffs = { 1: 1194.04, 2: 1470.59, 3: 1619.76, 4: 1808.48, 5: 1974.62 };

const consumptionTariffs = { "ЦГВС": 148.88, "ГВС": 50.97 };

// Обновление коэффициента и тарифов
function updateCalculations() {
    const year = document.getElementById('year').value;
    const floors = parseInt(document.getElementById('floors').value);
    const consumptionType = document.getElementById('consumptionType').value;

    // Коэффициент перевода
    const coefficient = coefficients[year][floors];
    document.getElementById('coefficient').value = coefficient;

    // Тариф отопления
    const heatingTariff = heatingTariffs[floors];
    document.getElementById('heatingTariff').value = heatingTariff;

    // Тариф расхода (ЦГВС/ГВС)
    const consumptionTariff = consumptionTariffs[consumptionType];
    document.getElementById('consumptionTariff').value = consumptionTariff;
}

// Обработка изменений в форме
document.getElementById('year').addEventListener('change', updateCalculations);
document.getElementById('floors').addEventListener('change', updateCalculations);
document.getElementById('consumptionType').addEventListener('change', updateCalculations);


// Обработка отправки формы
document.getElementById('calculationForm').addEventListener('submit', (event) => {
    event.preventDefault();

    // Получение значений из формы
    const area = parseFloat(document.getElementById('area').value);
    const coefficient = parseFloat(document.getElementById('coefficient').value);
    const heatingTariff = parseFloat(document.getElementById('heatingTariff').value);
    const consumptionValue = parseFloat(document.getElementById('consumptionValue').value);
    const consumptionTariff = parseFloat(document.getElementById('consumptionTariff').value);
    const coldWater = parseFloat(document.getElementById('coldWater').value);
    const coldWaterTariff = parseFloat(document.getElementById('coldWaterTariff').value);

    // Выполнение расчетов
    const heatingResult = (area * coefficient * heatingTariff).toFixed(2);
    const hotWaterResult = (consumptionValue * consumptionTariff).toFixed(2);
    const coldWaterResult = (coldWater * coldWaterTariff).toFixed(2);

    // Расчет итоговой суммы
    const totalResult = (parseFloat(heatingResult) + parseFloat(hotWaterResult) + parseFloat(coldWaterResult)).toFixed(2);

    // Отображение промежуточных значений и результатов
    document.getElementById('areaValue').textContent = area;
    document.getElementById('coefficientValue').textContent = coefficient;
    document.getElementById('heatingTariffValue').textContent = heatingTariff;
    document.getElementById('heatingResult').textContent = heatingResult;

    document.getElementById('consumptionValueResult').textContent = consumptionValue;
    document.getElementById('consumptionTariffValue').textContent = consumptionTariff;
    document.getElementById('hotWaterResult').textContent = hotWaterResult;

    document.getElementById('coldWaterValue').textContent = coldWater;
    document.getElementById('coldWaterTariffValue').textContent = coldWaterTariff;
    document.getElementById('coldWaterResult').textContent = coldWaterResult;

    // Отображение итоговой суммы
    document.getElementById('totalResult').textContent = totalResult;

    // Показ блока с результатами
    document.getElementById('results').style.display = 'block';

    // Сбор данных для отправки в Telegram
    const data = {
        location: document.getElementById('location').value,
        year: document.getElementById('year').value,
        floors: document.getElementById('floors').value,
        coefficient: coefficient,
        heatingTariff: heatingTariff,
        area: area,
        heatingResult: heatingResult,
        consumptionType: document.getElementById('consumptionType').value,
        consumptionValue: consumptionValue,
        consumptionTariff: consumptionTariff,
        hotWaterResult: hotWaterResult,
        coldWater: coldWater,
        coldWaterTariff: coldWaterTariff,
        coldWaterResult: coldWaterResult,
        totalResult: totalResult,
    };

    // Отправка данных в Telegram
    tg.sendData(JSON.stringify(data));

    // Закрытие Web App (опционально)
    // tg.close();
});

// Инициализация расчетов при загрузке
updateCalculations();