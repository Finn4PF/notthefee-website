// Create the js folder and this file
const calendar = {
    currentDate: new Date(),
    events: [], // Store fetched events
    selectedCategory: 'all',
    
    holidays: {
        // US Holidays 2024
        "2024-01-01": { name: "New Year's Day", color: "#FF0000" },
        "2024-01-15": { name: "Martin Luther King Jr. Day", color: "#4B0082" },
        "2024-02-14": { name: "Valentine's Day", color: "#FF69B4" },
        "2024-03-31": { name: "Easter", color: "#FFB3BA" },
        "2024-05-27": { name: "Memorial Day", color: "#FF0000" },
        "2024-07-04": { name: "Independence Day", color: "#0000FF" },
        "2024-09-02": { name: "Labor Day", color: "#FF0000" },
        "2024-10-31": { name: "Halloween", color: "#FF7E00" },
        "2024-11-28": { name: "Thanksgiving", color: "#8B4513" },
        "2024-12-25": { name: "Christmas", color: "#00FF00" },
        
        // Jewish Holidays 2024
        "2024-03-23": { name: "Passover", color: "#0000FF" },
        "2024-04-30": { name: "Shavuot", color: "#0000FF" },
        "2024-10-02": { name: "Rosh Hashanah", color: "#0000FF" },
        "2024-10-11": { name: "Yom Kippur", color: "#0000FF" },
        "2024-10-16": { name: "Sukkot", color: "#0000FF" }
    },

    async init() {
        await this.fetchEvents();
        this.renderCalendar();
        this.setupEventListeners();
        this.renderEventsList();
    },

    async fetchEvents() {
        try {
            const eventsRef = collection(window.db, 'events');
            const q = query(eventsRef, orderBy('date'));
            const querySnapshot = await getDocs(q);
            
            this.events = [];
            querySnapshot.forEach((doc) => {
                this.events.push({ id: doc.id, ...doc.data() });
            });
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    },

    renderCalendar() {
        const grid = document.querySelector('.calendar-grid');
        const monthYear = document.querySelector('.month-view h2');
        
        // Update month/year display
        monthYear.textContent = this.currentDate.toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });

        // Clear existing grid
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
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        
        // Add empty cells for days before start of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            grid.appendChild(emptyDay);
        }

        // Add days of month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const holiday = this.getHolidayForDate(date);
            
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            if (holiday) {
                dayCell.style.borderColor = holiday.color;
                dayCell.title = holiday.name;
            }

            // Add day number
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            if (holiday) {
                dayNumber.style.color = holiday.color;
            }
            dayCell.appendChild(dayNumber);
            
            // Add holiday name if exists
            if (holiday) {
                const holidayName = document.createElement('div');
                holidayName.className = 'holiday-name';
                holidayName.textContent = holiday.name;
                holidayName.style.color = holiday.color;
                dayCell.appendChild(holidayName);
            }

            // Check for events on this day
            const todayEvents = this.getEventsForDate(date);
            
            if (todayEvents.length > 0) {
                const dotsContainer = document.createElement('div');
                dotsContainer.className = 'event-dots';
                
                // Group events by type
                const eventTypes = [...new Set(todayEvents.map(e => e.type))];
                eventTypes.forEach(type => {
                    const dot = document.createElement('span');
                    dot.className = `event-dot ${type}`;
                    dotsContainer.appendChild(dot);
                });
                
                dayCell.appendChild(dotsContainer);
            }
            
            grid.appendChild(dayCell);
        }
    },

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === date.getDate() &&
                   eventDate.getMonth() === date.getMonth() &&
                   eventDate.getFullYear() === date.getFullYear();
        });
    },

    hasEvents(date) {
        // Will implement event checking later
        return false;
    },

    setupEventListeners() {
        // Previous month button
        document.querySelector('.prev-month').addEventListener('click', () => {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        // Next month button
        document.querySelector('.next-month').addEventListener('click', () => {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Category filtering
        document.querySelectorAll('.category').forEach(cat => {
            cat.addEventListener('click', (e) => {
                document.querySelectorAll('.category').forEach(c => c.style.opacity = '0.5');
                e.target.style.opacity = '1';
                this.selectedCategory = e.target.classList[1] || 'all';
                this.renderEventsList();
                this.renderCalendar();
            });
        });

        // Day click handler
        document.querySelector('.calendar-grid').addEventListener('click', (e) => {
            const dayCell = e.target.closest('.calendar-day');
            if (dayCell && !dayCell.classList.contains('empty') && !dayCell.classList.contains('header')) {
                const day = dayCell.querySelector('.day-number').textContent;
                const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
                this.showDayDetails(date);
            }
        });
    },

    showDayDetails(date) {
        const events = this.getEventsForDate(date);
        const holiday = this.getHolidayForDate(date);
        
        const modal = document.getElementById('dayDetailsModal');
        const content = modal.querySelector('.modal-content');
        
        content.innerHTML = `
            <h3>${date.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            ${holiday ? `<div class="holiday-badge" style="color:${holiday.color}">${holiday.name}</div>` : ''}
            <div class="day-events">
                ${events.length ? events.map(event => `
                    <div class="event-item event-${event.type}">
                        <div class="event-time">${event.time || ''}</div>
                        <div class="event-title">${event.title}</div>
                        <div class="event-description">${event.description || ''}</div>
                    </div>
                `).join('') : '<p>No events scheduled</p>'}
            </div>
            <div class="modal-actions">
                <button onclick="calendar.addEventForDate('${date.toISOString()}')" class="btn-submit">Add Event</button>
                <button onclick="document.getElementById('dayDetailsModal').style.display='none'" class="btn-cancel">Close</button>
            </div>
        `;
        
        modal.style.display = 'block';
    },

    addEventForDate(dateStr) {
        document.getElementById('dayDetailsModal').style.display = 'none';
        document.getElementById('eventDate').value = dateStr.split('T')[0];
        showEventForm();
    },

    renderEventsList() {
        const eventsList = document.querySelector('.events-list');
        eventsList.innerHTML = '';

        let filteredEvents = this.events;
        
        // Apply category filter
        if (this.selectedCategory !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.type === this.selectedCategory);
        }

        // Filter future events and sort by date
        const upcomingEvents = filteredEvents
            .filter(event => new Date(event.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 10); // Show next 10 events

        if (upcomingEvents.length === 0) {
            eventsList.innerHTML = '<p>No upcoming events</p>';
            return;
        }

        upcomingEvents.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = `event-item event-${event.type}`;
            const eventDate = new Date(event.date);
            eventEl.innerHTML = `
                <div class="event-date">
                    ${eventDate.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div class="event-title">${event.title}</div>
                ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
            `;
            eventsList.appendChild(eventEl);
        });
    },

    getHolidayForDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        return this.holidays[dateStr];
    }
};

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', () => calendar.init());

// Add these functions to your existing calendar object
window.showEventForm = function() {
    document.getElementById('eventModal').style.display = 'block';
};

window.hideEventForm = function() {
    document.getElementById('eventModal').style.display = 'none';
};

window.submitEvent = async function(event) {
    event.preventDefault();
    const formData = {
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        type: document.getElementById('eventType').value,
        description: document.getElementById('eventDescription').value
    };
    
    try {
        await addDoc(collection(window.db, 'events'), formData);
        await calendar.fetchEvents();
        calendar.renderCalendar();
        calendar.renderEventsList();
        hideEventForm();
    } catch (error) {
        console.error('Error saving event:', error);
        alert('Failed to save event. Please try again.');
    }
}; 