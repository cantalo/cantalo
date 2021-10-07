
export function defer()
{
  let _resolve;
  const promise = new Promise(resolve => _resolve = resolve);
  promise.resolve = () =>
  {
    _resolve();
    promise.resolved = true;
  };
  return promise;
}