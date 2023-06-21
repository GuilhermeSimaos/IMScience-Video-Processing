document
  .getElementById("videoForm")
  .addEventListener("submit", function (event) {
    // Prevent default action from browser
    event.preventDefault();

    var form = event.target;
    var formData = new FormData(form);

    // Obtain the uploaded videos
    var videoInput = document.getElementById("video");
    var videoFiles = videoInput.files;
    for (var i = 0; i < videoFiles.length; i++) {
      formData.append("video", videoFiles[i]);
    }

    // Obtain the video arguments
    var time = document.getElementById("time").value;
    var rate = document.getElementById("rate").value;
    var hierarchical_method = document.getElementById(
      "hierarchical_method"
    ).value;
    var cut = document.getElementById("cut").value;

    // Add the video arguments to formData
    formData.append("time", time);
    formData.append("rate", rate);
    formData.append("hierarchical_method", hierarchical_method);
    formData.append("cut", cut);

    // Faça o envio da requisição POST para o backend
    fetch("https://flask-production-0d95.up.railway.app/api/post/video", {
      method: "POST",
      body: formData,
    })
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          fetchImages();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });

function fetchImages() {
  fetch("https://flask-production-0d95.up.railway.app/api/get/images")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Error fetching images");
      }
      return response.json();
    })
    .then(function (data) {
      // const images = data || [];
      // const gridContainer = document.querySelector('.grid-container');
      // gridContainer.innerHTML = '';

      // if (images.length === 0) {
      //     const message = document.createElement('p');
      //     message.textContent = 'No images available.';
      //     gridContainer.appendChild(message);
      // } else {
      //     images.forEach(function (imageUrl) {
      //         const col = document.createElement('div');
      //         col.className = 'col-lg-3 col-md-5 col-sm-10 mb-3';

      //         const img = document.createElement('img');
      //         img.src = imageUrl;
      //         img.alt = 'Image';

      //         col.appendChild(img);
      //         gridContainer.appendChild(col);
      //     });
      // }
      const images = data || [];
      const gridContainer = document.querySelector(".grid-container");
      gridContainer.innerHTML = "";

      if (images.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No images available.";
        gridContainer.appendChild(message);
      } else {
        const maxImagesPerRow = 5;
        const maxRows = 2;
        const totalImages = Math.min(images.length, maxImagesPerRow * maxRows);

        for (let i = 0; i < totalImages; i++) {
          const col = document.createElement("div");
          col.className = "col-lg-2 col-md-4 col-sm-6 mb-3";

          const img = document.createElement("img");
          img.src = images[i];
          img.alt = "Image";

          col.appendChild(img);
          gridContainer.appendChild(col);
        }

        // Centralize o conjunto de imagens
        const remainingSpace =
          maxImagesPerRow - (totalImages % maxImagesPerRow);
        for (let i = 0; i < remainingSpace; i++) {
          const col = document.createElement("div");
          col.className = "col-lg-3 col-md-4 col-sm-6 mb-3";

          gridContainer.appendChild(col);
        }
      }
    })
    .catch(function (error) {
      console.error("Error fetching images:", error);
    });
}

var dropArea = document.getElementById("dropArea");
var videoInput = document.getElementById("video");
var uploadedVideosList = document.getElementById("uploadedVideosList");

dropArea.addEventListener("dragover", function (Event) {
  Event.preventDefault();
  dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", function (Event) {
  Event.preventDefault();
  dropArea.classList.add("dragover");
});

dropArea.addEventListener("drop", function (Event) {
  Event.preventDefault();
  dropArea.classList.add("dragover");

  var files = Event.dataTransfer.files;
  handleFiles(files);
});

videoInput.addEventListener("change", function (Event) {
  var files = Event.target.files;
  handleFiles(files);
});

function handleFiles(files) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    var listItem = document.createElement("li");
    listItem.className = "row-cols-6 flex-row justify-content-center";
    listItem.textContent = file.name;

    var deleteButton = document.createElement("button");
    deleteButton.className = "btn-close btn-small btn-danger mx-3";
    deleteButton.addEventListener("click", function () {
      listItem.remove();
    });

    listItem.appendChild(deleteButton);
    uploadedVideosList.appendChild(listItem);
  }
}
