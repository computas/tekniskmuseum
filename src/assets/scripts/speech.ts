class Speaker {
  voice: any;

  constructor(voice) {
    // @ts-ignore
    this.voice = responsiveVoice;
    this.checkSupport();
    this.voice.setDefaultVoice(voice);
    this.voice.setTextReplacements([
      {
        searchvalue: 'human',
        newvalue: 'robot',
      },
    ]);
  }

  speak(speech) {
    this.voice.speak(speech);
  }

  setDefaultVoice(language) {
    this.voice.setDefaultVoice(language);
  }
  checkSupport() {}
}
export default new Speaker('Norwegian Male');
