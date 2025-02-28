// Create the js folder and this file
const calendar = {
    currentDate: new Date(2025, 0, 1),
    events: {
        "2025-01-01": [{ title: "New Year's Day", type: "holiday" }],
        "2025-01-20": [{ title: "MLK Day", type: "holiday" }],
        "2025-02-14": [{ title: "Valentine's Day", type: "holiday" }],
        "2025-07-04": [{ title: "Fourth of July", type: "holiday", description: "OFFICE CLOSED" }],
        "2025-12-25": [{ title: "Christmas", type: "holiday" }]
    },

    init() {
        this.renderCalendar();
        this.renderUpcomingEvents();
        this.setupEventListeners();
        this.updateMonthDisplay();
    },

    setupEventListeners() {
        document.querySelector('.prev-month').onclick = () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.updateMonthDisplay();
            this.renderCalendar();
        };

        document.querySelector('.next-month').onclick = () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.updateMonthDisplay();
            this.renderCalendar();
        };
    },

    updateMonthDisplay() {
        document.getElementById('currentMonth').textContent = 
            this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    },

    renderCalendar() {
        const grid = document.querySelector('.calendar-grid');
        grid.innerHTML = '';

        // Add weekday headers
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day header';
            header.textContent = day;
            grid.appendChild(header);
        });

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

        // Add empty cells for days before start of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            grid.appendChild(document.createElement('div'));
        }

        // Add days
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            
            const dayNum = document.createElement('div');
            dayNum.textContent = day;
            cell.appendChild(dayNum);

            const date = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            if (this.events[date]) {
                this.events[date].forEach(event => {
                    const eventDiv = document.createElement('div');
                    eventDiv.className = `event ${event.type}`;
                    eventDiv.textContent = event.title;
                    cell.appendChild(eventDiv);
                });
            }

            grid.appendChild(cell);
        }
    },

    renderUpcomingEvents() {
        const list = document.getElementById('eventsList');
        const today = new Date();
        const upcoming = Object.entries(this.events)
            .filter(([date]) => new Date(date) >= today)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .slice(0, 5);

        list.innerHTML = upcoming.map(([date, events]) => 
            events.map(event => `
                <div class="event ${event.type}">
                    <div>${new Date(date).toLocaleDateString('default', {month: 'short', day: 'numeric'})}</div>
                    <div>${event.title}</div>
                    ${event.description ? `<div>${event.description}</div>` : ''}
                </div>
            `).join('')
        ).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => calendar.init()); 