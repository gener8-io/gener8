self.onmessage = async ($event) => {
  if ($event && $event.data && $event.data.msg === 'generate') {
      const newCounter = incApple($event.data.countApple);
      self.postMessage(newCounter);
  }
};

function updateCount(count) {
  const start = Date.now();
  while (Date.now() < start + 5000) {
  }
  return count + 1;
}