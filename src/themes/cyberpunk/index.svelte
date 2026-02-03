<script lang="ts">
  import {config} from '../../../moire.config';
  import {createMemoList} from '$lib/memo.svelte';
  import type {PageData} from '../../routes/$types';
  import {marked} from 'marked';
  import {format} from 'date-fns';
  import {onMount} from 'svelte';

  let {data}: {data: PageData} = $props();
  const memoList = createMemoList(() => data, config);

  let time = $state(new Date());
  let fps = $state(60);
  let scrollY = $state(0);
  let scrollHex = $derived(scrollY.toString(16).toUpperCase().padStart(4, '0'));

  onMount(() => {
    // Clock
    const timer = setInterval(() => {
      time = new Date();
    }, 1000);

    // Simulated FPS jitter
    const fpsTimer = setInterval(() => {
      fps = 60 + Math.floor(Math.random() * 5) - 2;
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(fpsTimer);
    };
  });
</script>

<svelte:window onscroll={() => (scrollY = window.scrollY)} />

<div
  class="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] font-[family-name:var(--font-family)] selection:bg-[var(--text-color)] selection:text-[var(--bg-color)] overflow-x-hidden {config.theme}"
>
  <div
    class="fixed inset-0 pointer-events-none z-0 opacity-10"
    style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, var(--accent-color) 3px);"
  ></div>
  <div
    class="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg-color)_100%)] opacity-80"
  ></div>

  <div class="fixed inset-0 pointer-events-none z-50 p-4 md:p-8 flex flex-col justify-between">
    <header class="flex justify-between items-start">
      <div class="flex flex-col">
        <h1
          class="text-4xl font-bold uppercase tracking-[0.2em] relative inline-block glitch-text"
          data-text={config.title}
        >
          {config.title}
        </h1>
        <div class="flex items-center gap-2 mt-1 text-xs text-[var(--accent-color)] tracking-widest opacity-80">
          <span class="inline-block w-2 h-2 bg-[var(--accent-color)] animate-pulse"></span>
          <span>SYS.NORMAL</span>
        </div>
      </div>

      <div class="text-right font-mono text-sm leading-tight text-[var(--accent-color)]/80">
        <div>FPS: {fps}</div>
        <div>HEX: 0x{scrollHex}</div>
      </div>
    </header>

    <footer class="flex justify-between items-end border-t border-[#F2C94C]/30 pt-2">
      <div class="text-xs tracking-widest opacity-60">
        {config.author} // DIEGETIC_INTERFACE_V3
      </div>
      <div class="text-xl font-bold tracking-widest">
        {format(time, 'HH:mm:ss')}
      </div>
    </footer>

    <div class="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[var(--text-color)]"></div>
    <div class="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[var(--text-color)]"></div>
    <div class="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-[var(--text-color)]"></div>
    <div class="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[var(--text-color)]"></div>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px] border border-[var(--accent-color)]/20 items-center justify-center flex"
    >
      <div class="w-[2px] h-[2px] bg-[var(--accent-color)]/50"></div>
    </div>
  </div>

  <main class="relative z-10 pt-32 pb-32 px-4 max-w-2xl mx-auto space-y-12">
    {#each memoList.visibleMemos as memo}
      <article
        class="group relative pl-6 border-l-2 border-[var(--text-color)]/20 hover:border-[var(--accent-color)] transition-colors duration-300"
      >
        <div
          class="absolute -left-[5px] top-0 w-[8px] h-[8px] bg-[var(--bg-color)] border border-[var(--text-color)] group-hover:bg-[var(--accent-color)] group-hover:border-[var(--accent-color)] transition-colors"
        ></div>
        <header class="mb-4 flex items-baseline gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
          <h2 class="text-sm font-bold tracking-widest text-[var(--accent-color)] uppercase">
            LOG_ID: {format(new Date(memo.date), 'yyyyMMdd')}
          </h2>
          <span class="text-xs font-mono text-[var(--text-color)]/60">
            T-{format(new Date(memo.date), 'HH:mm')}
          </span>
        </header>

        <div
          class="prose prose-invert prose-p:text-[var(--text-color)]/90 prose-headings:text-[var(--text-color)] prose-a:text-[var(--accent-color)] prose-strong:text-white prose-code:text-[var(--accent-color)] prose-code:bg-[var(--accent-color)]/10 max-w-none text-lg leading-relaxed
                 [&_.tag-link]:inline-block [&_.tag-link]:px-2 [&_.tag-link]:py-0.5 [&_.tag-link]:border [&_.tag-link]:border-[var(--text-color)]/30 [&_.tag-link]:text-[10px] [&_.tag-link]:tracking-widest [&_.tag-link]:uppercase [&_.tag-link]:text-[var(--text-color)]/60 [&_.tag-link:hover]:bg-[var(--text-color)] [&_.tag-link:hover]:text-[var(--bg-color)] [&_.tag-link]:transition-colors [&_.tag-link]:cursor-pointer [&_.tag-link]:no-underline"
          onclick={(e) => {
             const target = e.target as HTMLElement;
             if (target.classList.contains('tag-link')) {
                 const tag = target.dataset.tag;
                 if (tag) memoList.selectTag(tag);
             }
          }}
        >
          {@html marked.parse(memo.content)}
        </div>
      </article>
    {/each}

    {#if memoList.visibleMemos.length < memoList.filteredMemos.length}
      <div class="text-center py-8">
        <button
          onclick={memoList.loadMore}
          class="inline-block px-8 py-2 border border-[var(--accent-color)] text-[var(--accent-color)] text-sm tracking-[0.2em] hover:bg-[var(--accent-color)] hover:text-[var(--bg-color)] transition-all"
        >
          // LOAD_MORE_DATA
        </button>
      </div>
    {/if}
  </main>
</div>

