Promise.all([
    fetch("assets/data/layouts.json").then(response => response.json()),
    fetch("assets/data/categories.json").then(response => response.json()),
    fetch("assets/data/photo_counts.json").then(response => response.json())
])
.then(([layoutData, categoryData, photoCountData]) => {

    layouts = layoutData;
    categories = categoryData;
    photoCounts = photoCountData;

    displayOrientations();

})
.catch(error => {

    console.error("Error loading data:", error);

});
