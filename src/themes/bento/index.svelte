<script lang="ts">
  import {format} from 'date-fns';
  import {config} from '../../../moire.config';
  import {createMemoList} from '$lib/memo.svelte';
  import type {PageData} from '../../routes/$types';
  import {marked} from 'marked';

  let {data}: {data: PageData} = $props();
  const memoList = createMemoList(() => data, config);

  function handleMouseMove(e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty('--x', `${x}px`);
    target.style.setProperty('--y', `${y}px`);
  }
</script>

<div class="min-h-screen py-8 max-w-3xl mx-auto {config.theme} font-sans">
  <header class="mx-auto mb-16 px-4">
    <h1 class="mb-3 text-5xl font-bold tracking-tight text-slate-900/90">{config.title}</h1>
    <p class="max-w-2xl text-xl font-medium text-slate-500/80">{config.description}</p>
  </header>

  <div class="mx-auto grid grid-cols-1 gap-6 px-4 xl:grid-cols-2">
    {#each memoList.visibleMemos as memo}
      <div
        class="group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/40 bg-white/40 p-7 shadow-sm backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
        onmousemove={handleMouseMove}
        style="--x: 50%; --y: 50%;"
      >
        <div
          class="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style="background: radial-gradient(800px circle at var(--x) var(--y), rgba(59, 130, 246, 0.08), transparent 40%);"
        ></div>
        <div class="relative z-10 flex h-full flex-col">
          <div
            class="prose prose-slate prose-p:text-slate-700 prose-headings:text-slate-800 prose-a:text-blue-600 prose-strong:text-slate-900 mb-6 line-clamp-[12] text-[0.95rem] leading-relaxed tracking-wide
                   [&_.tag-link]:rounded-full [&_.tag-link]:px-2 [&_.tag-link]:py-0.5 [&_.tag-link]:text-[10px] [&_.tag-link]:font-medium [&_.tag-link]:tracking-wide [&_.tag-link]:transition-colors [&_.tag-link]:bg-slate-100 [&_.tag-link]:text-slate-500 [&_.tag-link:hover]:bg-slate-200 [&_.tag-link:hover]:text-slate-700 [&_.tag-link]:no-underline [&_.tag-link]:mx-0.5"
             onclick={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('tag-link')) {
                    e.stopPropagation(); 
                    const tag = target.dataset.tag;
                    if (tag) memoList.selectTag(tag);
                }
             }}
          >
            {@html marked.parse(memo.content)}
          </div>

          <div
            class="mt-auto flex items-center justify-between pt-4 text-xs font-semibold tracking-wide text-slate-400/80 uppercase"
          >
            <span>{format(new Date(memo.date), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  {#if memoList.visibleMemos.length < memoList.filteredMemos.length}
    <div class="mt-16 flex justify-center pb-16">
      <button
        onclick={memoList.loadMore}
        class="rounded-full bg-white/50 px-8 py-3 text-sm font-semibold text-slate-600 backdrop-blur-md transition-all hover:bg-white/80 hover:text-slate-900 hover:shadow-lg"
      >
        Load More
      </button>
    </div>
  {/if}
</div>

<style>
  :global(body.bento) {
    background-color: #f0f2f5;
    background-image: radial-gradient(at 0% 0%, rgba(200, 220, 255, 0.3) 0px, transparent 40%),
      radial-gradient(at 100% 0%, rgba(230, 200, 255, 0.3) 0px, transparent 40%),
      radial-gradient(at 100% 100%, rgba(200, 255, 240, 0.3) 0px, transparent 40%),
      radial-gradient(at 0% 100%, rgba(255, 230, 200, 0.3) 0px, transparent 40%);
    background-attachment: fixed;
  }
</style>
