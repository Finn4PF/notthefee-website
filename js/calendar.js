// Create the js folder and this file
const calendar = {
    currentDate: new Date(),
    events: {
        "2024-01-01": [
            { title: "New Year's Day", type: "holiday" },
        ],
        "2024-01-15": [
            { title: "MLK Day", type: "holiday" },
            { title: "Team Meeting", type: "meeting" }
        ],
        // Add more events here
    },

    init() {
        this.renderCalendar();
        this.renderUpcomingEvents();
    },

    renderCalendar() {
        const grid = document.querySelector('.calendar-grid');
        grid.innerHTML = '';

        // Add day headers
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const header = document.createElement('div');
            header.className = 'header';
            header.textContent = day;
            grid.appendChild(header);
        });

        // Get first day of month and number of days
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
            
            // Add day number
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            cell.appendChild(dayNumber);

            // Add events for this day
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
        // Implementation for upcoming events
    }
};

document.addEventListener('DOMContentLoaded', () => calendar.init()); 