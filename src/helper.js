export function getAddedOrRemovedItems(prevItems, nextItems) {
  const prevMap = new Map(prevItems.map(i => [i.id, i]));
  const nextMap = new Map(nextItems.map(i => [i.id, i]));
  const itemsAdded = [];
  const itemsRemoved = [];
  const itemsUpdated = [];

  prevMap.forEach((value, id) => {
    if (!nextMap.has(id)) {
      itemsRemoved.push(value);
    } else if (prevMap.get(id) !== nextMap.get(id)) {
      itemsRemoved.push(value);
      itemsUpdated.push(value);
    }
  });

  nextMap.forEach((value, id) => {
    if (!prevMap.has(id) || prevMap.get(id) !== nextMap.get(id)) {
      itemsAdded.push(value);
    }
  });

  return {
    itemsAdded,
    itemsRemoved,
    itemsUpdated
  };
}
