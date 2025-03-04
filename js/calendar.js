// Create the js folder and this file
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.events = [];
        this.initCalendar();
        this.loadEvents();
        
        // Set up event listeners
        document.querySelector('.prev-month').addEventListener('click', () => this.changeMonth(-1));
        document.querySelector('.next-month').addEventListener('click', () => this.changeMonth(1));
        
        // Event submission form
        document.getElementById('eventSubmissionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitEvent();
        });
    }
    
    initCalendar() {
        this.renderCalendar();
        this.updateMonthDisplay();
    }
    
    renderCalendar() {
        const grid = document.querySelector('.calendar-grid');
        grid.innerHTML = '';
        
        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day header';
            dayHeader.textContent = day;
            grid.appendChild(dayHeader);
        });
        
        // Get first day of month and total days
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before first of month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            grid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let i = 1; i <= lastDate; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            const dateNum = document.createElement('div');
            dateNum.textContent = i;
            dayCell.appendChild(dateNum);
            
            // Check for events on this day
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayEvents = this.events.filter(event => event.date === dateStr);
            
            dayEvents.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = `event ${event.type}`;
                eventDiv.textContent = event.title;
                eventDiv.title = event.description || event.title;
                dayCell.appendChild(eventDiv);
            });
            
            grid.appendChild(dayCell);
        }
    }
    
    updateMonthDisplay() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthYear = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        document.getElementById('currentMonth').textContent = monthYear;
    }
    
    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.updateMonthDisplay();
        this.renderCalendar();
    }
    
    loadEvents() {
        // Sample events - in a real app, you'd fetch these from Firebase
        this.events = [
            {
                title: 'Company Holiday',
                date: '2025-03-17',
                type: 'holiday',
                description: 'St. Patrick\'s Day'
            },
            {
                title: 'Team Meeting',
                date: '2025-03-05',
                type: 'meeting',
                description: 'Quarterly planning session'
            },
            {
                title: 'John\'s Birthday',
                date: '2025-03-12',
                type: 'birthday',
                description: 'Office celebration at 3pm'
            }
        ];
        
        this.renderCalendar();
        this.renderUpcomingEvents();
    }
    
    renderUpcomingEvents() {
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';
        
        // Sort events by date
        const sortedEvents = [...this.events].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Filter for upcoming events (today and future)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingEvents = sortedEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
        }).slice(0, 5); // Show only next 5 events
        
        if (upcomingEvents.length === 0) {
            eventsList.innerHTML = '<p>No upcoming events</p>';
            return;
        }
        
        upcomingEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'upcoming-event';
            
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
            
            eventItem.innerHTML = `
                <div class="event-date">${formattedDate}</div>
                <div class="event-title ${event.type}">${event.title}</div>
                <div class="event-description">${event.description || ''}</div>
            `;
            
            eventsList.appendChild(eventItem);
        });
    }
    
    showSubmissionModal() {
        document.getElementById('eventSubmissionModal').style.display = 'block';
    }
    
    submitEvent() {
        const title = document.getElementById('submissionTitle').value;
        const date = document.getElementById('submissionDate').value;
        const type = document.getElementById('submissionType').value;
        const description = document.getElementById('submissionDescription').value;
        
        // In a real app, you'd send this to Firebase
        alert(`Event submission received!\n\nTitle: ${title}\nDate: ${date}\nType: ${type}\n\nThank you! Your event will be reviewed by an administrator.`);
        
        // Close modal and reset form
        this.closeSubmissionModal();
    }
    
    closeSubmissionModal() {
        document.getElementById('eventSubmissionModal').style.display = 'none';
        document.getElementById('eventSubmissionForm').reset();
    }
}

// Initialize calendar when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.calendar = new Calendar();
    
    // Make closeSubmissionModal available globally
    window.closeSubmissionModal = () => window.calendar.closeSubmissionModal();
}); 