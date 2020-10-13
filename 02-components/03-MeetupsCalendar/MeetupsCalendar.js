export const MeetupsCalendar = {
  name: 'MeetupsCalendar',

  template: `<div class="rangepicker">
    <div class="rangepicker__calendar">
      <div class="rangepicker__month-indicator">
        <div class="rangepicker__selector-controls">
          <button
            class="rangepicker__selector-control-left"
            @click="changeMonth(false)"
          ></button>
          <div>{{ localDate }}</div>
          <button
            class="rangepicker__selector-control-right"
            @click="changeMonth(true)"
          ></button>
        </div>
      </div>
      <div class="rangepicker__date-grid">
        <div
          v-for="cell in cells"
          :key="cell.id"  
          :class="['rangepicker__cell', {'rangepicker__cell_inactive': !cell.active}]"
        >
          {{ cell.day }}
          <a class="rangepicker__event"
            v-for="meetup in cell.meetups"
            :key="meetup.id"
          >{{ meetup.title }}</a>
        </div>
      </div>
    </div>
  </div>`,

  props: {
    meetups: {
      type: Array,
      required: true,
    }
  },

  data() {
    return {
      date: new Date(),
      offset: 2,
    }
  },

  computed: {
    localDate() {
      return `${this.date.toLocaleDateString(navigator.language, {
        month: 'long',
      })} ${this.date.getFullYear()}`;
    },
    startFromSunday() {
      return navigator.language !== 'ru' ? false : true; // Это другие страны живут по библии, а у нас принято начинать неделю с понедельника.
    },
    cells() {
      const dayOfWeek = this.getDayOfWeek(this.date, 1);
      const firstDayOfMonth = this.startFromSunday ? dayOfWeek + 1 : dayOfWeek || 7;
      const daysInMonth = this.getDaysInMonth(this.date);
      const multiplier = Math.ceil((firstDayOfMonth - (this.offset - 1) + daysInMonth) / 7);
      const loop = multiplier * 7;
      const startDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.offset - firstDayOfMonth);
      return Array.from({length: loop}, (v, i) => {
        let date = new Date(startDate).setDate(startDate.getDate() + i);
        return {
          id: i+1,
          day: new Date(date).getDate(),
          active: new Date(this.date).getMonth() === new Date(date).getMonth(),
          meetups: this.getMeetupsByDate(date),
        };
      });
    }
  },

  methods: {
    changeMonth(next) {
      let month = this.date.getMonth();
      if ( next ) {month++;} else {month--;};
      this.date = new Date(this.date.getFullYear(), month, 1);
    },
    getDaysInMonth(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    },
    getDayOfWeek (date, day) {
      return new Date(date.getFullYear(), date.getMonth(), day).getDay();
    },
    getMeetupsByDate(date) {
      let day = new Date(date).setHours(0,0,0,0);
      return this.meetups.filter(meetup => {
        return new Date(meetup.date).setHours(0,0,0,0) === day;
      });
    },
  },

};
