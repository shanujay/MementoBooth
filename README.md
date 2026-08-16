# MementoBooth 

MementoBooth is a web-based photo booth application that allows users to capture photos using their device camera and create customized photo strips with different layouts, frames, and visual effects.

**MementoBooth v2** is an enhanced version of the original project, featuring a redesigned user experience, responsive layouts, expanded customization options, and improved photo strip generation.

## Features

* **Photo Capture**: Capture multiple photos using your device camera.
* **Countdown Timer**: Countdown before each photo capture for a more realistic photo booth experience.
* **Photo Strip Layouts**: Choose from different photo counts, orientations, and strip layouts.
* **Custom Frames**: Select from a growing collection of hand-designed photo booth frames.
* **Frame Categories**: Browse frames organized into different themes and categories.
* **Photo Filters**: Apply visual effects and filters to captured photos.
* **Photo Preview**: Preview your captured photos before generating the final strip.
* **Responsive Design**: Designed to work across desktop, tablet, and mobile screen sizes.
* **Download**: Download the completed photo strip as an image.
* **Interactive UI**: Improved navigation, animations, and user interactions for a smoother experience.

## Customization

MementoBooth provides several options for creating personalized photo strips:

* Different photo counts
* Vertical and horizontal layouts
* Multiple frame designs
* Themed frame categories
* Photo filters
* Custom photo strip compositions

New layouts and designs can be added through the project's data-driven layout and frame structure without changing the core application logic.

## Responsive Experience

MementoBooth v2 is designed to provide a consistent experience across different devices:

* Desktop
* Mobile
* Tablet

The interface adapts to different screen sizes while maintaining the photo booth workflow and usability.

## Technologies Used

* **HTML5** – Application structure
* **CSS3** – Styling, responsive layouts, and animations
* **JavaScript** – Application logic and photo booth functionality
* **Canvas API** – Photo processing and photo strip generation
* **Web Media API** – Camera access and photo capture
* **JSON** – Layout, frame, and category configuration

## Project Structure

```text
MementoBooth/
│
├── index.html
│
├── css/
│   └── ...
│
├── js/
│   └── ...
│
├── assets/
│   ├── data/
│   │   ├── layouts.json
│   │   ├── categories.json
│   │   └── frames/
│   │
│   ├── frames/
│   └── ...
│
└── README.md
```

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/shanujay/MementoBooth.git
```

### 2. Navigate to the project directory

```bash
cd MementoBooth
```

### 3. Run the application

Since MementoBooth is a client-side web application, it can be run using a local development server.

For example, using **Live Server** in Visual Studio Code:

1. Open the project in VS Code.
2. Install the Live Server extension if necessary.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

> Using a local server is recommended because camera access through `getUserMedia()` may be restricted when opening the HTML file directly.

## How to Use

1. Open MementoBooth.
2. Allow camera access when prompted.
3. Select a photo booth theme or category.
4. Choose a frame design.
5. Select the desired photo strip layout.
6. Start the photo booth.
7. Follow the countdown and capture your photos.
8. Preview your captured photos.
9. Apply filters or other available customizations.
10. Generate your photo strip.
11. Download the final image.

## Demo

The original MementoBooth version was previously deployed using GitHub Pages.

The v2 deployment will be available here once the new version is published:

**[MementoBooth](https://shanujay.github.io/MementoBooth/)**

## Version History

### v2.0

Major update featuring:

* Redesigned user interface
* Responsive mobile and tablet support
* New photo strip layouts
* New frame designs and categories
* Improved photo capture workflow
* Improved photo strip generation
* Enhanced customization options
* Improved project structure and maintainability

### v1.0

Initial release of MementoBooth featuring the core photo capture and photo strip generation functionality.

## Future Improvements

Some planned improvements include:

* Additional photo booth frame designs
* More layout variations
* Additional photo effects and filters
* Enhanced customization options
* Improved sharing capabilities
* Additional accessibility improvements

## License

This project is developed as a personal project and is available for learning and development purposes.

