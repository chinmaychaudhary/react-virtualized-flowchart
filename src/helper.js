export function getAddedOrRemovedItems(prevItems, nextItems) {
 const prevMap = new Map(prevItems.map(i => [i.id, i]));
 const nextMap = new Map(nextItems.map(i => [i.id, i]));
 const itemsAdded = [];
 const itemsRemoved = [];

 prevMap.forEach((value, id) => {
  if (!nextMap.has(id) || prevMap.get(id) !== nextMap.get(id)) {
   itemsRemoved.push(value);
  }
 });

 nextMap.forEach((value, id) => {
  if (!prevMap.has(id) || prevMap.get(id) !== nextMap.get(id)) {
   itemsAdded.push(value);
  }
 });

 return {
  itemsAdded,
  itemsRemoved
 };
}
