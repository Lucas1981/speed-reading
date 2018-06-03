import FileHandler from './File';

export default {
  el: '#speed-reader',
  data: () => ({
    displayedText: "-- Where the text will be --",
    startOrStopMsg: "Start",
    isPlaying: false,
    sourceText: '',
    interval: null,
    index: 0,
    speed: 200,
    wordsPerIteration: 1,
  }),
  computed: {
    timeLeft() {
      // Number of remaining words, divided by
      let wordsLeft: number = this.sourceText.length - this.index
      let speed: number = this.speed / 1000;
      let base: number = wordsLeft * speed / 60;
      let hours: number = Math.floor(base / 60);
      let minutes: number = Math.floor(base % 60);
      let minutesAsString: string = minutes.toString();
      if(minutesAsString.length === 1) minutesAsString = '0' + minutes.toString();
      return hours + 'h:' + minutes + 'm';
    }
  },
  methods: {
    handleFile(e) {
      FileHandler.handleFile(e).then( (result) => {
        this.sourceText = result.split(/[\n\r\s]+/);
        this.updateText();
      }).catch( (err) => {
        console.log(err);
      });
    },
    updateText() {
      let batch: string = '';
      for(let i = 0; i < this.wordsPerIteration; i++) {
          batch += this.sourceText[i + this.index] + ' ';
      }
      this.displayedText = batch;
      this.index += this.wordsPerIteration;
    },
    startStop() {
      this.isPlaying = !this.isPlaying;
      this.startOrStopMsg = "Stop";

      if(this.isPlaying) {
        this.interval = setInterval(this.updateText, this.speed);
      }
      else {
        clearInterval(this.interval);
        this.startOrStopMsg = "Start";
      }
    },
    reset() {
      this.index = 0;
      this.updateText();
    }
  },
  mounted: () => {
    console.log('Hello, World!');
  }
};
