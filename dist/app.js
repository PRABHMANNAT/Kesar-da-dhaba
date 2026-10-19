const toggle=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('#mobile-nav');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));mobileNav.hidden=open;});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){toggle.setAttribute('aria-expanded','false');mobileNav.hidden=true;toggle.focus();}});
document.addEventListener('click',event=>{if(mobileNav&&!mobileNav.hidden&&!event.target.closest('.site-header')){mobileNav.hidden=true;toggle.setAttribute('aria-expanded','false');}});
const search=document.querySelector('#dish-search');
let activeCategory='all';
const filterMenu=()=>{
  const term=search.value.trim().toLowerCase();let count=0;
  document.querySelectorAll('[data-menu-category]').forEach(category=>{let visible=0;category.querySelectorAll('.menu-item').forEach(item=>{const words=item.dataset.search.split(/\s+/);const show=!term||term.split(/\s+/).every(token=>words.some(word=>word.startsWith(token)));item.hidden=!show;if(show)visible++;});category.hidden=!visible||(activeCategory!=='all'&&category.dataset.menuCategory!==activeCategory);if(!category.hidden)count+=visible;});
  document.querySelector('.empty-results').hidden=count!==0;
  document.querySelector('.results-count').textContent=`${count} dishes shown`;
};
if(search){search.addEventListener('input',filterMenu);document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{activeCategory=button.dataset.category;document.querySelectorAll('[data-category]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});filterMenu();}));}
const dialog=document.querySelector('.photo-dialog');
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{dialog.querySelector('img').src=button.dataset.photo;dialog.querySelector('img').alt=button.dataset.caption;dialog.querySelector('p').textContent=button.dataset.caption;dialog.showModal();}));
dialog?.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
