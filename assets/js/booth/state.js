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

// Live captured photos preview (under camera)
const capturedPhotosPreview = document.getElementById("capturedPhotosPreview");
const photoPreview = document.getElementById("photoPreview");
const captureReviewActions = document.getElementById("captureReviewActions");

// Photo Review actions
const confirmReview = document.getElementById("confirmReview");
const retakeReview = document.getElementById("retakeReview");

// Retake All Photos
const retakeAll = document.getElementById("retakeAll");

// Editor Container
const editorContainer = document.getElementById("editorContainer");

// Editor Tools
const filterTool = document.getElementById("filterTool");
const textTool = document.getElementById("textTool");
const stickerTool = document.getElementById("stickerTool");

// Editor Panels
const filtersPanel = document.getElementById("filtersPanel");
const textPanel = document.getElementById("textPanel");
const stickersPanel = document.getElementById("stickersPanel");

// Sticker Options
const stickerOptions = document.querySelectorAll(".stickerOption");

// Text Input
const textField = document.getElementById("textField");
const addTextBtn = document.getElementById("addText");
const textColor = document.getElementById("textColor");
const fontOptions = document.querySelectorAll(".fontOption");
const textSize = document.getElementById("textSize");
const textSizeValue = document.getElementById("textSizeValue");

// Editor Canvas
const editorCanvas = document.getElementById("editorCanvas");
const editorCtx = editorCanvas.getContext("2d");


let selectedTextPosition = "top";


let selectedFrame = "";
let selectedPhotoCount = 3;
let photos = [];

// Review Index
let reviewIndex = 0;

// Viewing captured photos after session (camera area shows selected photo)
let inPhotoReview = false;

// Is Retaking
let isRetaking = false;

// Is Retaking All Photos
let isRetakingAll = false;

// Load Frame Templates
let categories = [];
let photoCounts = [];

let selectedOrientation = "";
let selectedPhotoCountOption = null;
let selectionStep = "orientation";

let layouts = {};
let selectedLayout = {};

// Editor State
const editorState = {
    filter: "none",
    texts: [],
    stickers: []
};

// Default sticker width (in canvas native pixels) - kept small
const stickerDefaultWidth = 120;

// Default Text Color
const defaultTextColor = "#000000";

// Default / currently selected Font
const defaultTextFont = "Arial";
let selectedFont = "Arial";

// Default / currently selected Font Size
const defaultTextSize = 40;
let selectedTextSize = 40;

// Text Drag and Drop State
let selectedText = null;

// Currently active/selected text (persists after mouseup for editing e.g. color)
let activeText = null;

let isDraggingText = false;

let dragOffsetX = 0;

let dragOffsetY = 0;

// Sticker Drag and Drop State
let selectedSticker = null;

let isDraggingSticker = false;

// Currently selected sticker (shows a close button so it can be deleted)
let activeSticker = null;

// Sticker currently armed for delete (shows delete icon after long-press)
let stickerArmedForDelete = null;

// Long-press state (for arming sticker delete)
let longPressTimer = null;
let longPressCandidate = null;
let longPressStartPoint = null;

const LONG_PRESS_DURATION = 500;        // ms to hold before arming delete
const LONG_PRESS_MOVE_THRESHOLD = 10;   // canvas px — moving past this cancels the hold


// Close button radius (in canvas native pixels)
const stickerCloseRadius = 16;

// Close button radius for text (in canvas native pixels)
const textCloseRadius = 16;

// Text currently armed for delete (shows delete icon after long-press)
let textArmedForDelete = null;

// Long-press state for text (separate from sticker's, since both could theoretically be mid-press)
let textLongPressTimer = null;
let textLongPressCandidate = null;
let textLongPressStartPoint = null;

// Loaded Frame Image
let loadedFrameImage = null;