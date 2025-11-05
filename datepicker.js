// Calendario simple para seleccionar fechas
class SimpleDatepicker {
    constructor(inputElement, options = {}) {
        this.input = inputElement;
        this.options = {
            format: options.format || 'dd/mm/yyyy',
            minDate: options.minDate || new Date(),
            onSelect: options.onSelect || function() {}
        };
        
        this.selectedDate = options.defaultDate || new Date();
        this.currentMonth = new Date(this.selectedDate);
        this.currentMonth.setDate(1);
        
        this.isVisible = false;
        this.datepickerEl = null;
        
        this.init();
    }
    
    init() {
        // Crear el contenedor del datepicker
        this.datepickerEl = document.createElement('div');
        this.datepickerEl.className = 'datepicker';
        this.datepickerEl.style.display = 'none';
        
        // Posicionar después del input
        this.input.parentNode.style.position = 'relative';
        this.input.parentNode.appendChild(this.datepickerEl);
        
        // Evento para mostrar/ocultar el datepicker
        this.input.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        
        // Cerrar el datepicker al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (this.isVisible && !this.datepickerEl.contains(e.target) && e.target !== this.input) {
                this.hide();
            }
        });
        
        // Actualizar el valor inicial del input
        this.updateInputValue();
    }
    
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    show() {
        this.render();
        this.datepickerEl.style.display = 'block';
        this.isVisible = true;
        
        // Posicionar el datepicker
        const inputRect = this.input.getBoundingClientRect();
        this.datepickerEl.style.position = 'absolute';
        this.datepickerEl.style.top = `${this.input.offsetHeight + 5}px`;
        this.datepickerEl.style.left = '0';
        this.datepickerEl.style.zIndex = '1000';
    }
    
    hide() {
        this.datepickerEl.style.display = 'none';
        this.isVisible = false;
    }
    
    render() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        
        // Nombres de los meses
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        // Obtener el primer día del mes y el número de días
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Crear la estructura HTML del datepicker
        let html = `
            <div class="datepicker-header">
                <button class="datepicker-prev">&lt;</button>
                <div class="datepicker-title">${monthNames[month]} ${year}</div>
                <button class="datepicker-next">&gt;</button>
            </div>
            <div class="datepicker-body">
                <div class="datepicker-weekdays">
                    <div>Do</div>
                    <div>Lu</div>
                    <div>Ma</div>
                    <div>Mi</div>
                    <div>Ju</div>
                    <div>Vi</div>
                    <div>Sa</div>
                </div>
                <div class="datepicker-days">
        `;
        
        // Ajustar el primer día (0 = Domingo, 6 = Sábado)
        let day = firstDay === 0 ? 6 : firstDay - 1;
        
        // Añadir celdas vacías para los días anteriores al primer día del mes
        for (let i = 0; i < day; i++) {
            html += '<div class="datepicker-day empty"></div>';
        }
        
        // Añadir los días del mes
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const isToday = date.getTime() === today.getTime();
            const isSelected = date.getTime() === this.selectedDate.setHours(0, 0, 0, 0);
            const isDisabled = date < this.options.minDate;
            
            html += `
                <div class="datepicker-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
                     data-date="${date.getTime()}" ${isDisabled ? 'disabled' : ''}>
                    ${i}
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        this.datepickerEl.innerHTML = html;
        
        // Añadir eventos a los botones y días
        this.datepickerEl.querySelector('.datepicker-prev').addEventListener('click', () => {
            this.prevMonth();
        });
        
        this.datepickerEl.querySelector('.datepicker-next').addEventListener('click', () => {
            this.nextMonth();
        });
        
        const dayElements = this.datepickerEl.querySelectorAll('.datepicker-day:not(.empty):not(.disabled)');
        dayElements.forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const timestamp = parseInt(dayEl.getAttribute('data-date'));
                this.selectDate(new Date(timestamp));
            });
        });
    }
    
    prevMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
        this.render();
    }
    
    nextMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
        this.render();
    }
    
    selectDate(date) {
        this.selectedDate = date;
        this.updateInputValue();
        this.hide();
        this.options.onSelect(date);
    }
    
    updateInputValue() {
        const day = this.selectedDate.getDate().toString().padStart(2, '0');
        const month = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const year = this.selectedDate.getFullYear();
        
        if (this.options.format === 'dd/mm/yyyy') {
            this.input.value = `${day}/${month}/${year}`;
        } else if (this.options.format === 'mm/dd/yyyy') {
            this.input.value = `${month}/${day}/${year}`;
        } else if (this.options.format === 'yyyy-mm-dd') {
            this.input.value = `${year}-${month}-${day}`;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Spanish locale for flatpickr
    const spanishConfig = {
        locale: {
            firstDayOfWeek: 1, // Monday
            weekdays: {
                shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
            },
            months: {
                shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            },
            rangeSeparator: ' hasta ',
            time_24hr: true
        },
        dateFormat: "d/m/Y",
        minDate: "today",
        disableMobile: "true"
    };

    // Initialize check-in date picker
    const checkinPicker = flatpickr("#checkin", {
        ...spanishConfig,
        onChange: function(selectedDates, dateStr) {
            // Update the min date of checkout to be the selected check-in date + 1 day
            if (selectedDates[0]) {
                const nextDay = new Date(selectedDates[0]);
                nextDay.setDate(nextDay.getDate() + 1);
                checkoutPicker.set('minDate', nextDay);
                
                // If checkout date is less than the new check-in date, update it
                const currentCheckout = checkoutPicker.selectedDates[0];
                if (currentCheckout && currentCheckout <= selectedDates[0]) {
                    checkoutPicker.setDate(nextDay);
                }
            }
        }
    });

    // Initialize check-out date picker
    const checkoutPicker = flatpickr("#checkout", {
        ...spanishConfig,
        minDate: new Date().fp_incr(1) // Default to tomorrow
    });

    // Hacer que los iconos de calendario también abran los datepickers
    const checkinIcon = document.querySelector('#checkin').parentElement.querySelector('.fa-calendar');
    const checkoutIcon = document.querySelector('#checkout').parentElement.querySelector('.fa-calendar');
    
    if (checkinIcon) {
        checkinIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            checkinPicker.open();
        });
        checkinIcon.style.cursor = 'pointer';
    }
    
    if (checkoutIcon) {
        checkoutIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            checkoutPicker.open();
        });
        checkoutIcon.style.cursor = 'pointer';
    }
});