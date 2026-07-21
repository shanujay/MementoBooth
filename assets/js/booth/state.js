// Select elements
const video = document.getElementById("video");
const takeSnapBtn = document.getElementById("takeSnapBtn");
const photoCountDisplay = document.getElementById("photoCountDisplay");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("download");
const templateSelection = document.getElementById("templateSelection");
const photoBooth = document.getElementById("photoBooth");
const photoStripContainer = document.getElementById("photoStripContainer");
const stripDownload = document.getElementById("stripDownload");
const hoverSound = document.getElementById("hoverSound");
const clickSound = document.getElementById("clickSound");
const cameraSound = document.getElementById("cameraSound");
const girlImg = document.getElementById("girlImg");
const downloadInfo = document.getElementById("downloadInfo");
const thanksImage = document.getElementById("thanksImage");
const girlImg2 = document.getElementById("girlImg2");

// Category Buttons
const backToCategories = document.getElementById("backToCategories");
const frameCategories = document.getElementById("frameCategories");
const framesContainer = document.getElementById("framesContainer");
const frameTitle = document.getElementById("frameTitle");

// Frame Preview
const framePreview = document.getElementById("framePreview");
const previewTitle = document.getElementById("previewTitle");
const previewFrameImage = document.getElementById("previewFrameImage");
const cancelFrame = document.getElementById("cancelFrame");
const confirmFrame = document.getElementById("confirmFrame");

// Retake Button
const confirmRetake = document.getElementById("confirmRetake");

// Countdown Display
const countdown = document.getElementById("countdown");

// Photo Review
const photoReview = document.getElementById("photoReview");
const photoCarousel = document.getElementById("photoCarousel");
const confirmReview = document.getElementById("confirmReview");
const retakeReview = document.getElementById("retakeReview");
const prevPhoto = document.getElementById("prevPhoto");
const nextPhoto = document.getElementById("nextPhoto");
const reviewCounter = document.getElementById("reviewCounter");

// Retake All Photos
const retakeAll = document.getElementById("retakeAll");


let selectedFrame = "";
let selectedPhotoCount = 3;
let photos = [];

// Review Index
let reviewIndex = 0;

// Is Retaking
let isRetaking = false;

// Is Retaking All Photos
let isRetakingAll = false;

// Load Frame Templates
let categories = [];

let layouts = {};
let selectedLayout = {};
