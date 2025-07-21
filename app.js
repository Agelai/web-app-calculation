const tg = window.Telegram.WebApp;

// Инициализация Web App
tg.ready();

// Данные для расчета
const coefficients = {
    "после 1999": { 1: 0.0468, 2: 0.0380, 3: 0.0345, 4: 0.0283, 5: 0.0283 },
    "до 1999": { 1: 0.0468, 2: 0.0380, 3: 0.0309, 4: 0.0309, 5: 0.0283 }
};

const heatingTariffs = { 1: 1349.27, 2: 1661.77, 3: 1830.33, 4: 2043.58, 5: 2231.32 };

const consumptionTariffs = { "ЦГВС": 168.23, "ГВС": 58.97, "Нет": "-" }; // Добавлено значение "Нет"

const wastewaterTariffs = { "Септик": "-", "Коллектор": 43.10 };

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

    // Тариф расхода (ЦГВС/ГВС/Нет)
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
    const consumptionType = document.getElementById('consumptionType').value;
    const consumptionValue = parseNumber(document.getElementById('consumptionValue').value);
    const consumptionTariff = parseFloat(document.getElementById('consumptionTariff').value);
    const coldWater = parseNumber(document.getElementById('coldWater').value);
    const coldWaterTariff = parseFloat(document.getElementById('coldWaterTariff').value);
    const wastewaterType = document.getElementById('wastewaterType').value;
    const wastewaterTariff = parseFloat(document.getElementById('wastewaterTariff').value);

    // Выполнение расчетов
    const heatingResult = (area * coefficient * heatingTariff).toFixed(2);

    // Расчет горячего водоснабжения (если не выбрано "Нет" и расход не равен 0)
    let hotWaterResult = 0;
    let hotWaterText = ''; // Текст для отображения в результатах
    if (consumptionType !== "Нет" && consumptionValue !== 0) {
        hotWaterResult = (consumptionValue * consumptionTariff).toFixed(2);
        hotWaterText = `${consumptionValue} × ${consumptionTariff} = ${hotWaterResult} руб.`;
    }

    // Расчет холодного водоснабжения (если расход не равен 0)
    let coldWaterResult = 0;
    let coldWaterText = ''; // Текст для отображения в результатах
    if (coldWater !== 0) {
        coldWaterResult = (coldWater * coldWaterTariff).toFixed(2);
        coldWaterText = `${coldWater} × ${coldWaterTariff} = ${coldWaterResult} руб.`;
    }

    // Расчет сточных вод (если выбран Коллектор и сумма расходов не равна 0)
    let wastewaterResult = 0;
    let wastewaterText = ''; // Текст для отображения в результатах
    if (wastewaterType === "Коллектор" && (consumptionValue !== 0 || coldWater !== 0)) {
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

    // Отображение горячего водоснабжения (если не выбрано "Нет" и расход не равен 0)
    const hotWaterResultElement = document.getElementById('hotWaterResult');
    if (consumptionType !== "Нет" && consumptionValue !== 0) {
        hotWaterResultElement.textContent = hotWaterText;
        hotWaterResultElement.parentElement.style.display = 'block'; // Показываем блок
    } else {
        hotWaterResultElement.parentElement.style.display = 'none'; // Скрываем блок
    }

    // Отображение холодного водоснабжения (если расход не равен 0)
    const coldWaterResultElement = document.getElementById('coldWaterResult');
    if (coldWater !== 0) {
        coldWaterResultElement.textContent = coldWaterText;
        coldWaterResultElement.parentElement.style.display = 'block'; // Показываем блок
    } else {
        coldWaterResultElement.parentElement.style.display = 'none'; // Скрываем блок
    }

    // Отображение сточных вод (если выбран Коллектор и сумма расходов не равна 0)
    const wastewaterResultElement = document.getElementById('wastewaterResult');
    if (wastewaterType === "Коллектор" && (consumptionValue !== 0 || coldWater !== 0)) {
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
        consumptionType: consumptionType,
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
