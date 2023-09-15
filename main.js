$(function () {
  $("#editProfile").on("click", function () {
    $("#uploadFile").click();
  });

  $("#uploadFile").on("change", function (ev) {
    $("#editProfile").attr("disabled", true);
    $("#editProfile").html(
      `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Scanning image...`
    );
    const file = ev.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      $("#imgProfile").attr("src", e.target.result);
      setTimeout(() => {
        scanImage("imgProfile");
      }, 1000);
    };
    reader.readAsDataURL(file);
  });

  function scanImage(id) {
    const classifier = ml5.imageClassifier("MobileNet");
    try {
      classifier.classify(
        document.getElementById(id),
        function gotResult(error, results) {
          if (error) throw error;
          else {
            const { label, confidence } = findHighestConfidence(results);
            console.log(results);

            $("#editProfile").attr("disabled", false);
            $("#editProfile").html(`Edit profile`);

            Swal.fire(
              "Scanning success!",
              `Scan Result: It's ${label}, confidence of ${
                (confidence * 100).toFixed(2)
              }%`,
              "success"
            );
          }
        }
      );
    } catch (err) {
      Swal.fire("Error!", err, "error");
    }
  }

  function findHighestConfidence(data) {
    let highestConfidence = -1;
    let highestConfidenceItem = null;

    for (const item of data) {
      if (item.confidence > highestConfidence) {
        highestConfidence = item.confidence;
        highestConfidenceItem = item;
      }
    }

    return highestConfidenceItem;
  }
});
