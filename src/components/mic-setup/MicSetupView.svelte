<script>
  export let browser = '';
</script>

<style>
  .mic-setup
  {
    color: #fff;
    display: flex;
  }

  .left
  {
    position: relative;
    width: 50vw;
  }

  .left.firefox
  {
    width: 50vw;
  }

  .right
  {
    padding-top: 80px;
    max-width: 600px;
  }
</style>

<div class="absolute background scrollable mic-setup">
  <div class="left {browser}">
    <slot name="left"/>
  </div>
  <div class="right">
    <slot name="right"/>
  </div>
</div>
