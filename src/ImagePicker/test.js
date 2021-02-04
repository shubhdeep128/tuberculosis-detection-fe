const resultImages = {
  URLs: ["https://d2mimyecy1zro1.cloudfront.net/1612445075488-bitslogo.png"],
  cannyURLs: [
    "https://d2mimyecy1zro1.cloudfront.net/1612445075488-bitslogo.png_canny.jpg",
  ],
  laplacianURLs: [
    "https://d2mimyecy1zro1.cloudfront.net/1612445075488-bitslogo.png_laplacian.jpg",
  ],
  sobelXURLs: [
    "https://d2mimyecy1zro1.cloudfront.net/1612445075488-bitslogo.png_sobelX.jpg",
  ],
  sobelYURLs: [
    "https://d2mimyecy1zro1.cloudfront.net/1612445075488-bitslogo.png_sobelY.jpg",
  ],
};

const selectedMethod = "cannyURLs";
console.log(resultImages[selectedMethod][0]);
