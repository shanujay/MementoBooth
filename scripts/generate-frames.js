const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../assets/template");
const outDir = path.join(__dirname, "../assets/data/frames");
const layoutsPath = path.join(__dirname, "../assets/data/layouts.json");

const layouts = JSON.parse(
    fs.readFileSync(layoutsPath, "utf8")
);

// Photo count for each layout
const photoCounts = {
    layout_A: 3,
    layout_B: 3,
    layout_C: 3,
    layout_D: 4,
    layout_E: 4,
    layout_F: 4,
    layout_G: 4
};


// Sort PNG files by trailing number
function sortByTrailingNumber(a, b) {
    const numA = parseInt(
        a.match(/(\d+)\.png$/i)?.[1] || "0",
        10
    );

    const numB = parseInt(
        b.match(/(\d+)\.png$/i)?.[1] || "0",
        10
    );

    return numA - numB;
}


// Build frames for one layout
function buildFrames(layoutKey) {

    const layoutDir = path.join(root, layoutKey);

    // Check layout exists in layouts.json
    if (!layouts[layoutKey]) {
        console.warn(
            `Skipped ${layoutKey}: not found in layouts.json`
        );

        return [];
    }

    // Check template folder exists
    if (!fs.existsSync(layoutDir)) {
        console.warn(
            `Skipped ${layoutKey}: template folder does not exist`
        );

        return [];
    }

    const photoCount = photoCounts[layoutKey];

    if (!photoCount) {
        console.warn(
            `Skipped ${layoutKey}: photo count is not defined`
        );

        return [];
    }

    // Get PNG files
    const files = fs.readdirSync(layoutDir)
        .filter(file =>
            file.toLowerCase().endsWith(".png")
        )
        .sort(sortByTrailingNumber);


    if (files.length === 0) {
        console.warn(
            `Skipped ${layoutKey}: no PNG files found`
        );

        return [];
    }


    const frames = files.map((file, index) => {

        const frameNumber =
            file.match(/(\d+)\.png$/i)?.[1]
            || String(index + 1);

        const paddedNumber =
            String(frameNumber).padStart(2, "0");


        return {
            id: `${layoutKey}_frame_${paddedNumber}`,

            name: `${layoutKey.replace("_", " ")} frame ${frameNumber}`,

            layout: layoutKey,

            photoCount,

            image:
                `assets/template/${layoutKey}/${file}`
                    .replace(/\\/g, "/")
        };
    });


    return frames;
}


// Make sure output directory exists
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}


// Generate JSON for every layout
Object.keys(layouts).forEach(layoutKey => {

    const frames = buildFrames(layoutKey);

    const outputPath =
        path.join(outDir, `${layoutKey}.json`);

    fs.writeFileSync(
        outputPath,
        `${JSON.stringify(frames, null, 4)}\n`
    );

    console.log(
        `Generated ${layoutKey}.json: ${frames.length} frame(s)`
    );
});


console.log("\nFrame generation complete.");