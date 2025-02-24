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

const wastewaterTariffs = { "Септик": 0, "Коллектор": 55 };

// Функция для замены запятой на точку
function parseNumber(input) {
    return parseFloat(input.replace(',', '.'));
}

// Обновление коэффициента и тарифов
function updateCalculations() {
    const year = document.getElementById('year').value;
    const floors = parseInt(document.getElementById('floors').value);
    const consumptionType = document.getElementById('consumptionType').value;
    const wastewaterType = document.getElementById('wastewaterType').value;

    // Коэффициент перевода
    const coefficient = coefficients[year][floors];
    document.getElementById('coefficient').value = coefficient;

    // Тариф отопления
    const heatingTariff = heatingTariffs[floors];
    document.getElementById('heatingTariff').value = heatingTariff;

    // Тариф расхода (ЦГВС/ГВС)
    const consumptionTariff = consumptionTariffs[consumptionType];
    document.getElementById('consumptionTariff').value = consumptionTariff;

    // Тариф сточных вод
    const wastewaterTariff = wastewaterTariffs[wastewaterType];
    document.getElementById('wastewaterTariff').value = wastewaterTariff;
}

// Обработка изменений в форме
document.getElementById('year').addEventListener('change', updateCalculations);
document.getElementById('floors').addEventListener('change', updateCalculations);
document.getElementById('consumptionType').addEventListener('change', updateCalculations);
document.getElementById('wastewaterType').addEventListener('change', updateCalculations);

// Обработка отправки формы
document.getElementById('calculationForm').addEventListener('submit', (event) => {
    event.preventDefault();

    // Получение значений из формы
    const area = parseNumber(document.getElementById('area').value);
    const coefficient = parseFloat(document.getElementById('coefficient').value);
    const heatingTariff = parseFloat(document.getElementById('heatingTariff').value);
    const consumptionValue = parseNumber(document.getElementById('consumptionValue').value);
    const consumptionTariff = parseFloat(document.getElementById('consumptionTariff').value);
    const coldWater = parseNumber(document.getElementById('coldWater').value);
    const coldWaterTariff = parseFloat(document.getElementById('coldWaterTariff').value);
    const wastewaterType = document.getElementById('wastewaterType').value;
    const wastewaterTariff = parseFloat(document.getElementById('wastewaterTariff').value);

    // Выполнение расчетов
    const heatingResult = (area * coefficient * heatingTariff).toFixed(2);
    const hotWaterResult = (consumptionValue * consumptionTariff).toFixed(2);
    const coldWaterResult = (coldWater * coldWaterTariff).toFixed(2);

    // Расчет сточных вод
    let wastewaterResult = 0;
    let wastewaterText = ''; // Текст для отображения в результатах
    if (wastewaterType === "Коллектор") {
        const totalConsumption = parseFloat(consumptionValue) + parseFloat(coldWater);
        wastewaterResult = (totalConsumption * wastewaterTariff).toFixed(2);
        wastewaterText = `(${consumptionValue} + ${coldWater}) × ${wastewaterTariff} = ${wastewaterResult} руб.`;
    }

    // Расчет итоговой суммы
    const totalResult = (
        parseFloat(heatingResult) +
        parseFloat(hotWaterResult) +
        parseFloat(coldWaterResult) +
        parseFloat(wastewaterResult)
    ).toFixed(2);

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

    // Отображение сточных вод (только если выбран Коллектор)
    const wastewaterResultElement = document.getElementById('wastewaterResult');
    if (wastewaterType === "Коллектор") {
        wastewaterResultElement.textContent = wastewaterText;
        wastewaterResultElement.parentElement.style.display = 'block'; // Показываем блок
    } else {
        wastewaterResultElement.parentElement.style.display = 'none'; // Скрываем блок
    }

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
        wastewaterType: wastewaterType,
        wastewaterTariff: wastewaterTariff,
        wastewaterResult: wastewaterResult,
        totalResult: totalResult,
    };

    // Отправка данных в Telegram
    tg.sendData(JSON.stringify(data));

    // Закрытие Web App (опционально)
    // tg.close();
});

// Инициализация расчетов при загрузке
updateCalculations();
