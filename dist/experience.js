(() => {
  const tabs=[...document.querySelectorAll('[data-dish-tab]')];
  const activateTab=(tab,focus=false)=>{
    tabs.forEach(item=>{
      const selected=item===tab;
      item.setAttribute('aria-selected',String(selected));
      item.tabIndex=selected?0:-1;
      document.getElementById(item.getAttribute('aria-controls')).hidden=!selected;
    });
    if(focus)tab.focus();
  };
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activateTab(tab));
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight')next=(index+1)%tabs.length;
      if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();activateTab(tabs[next],true);}
    });
  });

  const viewer=document.querySelector('.photo-dialog');
  const photos=[...document.querySelectorAll('[data-photo]')];
  let photoIndex=0;
  let photoTrigger;
  const showPhoto=index=>{
    if(!photos.length)return;
    photoIndex=(index+photos.length)%photos.length;
    const item=photos[photoIndex];
    const img=viewer.querySelector('img');
    img.src=item.dataset.photo;
    img.alt=item.dataset.caption;
    viewer.querySelector('.viewer-caption').textContent=item.dataset.caption;
    viewer.querySelector('.photo-count').textContent=`${String(photoIndex+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
  };
  photos.forEach((button,index)=>button.addEventListener('click',()=>{
    photoTrigger=button;showPhoto(index);viewer.showModal();viewer.querySelector('.dialog-close').focus();document.dispatchEvent(new Event('kesar:dialogchange'));
  }));
  viewer?.querySelector('.dialog-close')?.addEventListener('click',()=>viewer.close());
  viewer?.querySelector('[data-photo-prev]')?.addEventListener('click',()=>showPhoto(photoIndex-1));
  viewer?.querySelector('[data-photo-next]')?.addEventListener('click',()=>showPhoto(photoIndex+1));
  viewer?.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showPhoto(photoIndex+(event.key==='ArrowRight'?1:-1));}
  });
  viewer?.addEventListener('close',()=>{photoTrigger?.focus({preventScroll:true});document.dispatchEvent(new Event('kesar:dialogchange'));});

  const drawer=document.querySelector('.visit-drawer');
  let visitTrigger;
  document.querySelectorAll('[data-visit-open]').forEach(button=>button.addEventListener('click',()=>{
    visitTrigger=button;
    drawer.showModal();
    drawer.scrollTop=0;
    drawer.querySelector('.drawer-close').focus({preventScroll:true});
    document.dispatchEvent(new Event('kesar:dialogchange'));
  }));
  drawer?.querySelector('.drawer-close')?.addEventListener('click',()=>drawer.close());
  drawer?.addEventListener('close',()=>{visitTrigger?.focus({preventScroll:true});document.dispatchEvent(new Event('kesar:dialogchange'));});
  [drawer,viewer].forEach(dialog=>dialog?.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const box=dialog.getBoundingClientRect();
    if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
  }));
  drawer?.querySelector('[data-copy-address]')?.addEventListener('click',async()=>{
    const status=drawer.querySelector('.copy-feedback');
    try {
      await navigator.clipboard.writeText('Kesar Da Dhaba, Chowk Passian, Gali Rajpura, near Telephone Exchange, Amritsar, Punjab');
      status.textContent='Address copied. See you in Amritsar.';
    } catch {status.textContent='Select and copy the address above, or open Get directions.';}
  });
})();
