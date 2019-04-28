const required = [];

function proof(supported)
{
  try
  {
    return supported();
  }
  catch (err)
  {
    console.error(err);
    return false;
  }
}

class SystemRequirements
{
  add(type, name, supported)
  {
    required.push({ type, name, supported });
    console.debug('Supports [%s] %s', type, name, ':', proof(supported));
  }

  addCSS(name, supported)
  {
    this.add('CSS', name, supported);
  }

  addJS(name, supported)
  {
    this.add('JS', name, supported);
  }

  supportsAllRequired()
  {
    return required.every(requirement => proof(requirement.supported));
  }
}

export default new SystemRequirements();