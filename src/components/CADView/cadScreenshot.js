import saveAs from 'file-saver'
class cadScreenshot{
    constructor(){
        this.width = null;
        this.height = null;
        this.name = null;
        this.image = null;
        this.type = null;
        this.canvas = null;
    }

    init = function (width, height, canvas) {
        this.canvas = canvas;
        //this.name = name;
        this.width = width;
        this.height = height;
        this.type = "image/jpg";
        this.image = canvas.toDataURL(this.type, 1); //1 = 100% quality
      }
      
      save = function(fileName) {
        var saveFunction = function (data) { saveAs(data, fileName); }
        this.canvas.toBlob(saveFunction, this.type);
      }
      
      end = function () {
        this.width = null;
        this.height = null;
        this.name = null;
        this.image = null;
        this.type = null;
        this.canvas = null;
      }
      
}

export default(cadScreenshot)