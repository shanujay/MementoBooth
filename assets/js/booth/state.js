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

// Editor Container
const editorContainer = document.getElementById("editorContainer");

// Editor Tools
const filterTool = document.getElementById("filterTool");
const textTool = document.getElementById("textTool");

// Editor Panels
const filtersPanel = document.getElementById("filtersPanel");
const textPanel = document.getElementById("textPanel");

// Text Input
const textField = document.getElementById("textField");
const addTextBtn = document.getElementById("addText");
const textColor = document.getElementById("textColor");
const fontOptions = document.querySelectorAll(".fontOption");

// Editor Canvas
const editorCanvas = document.getElementById("editorCanvas");
const editorCtx = editorCanvas.getContext("2d");

let selectedTextPosition = "top";


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

// Editor State
const editorState = {
    filter: "none",
    texts: []
};

// Default Text Color
const defaultTextColor = "#000000";

// Default / currently selected Font
const defaultTextFont = "Arial";
let selectedFont = "Arial";

// Text Drag and Drop State
let selectedText = null;

// Currently active/selected text (persists after mouseup for editing e.g. color)
let activeText = null;

let isDraggingText = false;

let dragOffsetX = 0;

let dragOffsetY = 0;

// Loaded Frame Image
let loadedFrameImage = null;