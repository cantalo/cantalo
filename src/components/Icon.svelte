<script>
  const domParser = new DOMParser();

  export let data;
  export let viewBox = undefined;

  export let size = '20px';
  export let width = size;
  export let height = size;

  export let color = 'currentColor';
  export let stroke = color;
  export let fill = color;

  let elements, originalViewbox;

  $: {
    const { firstChild: svgDom } = domParser.parseFromString(data, 'image/svg+xml');
    originalViewbox = svgDom.getAttribute('viewBox');
    elements = svgDom.innerHTML;
  }
</script>

<svg xmlns="http://www.w3.org/2000/svg"
     viewbox={viewBox || originalViewbox}
     {width} {height} {stroke} {fill}>
  {@html elements}
</svg>