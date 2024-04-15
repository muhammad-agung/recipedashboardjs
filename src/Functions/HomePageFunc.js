export const handleSearchChange = (event, originalContents, setSearchQuery, setContents, setCurrentPage) => {
  const searchTerm = event.target.value.toLowerCase();
  setSearchQuery(searchTerm);
  // Filter recipes based on search term
  const filteredRecipes = originalContents.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm)
  );
  // Update the contents state with the filtered recipes
  setContents(filteredRecipes);
  // Reset current page to 1 when search term changes
  setCurrentPage(1);
};