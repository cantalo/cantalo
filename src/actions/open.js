export default function open(node, initValue)
{
  if (initValue)
  {
    node.setAttribute('open', '');
  }

  return {
    update(updateValue)
    {
      if (updateValue)
      {
        node.setAttribute('open', '');
      }
      else
      {
        node.removeAttribute('open');
      }
    }
  }
}
