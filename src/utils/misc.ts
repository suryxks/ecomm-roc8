type Path = {
  params: {
    id: number;
  };
};
export function getPathsByNumberofItems(
  itemsLength: number,
  itemsPerPage: number,
) {
  let paths: Path[] = [];
  let pageNumber = 1;
  for (let index = 0; index < itemsLength; index + itemsPerPage) {
    paths = paths.concat([{ params: { id: pageNumber } }]);
    pageNumber++;
  }
  return paths;
}
