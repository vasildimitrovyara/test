const fetchAvailableTransitions = require('./fetchAvailableTransitions');

module.exports = async ({ ticketId, transitionName }) => {
  const availableTransitions = await fetchAvailableTransitions({
    ticketId,
  });
  console.log('getAvailableTransitionId() => transitionName', transitionName);
  console.log(
    'getAvailableTransitionId() => availableTransitions',
    availableTransitions,
  );

  const hasAvailableTransitions =
    availableTransitions && availableTransitions.length;

  console.log('hasAvailableTransitions', hasAvailableTransitions);
  if (!hasAvailableTransitions) return null;

  const desiredTransition = availableTransitions.find(({ name }) =>
    name.toLowerCase().includes(transitionName.toLowerCase()),
  );
  console.log('desiredTransition', desiredTransition);
  if (!desiredTransition) return null;

  const hasDesiredTransition = desiredTransition && desiredTransition.id;
  console.log('hasDesiredTransition', hasDesiredTransition);
  if (!hasDesiredTransition) return null;

  return desiredTransition.id;
};
