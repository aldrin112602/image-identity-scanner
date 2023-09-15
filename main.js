$(function () {
  $("#editProfile").on("click", () => $("#uploadFile").click());

  $("#uploadFile").on("change", function (ev) {
    const file = ev.target.files[0];
    $("#editProfile").prop("disabled", true).html(
      `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Scanning image...`
    );
    
    const reader = new FileReader();
    reader.onload = (e) => {
      $("#imgProfile").attr("src", e.target.result);
      setTimeout(() => scanImage("imgProfile"), 100);
    };
    reader.readAsDataURL(file);
  });

  async function scanImage(id) {
    try {
      const classifier = await ml5.imageClassifier("MobileNet");
      const results = await classifier.classify(document.getElementById(id));
      
      const { label, confidence } = findHighestConfidence(results);
      console.log(results);

      $("#editProfile").prop("disabled", false).html(`Edit profile`);
      
      Swal.fire(
        "Scan completed!",
        `Scan Result: It's ${label}, confidence of ${(confidence * 100).toFixed(2)}%`,
        "success"
      );
    } catch (err) {
      Swal.fire("Error!", err, "error");
    }
  }

  function findHighestConfidence(data) {
    return data.reduce((prev, current) => (current.confidence > prev.confidence) ? current : prev);
  }
});
