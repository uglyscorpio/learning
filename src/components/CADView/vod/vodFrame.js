class vodFrame{
    constructor(){
       //This is the list of indeces and deviations.
        this.data = null;
    //This is the list of final values with the deviations applied with the current colors.
    //This is what allows the VOD to animate so quickly. None of the processing occurs while
    //the movie is playing. All of the data calculations are done after loading the data from
    //DataServer and before the movie starts to play. These frame pointers are assigned to the Three.js
    //color array each time the frame changes during playback.
        this.colorData = null;   
    }


    init = function (metadata, pocessedData) {
        this.data = metadata;
        this.colorData = pocessedData;
      }
      
      update = function (timeToRenderFrame) {
      
      }
      
      end = function () {
        if (this.data !== null) {
          if (this.data.Deviations !== null) {
            this.data.Deviations.length = 0;
            this.data.Deviations = null;
          }
      
          this.data = null;
        }
      
        if (this.colorData !== null) {
          this.colorData.length = 0;
          this.colorData = null;
        }
      }
      
      reset = function () {
      
      }
      
      //Helper API---------------------------------------------------------
      
}  

export default(vodFrame);