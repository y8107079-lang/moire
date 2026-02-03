<script lang="ts">
  import {format} from 'date-fns';
  import avatar from '$lib/assets/avatar.png';
  import type {PageData} from '../../routes/$types';
  import {createMemoList} from '$lib/memo.svelte';

  let {data, config}: {data: PageData; config: any} = $props();
  const memoList = createMemoList(() => data, config);
</script>

<div class="flex justify-center sm:m-10 min-h-screen {config.theme}">
  <div
    class="w-full max-w-[540px] bg-[var(--card-bg)] pt-8 px-3 sm:p-5 shadow-[0_0_10px_rgba(0,0,0,0.1)] relative drop-shadow-[0px_2px_4px_rgba(0,0,0,0.1)] border-y border-dashed border-[#ccc]"
  >
    <header class="text-center mb-5">
      <div class="text-3xl font-black tracking-[2px] mb-2.5">{config.title.toUpperCase()}</div>
      <div class="text-xs uppercase mb-2.5">
        <p>STORE: 001</p>
        <p>CASHIER: {config.author.toUpperCase()}</p>
        <p>{new Date().toLocaleDateString()}</p>
      </div>
      <div class="font-bold overflow-hidden whitespace-nowrap my-2.5">================================</div>

      {#if memoList.selectedTag}
        <div class="mb-5 text-center">
          <div class="text-xs font-bold mb-2">
            FILTERING BY: <button
              class="bg-transparent border border-black px-1 py-0.5 text-xs cursor-pointer uppercase transition-all duration-200 inline-block hover:text-black [&.active]:text-black active"
              onclick={() => memoList.selectTag(null)}>#{memoList.selectedTag}</button
            >
          </div>
          <div class="font-bold overflow-hidden whitespace-nowrap my-2.5">--------------------------------</div>
        </div>
      {/if}
    </header>

    <div
      onclick={(e) => {
        const target = (e.target as HTMLElement).closest('button[data-tag]');
        if (target) {
          const tag = (target as HTMLElement).dataset.tag || null;
          if (tag) memoList.selectTag(tag);
        }
      }}
      role="presentation"
    >
      {#each Object.entries(memoList.groupedMemos) as [dateKey, memos]}
        <div class="mb-[30px]">
          <div class="text-center mb-4 font-bold text-sm">
            <span>*** {format(new Date(dateKey + 'T00:00:00'), 'MMM dd, yyyy').toUpperCase()} ***</span>
          </div>

          {#each memos as memo}
            <div class="flex gap-3 mb-5 items-start">
              <div class="flex flex-col items-center gap-1 w-10 shrink-0">
                <span class="text-xs font-bold">{format(memo.date, 'HH:mm')}</span>
                <div class="w-8 h-8 bg-black rounded-full overflow-hidden">
                  <img
                    src={avatar}
                    alt="User"
                    class="w-full h-full object-cover"
                    onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                  />
                </div>
              </div>
              <div
                class="flex-1 text-[0.95rem] [&_h1]:text-base [&_h1]:uppercase [&_h1]:mb-1.5 [&_p]:mb-2.5 [&_img]:grayscale [&_img]:contrast-120 [&_img]:max-w-full [&_img]:my-1.5 [&_img]:border-2 [&_img]:border-black
                  [&_.tag-link]:bg-transparent [&_.tag-link]:font-bold [&_.tag-link]:underline [&_.tag-link]:decoration-dashed [&_.tag-link]:underline-offset-3 [&_.tag-link]:hover:bg-black [&_.tag-link]:hover:text-white
                "
              >
                {@html memo.content}
              </div>
            </div>
          {/each}
        </div>
      {/each}

      {#if data.memos.length === 0}
        <div class="empty-state">
          <p>NO DATA.</p>
        </div>
      {/if}

      {#if memoList.visibleCount < data.memos.length}
        <div class="text-center my-5">
          <button
            class="bg-transparent border-2 dashed border-black px-4 py-1 text-xs cursor-pointer uppercase font-bold hover:bg-black hover:text-white transition-colors"
            onclick={memoList.loadMore}>[ PRINT MORE... ]</button
          >
        </div>
      {/if}
    </div>

    <footer class="text-center mt-10 text-xs">
      <div class="font-bold overflow-hidden whitespace-nowrap my-2.5">================================</div>
      <p>TOTAL ITEMS: {data.memos.length}</p>
      <p>THANK YOU FOR VISITING</p>

      <div class="font-['Libre_Barcode_39',cursive] text-3xl my-5 tracking-[5px]">||||| |||| || | ||||| || |</div>

      <div class="my-5 text-[#999]">- - - - - - - - - - - - - - -</div>
    </footer>
  </div>
</div>
