let app = angular.module('app', ['uiCropper']);

app.factory('API', function ($http) {  
    return {
      uploadImage: function (formData) {
        return $http.post('/backend/upload.php', formData,{
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
          }
        );
      },
      getImages: function () {
        return $http.get('/backend/list.php');
      }
    }
});

app.controller('mainController', ['$scope', '$http', 'API',function($scope, $http, API) {

    let _this = this;

    $scope.myImage = '';
    $scope.myCroppedImage = '';
    $scope.showCropArea = false;

    $scope.imageSizes = [
      {
        "name": "horizontal",
        "aspectRatio": 1.67777777778,
        "width": 755,
        "height": 450
      },
      {
        "name": "vertical",
        "aspectRatio": 0.81111111111,
        "width": 365,
        "height": 450
      },
      {
        "name": "horizontal_small",
        "aspectRatio": 1.72169811321,
        "width": 365,
        "height": 212
      },
      {
        "name": "gallery",
        "aspectRatio": 1,
        "width": 380,
        "height": 380
      }
    ]


    let handleFileSelect = function(evt) {

      let file = evt.currentTarget.files[0];

      let img = new Image();

      img.onload = function() {
        if(this.width == 1024 && this.height == 1024){
          let reader = new FileReader();

          reader.onload = function (evt) {
            $scope.$apply(function($scope){
              $scope.myImage = evt.target.result;
            });
          };

          $scope.showCropArea = true;
          reader.readAsDataURL(file);
        }
        else{
          alert("Invalid file");
        }
      };

      let objectURL = URL.createObjectURL(file);
      img.src = objectURL;
    };


    this.dataURItoBlob = function(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        let ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }


    $scope.uploadImages = function(){
      $scope.disableUpload = true;
      let formData = new FormData();
      let images = document.getElementsByClassName('cropped-images');
      let original = document.getElementById('original');

      formData.append(original.id, original.files[0], original.id);

      Array.prototype.forEach.call(images, function(image) {
        let blob = _this.dataURItoBlob(image.src);
        formData.append(image.id, blob, image.id);
      });
    
      API.uploadImage(formData)
        .success(function (data) {
            if(data.error === false){
              window.location.href = "/list.html";
            }
        })
        .error (function (error) {
        });
    }

      angular.element(document.querySelector('#original')).on('change',handleFileSelect);
}]);

app.controller('getController', ['$scope', '$http', 'API',function($scope, $http, API) {

    let _this = this;

    API.getImages()
    .success(function (data) {
      $scope.originals = data;
    })
    .error (function (error) {
    });

    $scope.showChildImages = function(uniq_id){
      console.log(uniq_id);
    }
    
}]);