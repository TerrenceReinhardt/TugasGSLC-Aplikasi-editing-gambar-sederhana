// Global variables untuk hold effect grayscale/blur dan image data
let selectedEffect = '';
let imageData = '';

// Function buat ngehandle handle image upload
function uploadImage() {
    let fileInput = document.getElementById('imageInput');
    let file = fileInput.files[0];

    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            localStorage.setItem('imageData', imageData);
            document.getElementById('uploadConvertBtn').disabled = false;
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select an image!");
    }
}

// Function untuk ngehandle pilihan effect dari listbox
function selectEffect() {
    selectedEffect = document.getElementById('effectSelect').value;
}

// Function untuk ngehandle upload dan transform
function uploadAndConvert() {
    if (!selectedEffect || !imageData) {
        alert("Please select an image and a transformation type.");
        return;
    }

    // ngestore effect yang dipilih di local storage
    localStorage.setItem('selectedEffect', selectedEffect);
    
    // kalo button upload dan convert di klik, direct ke result.html
    window.location.href = 'result.html';
}

// intinya logic result.html dimana logic menunjukan hasil transformed image dan bandingiin dengan original image
window.onload = function() {
    let originalImage = localStorage.getItem('imageData');
    let transformedImage = '';

    if (originalImage) {
        let effect = localStorage.getItem('selectedEffect');

        let img = new Image();
        img.src = originalImage;
        img.onload = function() {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            if (effect === 'grayscale') {
                let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    let r = data[i];
                    let g = data[i + 1];
                    let b = data[i + 2];
                    let gray = 0.3 * r + 0.59 * g + 0.11 * b;
                    data[i] = gray;
                    data[i + 1] = gray;
                    data[i + 2] = gray;
                }
                ctx.putImageData(imageData, 0, 0);
            } else if (effect === 'blur') {
                ctx.filter = 'blur(5px)';
                ctx.drawImage(canvas, 0, 0);
            }

            transformedImage = canvas.toDataURL();
            document.getElementById('originalImage').src = originalImage;
            document.getElementById('transformedImage').src = transformedImage;
        };
    } else {
        alert("No image data found. Please upload an image first.");
    }
};




