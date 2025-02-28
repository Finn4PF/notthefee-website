// Create the js folder and this file
const calendar = {
    currentDate: new Date(2025, 0, 1),
    events: {
        // January
        "2025-01-01": [{ title: "New Year's Day", type: "holiday" }],
        "2025-01-20": [{ title: "Martin Luther King Jr. Day", type: "holiday" }],
        "2025-01-29": [{ title: "Chinese New Year", type: "holiday" }],
        
        // February
        "2025-02-14": [{ title: "Valentine's Day", type: "holiday" }],
        "2025-02-17": [{ title: "Washington's Birthday", type: "holiday" }],
        
        // March
        "2025-03-06": [{ title: "Ash Wednesday", type: "holiday" }],
        "2025-03-17": [{ title: "St. Patrick's Day", type: "holiday" }],
        "2025-03-20": [{ title: "March Equinox", type: "holiday" }],
        
        // April
        "2025-04-01": [{ title: "April Fool's Day", type: "holiday" }],
        "2025-04-13": [{ title: "Passover", type: "holiday" }],
        "2025-04-15": [{ title: "Tax Day", type: "holiday" }],
        "2025-04-20": [{ title: "Easter Sunday", type: "holiday" }],
        "2025-04-22": [{ title: "Earth Day", type: "holiday" }],
        "2025-04-23": [{ title: "Administrative Professionals Day", type: "holiday" }],
        
        // May
        "2025-05-05": [{ title: "Cinco de Mayo", type: "holiday" }],
        "2025-05-11": [{ title: "Mother's Day", type: "holiday" }],
        "2025-05-26": [{ title: "Memorial Day", type: "holiday", description: "OFFICE CLOSED" }],
        
        // June
        "2025-06-15": [{ title: "Father's Day", type: "holiday" }],
        "2025-06-19": [{ title: "Juneteenth", type: "holiday" }],
        "2025-06-21": [{ title: "June Solstice", type: "holiday" }],
        
        // July
        "2025-07-04": [{ title: "Independence Day", type: "holiday", description: "OFFICE CLOSED" }],
        
        // September
        "2025-09-01": [{ title: "Labor Day", type: "holiday", description: "OFFICE CLOSED" }],
        "2025-09-23": [{ title: "September Equinox", type: "holiday" }],
        
        // October
        "2025-10-13": [{ title: "Columbus Day", type: "holiday" }],
        "2025-10-31": [{ title: "Halloween", type: "holiday" }],
        
        // November
        "2025-11-11": [{ title: "Veterans Day", type: "holiday" }],
        "2025-11-27": [{ title: "Thanksgiving Day", type: "holiday", description: "OFFICE CLOSED" }],
        "2025-11-28": [{ title: "Day After Thanksgiving", type: "holiday", description: "OFFICE CLOSED" }],
        
        // December
        "2025-12-24": [{ title: "Christmas Eve", type: "holiday", description: "OFFICE CLOSED" }],
        "2025-12-25": [{ title: "Christmas Day", type: "holiday", description: "OFFICE CLOSED" }],
        "2025-12-26": [{ title: "Kwanzaa Begins", type: "holiday" }],
        "2025-12-31": [{ title: "New Year's Eve", type: "holiday", description: "OFFICE CLOSED" }]
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
    },

    showSubmissionModal() {
        document.getElementById('eventSubmissionModal').style.display = 'block';
    },

    closeSubmissionModal() {
        document.getElementById('eventSubmissionModal').style.display = 'none';
    },

    handleSubmission(event) {
        event.preventDefault();
        const formData = {
            title: document.getElementById('submissionTitle').value,
            date: document.getElementById('submissionDate').value,
            type: document.getElementById('submissionType').value,
            description: document.getElementById('submissionDescription').value
        };
        
        // Store in localStorage for your review
        const submissions = JSON.parse(localStorage.getItem('event-submissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('event-submissions', JSON.stringify(submissions));
        
        this.closeSubmissionModal();
        alert('Event submitted for approval!');
    }
};

document.addEventListener('DOMContentLoaded', () => calendar.init()); 