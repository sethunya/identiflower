$("document").ready(function() {
  $("input[type=file]").on("change", function() {
    var $files = $(this).get(0).files;
    var resName = new Array("", "", "");
    var resValue = new Array("", "", "");
    var resValHack = "";
    if ($files.length) {
      if ($files[0].size > 512000) {
        document.getElementById("status").innerHTML = "File must be < 5mb";
        return false;
      }

      document.getElementById("status").innerHTML = "Processing image...";

      var settings = {
        async: false,
        crossDomain: true,
        processData: false,
        contentType: false,
        type: "POST",
        url: "https://api.imgur.com/3/image",
        headers: {
          Authorization: "Client-ID " + "859fb0b90eec692",
          Accept: "application/json"
        },
        mimeType: "multipart/form-data"
      };

      var formData = new FormData();
      formData.append("image", $files[0]);
      settings.data = formData;

      $.ajax(settings).done(function(response) {
        response = JSON.parse(response);
        imgLink = response.data.link;
      });
    }
    const app = new Clarifai.App({
      apiKey: "1df07f26a51e4b7fb5399031fc6660ba"
    });
    
    app.models
      .predict({id: "flowers!"}, imgLink, {
        selectConcepts: [
          { name: "Anemone" },
          { name: "Aster" },
          { name: "Dahlia" },
          { name: "Daisy" },
          { name: "Hibiscus" },
          { name: "Hydrangea" },
          { name: "Iris" },
          { name: "Larkspur" },
          { name: "Rose" },
          { name: "Tulip" }
        ]
      })
      .then(
        function(response) {
          for (i = 0; i < 3; i++) {
            resName[i] = response.outputs[0].data.concepts[i].name;
            resName[i] =
              resName[i].substring(0, 1).toUpperCase() +
              resName[i].substring(1);
            console.log(resName[i]);
            resValue[i] = response.outputs[0].data.concepts[i].value;
            resValHack = resValue[i];
            resValHack = resValHack * 100;
            resValHack = String(resValHack);
            resValHack = resValHack.substring(0,5);
            resValue[i] = resValHack;
            console.log(resValue[i]);
          }

          document.getElementById("status").innerHTML =
            "<h3>Top Results</h3></br>";
          document.getElementById("results").innerHTML =
            '<ol><li> <span class="category">' +
            resName[0] +
            "</span> with " +
            resValue.slice(0, 1) +
            "% certainty</li><br>" +
            '<li> <span class="category">' +
            resName[1] +
            "</span> with " +
            resValue[1] +
            "% certainty</li></br>" +
            '<li> <span class="category">' +
            resName[2] +
            "</span> with " +
            resValue[2] +
            "% certainty</li></ol>";
          document.getElementById("yourimg").innerHTML =
            "<hr><h3>Your Image</h3></br>";
          document.getElementById("theimg").innerHTML =
            '<img class="image" alt="yours" src="' + imgLink + '">';
          console.log(response);
        },
        function(err) {
          document.getElementById("status").innerHTML = "Error Encountered";
        }
      );
  });
});
