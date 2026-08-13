const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../assets/template");
const outDir = path.join(__dirname, "../assets/data/frames");
const layoutsPath = path.join(__dirname, "../assets/data/layouts.json");

const layouts = JSON.parse(fs.readFileSync(layoutsPath, "utf8"));
const usedLayouts = new Set();


// Sort files by trailing number
function sortByTrailingNumber(a, b) {
    const numA = parseInt(a.match(/(\d+)\.png$/i)?.[1] || "0", 10);
    const numB = parseInt(b.match(/(\d+)\.png$/i)?.[1] || "0", 10);
    return numA - numB;
}

// Get layout key
function getLayoutKey(orientation, photoCount, designNumber) {
    return `${orientation}_${photoCount}_${String(designNumber).padStart(2, "0")}`;
}

// Build frames for a given count
function buildFramesForCount(orientation, count) {
    const photoDir = path.join(root, orientation, `${count}_Photo`);

    if (!fs.existsSync(photoDir)) {
        return [];
    }

    const photoCount = parseInt(count, 10);
    const frames = [];

    const designDirs = fs.readdirSync(photoDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && /^design_\d+$/i.test(entry.name))
        .sort((a, b) => {
            const numA = parseInt(a.name.match(/\d+/)?.[0] || "0", 10);
            const numB = parseInt(b.name.match(/\d+/)?.[0] || "0", 10);
            return numA - numB;
        });

    designDirs.forEach((designDir) => {
        const designNumber = parseInt(designDir.name.match(/\d+/)?.[0] || "0", 10);
        const layoutKey = getLayoutKey(orientation, photoCount, designNumber);
        const designPath = path.join(photoDir, designDir.name);

        const files = fs.readdirSync(designPath)
            .filter((file) => file.toLowerCase().endsWith(".png"))
            .sort(sortByTrailingNumber);

        if (files.length === 0) {
            return;
        }

        if (!layouts[layoutKey]) {
            console.warn(
                `Skipped ${files.length} frame(s): add "${layoutKey}" to layouts.json for ${designPath}`
            );
            return;
        }

        usedLayouts.add(layoutKey);

        files.forEach((file, index) => {
            const frameNumber = file.match(/(\d+)\.png$/i)?.[1] || String(index + 1);
            const id = `${layoutKey}_frame_${String(frameNumber).padStart(2, "0")}`;

            frames.push({
                id,
                name: `${photoCount} ${orientation[0].toUpperCase()}${orientation.slice(1)} Design ${designNumber} - ${frameNumber}`,
                orientation,
                design: designNumber,
                layout: layoutKey,
                photoCount,
                image: `assets/template/${orientation}/${count}_Photo/${designDir.name}/${file}`.replace(/\\/g, "/"),
            });
        });
    });

    return frames;
}

// Build all frames for a given count
function buildAllFrames(count) {
    return [
        ...buildFramesForCount("vertical", count),
        ...buildFramesForCount("horizontal", count),
    ];
}

const frames2 = buildAllFrames("2");
const frames3 = buildAllFrames("3");
const frames4 = buildAllFrames("4");

fs.writeFileSync(path.join(outDir, "2_photos.json"), `${JSON.stringify(frames2, null, 4)}\n`);
fs.writeFileSync(path.join(outDir, "3_photos.json"), `${JSON.stringify(frames3, null, 4)}\n`);
fs.writeFileSync(path.join(outDir, "4_photos.json"), `${JSON.stringify(frames4, null, 4)}\n`);

const unusedLayouts = Object.keys(layouts).filter((key) => !usedLayouts.has(key));

console.log(`Generated frames: 2=${frames2.length}, 3=${frames3.length}, 4=${frames4.length}`);

// Log unused layouts
if (unusedLayouts.length > 0) {
    console.log(`Layouts ready but no PNGs yet: ${unusedLayouts.join(", ")}`);
}
