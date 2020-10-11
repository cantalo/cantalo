<script>
  import Icon from '../Icon.svelte';

  import searchIcon from './search-icon.svg';

  export let value;

  let searchbar;

  function keypress()
  {
    if (document.activeElement !== searchbar)
    {
      searchbar.focus();
    }
  }
</script>

<svelte:window on:keypress={keypress} />

<style>
  .search
  {
    position: fixed;
    bottom: 0;
    left: 0;
    right: calc(var(--thumbnail-bar-width) + 0.5px);
    height: 50px;
    color: #fff;
    overflow: hidden;
    clip-path: polygon(0 0, 0 100%, 100% 100%, calc(100% - calc(50px * var(--tan))) 0);
  }

  .search label
  {
    position: absolute;
    bottom: 4px;
    left: 8px;
    cursor: pointer;
  }

  .search input
  {
    appearance: none;
    height: 100%;
    width: 100%;
    padding: 4px 20px 4px 50px;
    background-color: rgba(#000, 0);
    border: 0 none;
    border-top: 1px solid rgba(#fff, 0);
    color: #fff;
    font-size: 24px;
    transition: border-color .3s linear, background-color .3s linear;
  }

  .search input:invalid:not(:focus)
  {
    width: 0;
    box-shadow: none;
  }

  .search input:focus,
  .search input:valid
  {
    outline: 0 none;
    border-top: 1px solid #fff;
    background-color: rgba(#000, .35);
  }

  .search input::-webkit-search-cancel-button
  {
    appearance: none;
    height: 25px;
    width: 25px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Cpath fill='%23fff' d='M285 250l108-107a25 25 0 00-36-36L250 215 143 107a25 25 0 00-36 36l108 107-108 107a25 25 0 0036 36l107-108 107 108a25 25 0 1036-36z'/%3E%3C/svg%3E");
    cursor: pointer;
  }
</style>

<div class="search">
  <input type="search" id="search" required spellcheck="false" autocomplete="off" bind:this={searchbar} bind:value>

  <label for="search">
    <Icon data={searchIcon} size="32" />
  </label>
</div>