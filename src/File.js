export default class FileHandler {

  constructor() {

  }

  static handleFile(evt) {

    return new Promise( (resolve, reject) => {
      if(evt.target.files.length > 1) {
        reject("Only one file can be selected");
      }

      var file = evt.target.files[0]; // FileList object
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = ( (reader) => {
        console.log(reader);

        return (e) => {
          let str = reader.result.substring('data:text/plain;base64,'.length).replace(/\s/g, '');
          resolve(decodeURIComponent(escape(window.atob( str ))));
        };
      })(reader);

      // Read in the text file as a data URL.

      reader.readAsDataURL(file);
    });
  }

  static downloadJsonFile(filename, json) {
    let a = document.createElement('a');
    a.setAttribute('download', filename);
    a.setAttribute('href', "data:text/json;charset=utf-8," + JSON.stringify(json) );
    a.style.display = "none";
    document.getElementsByTagName("body")[0].appendChild(a);
    a.click();
    document.getElementsByTagName("body")[0].removeChild(a);
  }

  static downloadImageFile(filename, data) {
    let a = document.createElement('a');
    a.setAttribute('download', filename);
    a.setAttribute('href', data );
    a.style.display = "none";
    document.getElementsByTagName("body")[0].appendChild(a);
    a.click();
    document.getElementsByTagName("body")[0].removeChild(a);
  }

}
