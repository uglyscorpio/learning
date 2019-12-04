class vodFrameMetaData{
    constructor(){
        this.id = null;
        this.name = null;
        this.url = null; //only for testing on local filesystem    
    }

    init = function (id, name, url) {
        this.id = id;
        this.name = name;
        this.url = url;
      }
      
      end = function () {
        this.id = null;
        this.name = null;
        this.url = null; //only for testing on local filesystem
      }
      
}

export default(vodFrameMetaData);