class cadInfo{
    constructor(){
        this.name = null;
        this.url = null;
        this.cadLoaded = function () { };
    }

    setName = function (value) {
        this.name = value;
      }
      
      setURL = function (value) {
        this.url = value;
      }
      
      getURL = function () {
        return this.url;
      }
      
      setCadLoaded = function (value) {
        this.cadLoaded = value;
      }

}
export default(cadInfo);