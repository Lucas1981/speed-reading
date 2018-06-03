import FileHandler from './File';
import GutenbergAPI from './GutenbergAPI';

export default {
  el: '#speed-reader',
  data: () => ({
    displayedText: "-- Where the text will be --",
    startOrStopMsg: "Start",
    isPlaying: false,
    isDynamic: false,
    sourceText: '',
    timeout: <any>null,
    index: 0,
    slideIndexProxy: 0,
    wpm: 350,
    selectedFile: "",
    selectedGutenbergFile: "",
    wordsPerIteration: 1,
    gutenberg: <any>null,
  }),
  computed: {
    speed(): number {
      /* Convert wpm to a corresponding number of ms */
      let speed = 1 / (this.wpm / 60) * 1000;
      return speed;
    },
    timeLeft(): string {
      // Number of remaining words, divided by
      let iterationsLeft: number = (this.sourceText.length - this.index) / (+this.wordsPerIteration)
      let speed: number = this.speed / 1000;
      let base: number = iterationsLeft * speed / 60;
      let hours: number = Math.floor(base / 60);
      let minutes: number = Math.floor(base % 60);
      let minutesAsString: string = minutes.toString();
      if(minutesAsString.length === 1) minutesAsString = '0' + minutes.toString();
      return hours + 'h:' + minutes + 'm';
    }
  },
  methods: {
    selectFile(): void {
      GutenbergAPI.getFile(this.selectedGutenbergFile).then( (result: any) => {
        console.log(result);
      });
    },
    handleFile(e: any): void {
      FileHandler.handleFile(e).then( (result: string) => {
        this.sourceText = result.split(/[\n\r\s]+/);
        this.updateText();
      }).catch( (err) => {
        console.log(err);
      });
    },
    updateTextAndSetTimeout() {
      let factor: number = 0;

      this.updateText();
      factor = this.displayedText.length - 1; /* Compensate for trailing whitespace */

      this.timeout = setTimeout(
        this.updateTextAndSetTimeout,
        this.calculateDynamicInterval(factor, this.speed)
      );
    },
    updateText(): void {
      let batch: string = '';
      for(let i = 0; (i < (+this.wordsPerIteration) && i + this.index < this.sourceText.length); i++) {
          batch += this.sourceText[i + this.index] + ' ';
      }
      this.displayedText = batch;
      this.index += (+this.wordsPerIteration);
      this.slideIndexProxy = this.index;
    },
    startStop(): void {
      this.isPlaying = !this.isPlaying;
      this.startOrStopMsg = (this.isPlaying ?  "Stop" : "Start");

      if(this.isPlaying) {
        this.updateTextAndSetTimeout();
      }
      else {
        clearTimeout(this.timeout);
      }
    },
    correctIndex() {
      this.index = Math.round(this.slideIndexProxy);
      this.updateText();
    },
    calculateDynamicInterval(factor: number, speed: number): number {
      const maxLength = 4;
      const min = 0.6;
      const range = 1 - min;
      const step = range / maxLength;

      if(!this.isDynamic || factor > maxLength || factor < 1) {
        return speed;
      }
      else {
        return speed * (min + (step * (factor - 1) ) );
      }
    },
    stop() {
      if(this.isPlaying) this.startStop();
    },
    reset(): void {
      this.index = 0;
      this.updateText();
    }
  },
  mounted() {
    this.gutenberg = GutenbergAPI.getBookMap();
  }
};
