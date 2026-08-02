Promise.all([
    fetch("assets/data/layouts.json").then(response => response.json()),
    fetch("assets/data/categories.json").then(response => response.json())
])
.then(([layoutData, categoryData]) => {

    layouts = layoutData;
    categories = categoryData;

    displayLayouts();

})
.catch(error => {

    console.error("Error loading data:", error);

});
