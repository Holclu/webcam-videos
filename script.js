var videosperpage=35;
window.onload = function(){
  var sortby;
  if($e('#sort') && localStorage['sort']){$e('#sort').value=localStorage['sort'];sortby=$e('#sort').value;}else{sortby='default';};
  videos=SortArray(videos,sortby);
  loadFromURL();
}
window.onhashchange = function(){loadFromURL();}
function ChangePageStyle(){
  if ($e('html').className.includes('dark')){
    $e('html').classList.remove('dark');
  } else {
    $e('html').classList.add('dark');
  }
}
function ClearPage(){
  document.querySelectorAll('body>div').forEach((item) => {
    item.remove();
  });

}
function $q(selector, parent){
  if (parent){
    return parent.querySelectorAll(selector);
  } else {
    return document.querySelectorAll(selector);
  }
}
function $e(selector, parent){
  if (parent){
    return parent.querySelector(selector);
  } else {
    return document.querySelector(selector);
  }
}
function $c(element){
  return document.createElement(element);
}
function loadFromURL(){
  var url=window.location.href;
  if (url.includes('#random')){
    var vid=videos[Math.floor(Math.random()*Math.random()*videos.length)].id;
    loadVideo(vid);
  } else if (url.includes('#video=')){
    loadVideo(url.substring(url.indexOf('#video=')+7));
  } else if (url.includes('#categories')){
    loadCategories();
  } else if (url.includes('#models')){
    loadModels();
  } else {
    var page;
    var cat;
    var mod;
    var search;
    if (url.includes('#page=')){
      page=url.substring(url.indexOf('#page=')+6, (url+'#').indexOf('#', url.indexOf('#page=')+6));
    }
    if (url.includes('#category=')){
      cat=url.substring(url.indexOf('#category=')+10, (url+'#').indexOf('#', url.indexOf('#category=')+10));
    }
    if (url.includes('#model=')){
      mod=url.substring(url.indexOf('#model=')+7, (url+'#').indexOf('#', url.indexOf('#model=')+7));
    }
    if (url.includes('#search=')){
      search=url.substring(url.indexOf('#search=')+8, (url+'#').indexOf('#', url.indexOf('#search=')+8));
    }
    LoadPageVideos(page,cat,mod,search);
  }
}
function SortArray(array, sortby){
  array.sort(function(a, b) {
    if (sortby == 'name'){
      var valA = a.name; var valB = b.name;
    } else if (sortby == 'date'){
      var valB = a.date; var valA = b.date;
    } else if (sortby == 'length'){
      return Number(getTimeSeconds(b.length))-Number(getTimeSeconds(a.length)); //desc
    } else if (sortby == 'views'){
      return b.views-a.views; //desc
    } else if (sortby == 'id') {return a.id-b.id; //asc
    } else {return b.id-a.id;} //desc
    if (!valA && !valB){
      return 0
    } else if (!valA){
      return -1
    } else if (!valB){
      return 1
    } else if (valA < valB) {
      return -1;
    } else if (valA > valB){
      return 1;
    } else {
      return 0;
    }
  });
  return array;
}
function GetArrayPosition(vid){
  return videos.findIndex(({id})=>id==vid);
}
function getDisk(vid){
  return null;
}
function getImageSrc(vid, imageID, size){
  var fol1,
      fol2;
  if(size=='large'){
    fol1='videos_sources';
    fol2='screenshots';
  } else {
    fol1='videos_screenshots';
    fol2='180x135';
  }
  if(!imageID){imageID=1;}
  var data=videos.findLast(({id})=>id==vid),
      imgfol;
  if (data.link.includes('camwhores.')){
    imgfol=videos[GetArrayPosition(vid)].link.substring(videos[GetArrayPosition(vid)].link.indexOf('/',videos[GetArrayPosition(vid)].link.indexOf('get_file/')+'get_file/'.length+10)+1, videos[GetArrayPosition(vid)].link.lastIndexOf('/'));
    return 'https://cdn.camwhores.tv/contents/'+fol1+'/' + imgfol + '/'+fol2+'/' + imageID + '.jpg';
  }
  return null;
}
function videoPreview(element){
  var i=Number(element.src.substring(element.src.indexOf('.jpg'),element.src.lastIndexOf('/')+1))+1,
      elnk=element.parentElement.parentElement.href,
      vid=Number(elnk.substring(elnk.lastIndexOf('#video=')+7));
  if (i>videos[GetArrayPosition(vid)].images){i=1;};
  element.src=getImageSrc(vid, i);
}
function getCategories() {
  var loadedcategories = [];
  for (var i = 1; i < videos.length+1; i++) {
    for (var j = 0; j < videos[i-1].category.split(':').length; j++) {
      loadedcategories.push(videos[i-1].category.split(':')[j]);
    }
  }
  loadedcategories = [...new Set(loadedcategories)];
  loadedcategories=loadedcategories.sort(function(a, b) {
    var nameA = a.toUpperCase();
    var nameB = b.toUpperCase();
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB){
      return 1;
    } else {
      return 0;
    }
  });
  return loadedcategories;
}
function loadCategories(){
  document.title='Categories';
  ClearPage();
  var listItems=$c('div');
  listItems.className='listItems categories';
  var categories=getCategories().filter((cat)=>!['*download','sourced'].includes(cat));
  for (var i=0; i<categories.length; i++) {
    var category=$c('a');
    category.innerText=categories[i].replaceAll('_',' ');
    category.href='#category='+categories[i];
    category.onclick=function(){var cat = this.href.substring(this.href.indexOf('#category=')+10); LoadPageVideos(null,cat,$e('#filModels').value,$e('#filSearch').value);};
    category.className='item';
    listItems.appendChild(category);
  }
  $e('body').appendChild(listItems);
}
function getModels() {
  var loadedModels=[];
  for (var i=1; i < videos.length+1; i++) {
    for (var j=0; j < videos[i-1].model.split(':').length; j++) {
      loadedModels.push(videos[i-1].model.split(':')[j]);
    }
  }
  loadedModels=[...new Set(loadedModels)];
  loadedModels.sort(function(a, b) {
    var nameA=a.toUpperCase();
    var nameB=b.toUpperCase();
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB){
      return 1;
    } else {
      return 0;
    }
  });
  return loadedModels;
}
function loadModels() {
  document.title='Models';
  ClearPage();
  var models=getModels(),
      position=$c('div');
  position.className='listItems models';
  $e('body').appendChild(position);
  for (var i=0; i<models.length; i++) {
    var model=$c('a'),
        div=$c('div'),
        img=$c('img'),
        name=$c('b'),
        lastVideo=videos.findLast(({model})=>model===models[i]);
    model.href='#model=' + models[i];
    model.onclick=function(){var mod=this.href.substring(this.href.indexOf('#model=')+7); LoadPageVideos(null,$e('#filCategories').value,mod,$e('#filSearch').value);}
    model.className='item';
    if (lastVideo){
      img.src=getImageSrc(lastVideo.id, 1);
      img.onerror=function(){this.remove();};
      div.appendChild(img);
    }
    name.className='videoname'
    name.innerText=models[i];
    position.appendChild(model);
    model.appendChild(div);
    model.appendChild(name);
  }
}
function CreateFilter(){
  var filDiv=$c('div'),
      fmods=$c('select'),
      fcats=$c('select'),
      fsearch=$c('input'),
      sort=$c('select');
  filDiv.className='filter';
  fmods.id='filModels';
  fmods.onchange=function(){LoadPageVideos(null,$e('#filCategories').value,$e('#filModels').value,$e('#filSearch').value);};
  var filModels=getModels();
  fmods.append($c('option'));
  for (var i = 0; i < filModels.length; i++) {
    var fmod=$c('option');
    fmod.value=filModels[i];
    fmod.innerText=filModels[i].replaceAll('_', ' ');
    fmods.append(fmod);
  }
  filDiv.appendChild(fmods);
  fcats.id='filCategories';
  fcats.onchange=function(){LoadPageVideos(null,$e('#filCategories').value,$e('#filModels').value,$e('#filSearch').value);};
  var filCategories=getCategories().filter((cat)=>!['*download','sourced'].includes(cat));
  fcats.append($c('option'));
  for (var i = 0; i < filCategories.length; i++) {
    var fcat=$c('option');
    fcat.value=filCategories[i];
    fcat.innerText=filCategories[i].replaceAll('_', ' ');
    fcats.append(fcat);
  }
  filDiv.appendChild(fcats);
  fsearch.id='filSearch';
  filDiv.appendChild(fsearch);
  sort.id='sort';
  sort.innerHTML='<option value="default">default</option><option value="name">name</option><option value="length">length</option><option value="date">latest</option><option value="views">views</option>';
  sort.onchange = function(){
    localStorage['sort']=sort.value;
    videos=SortArray(videos, sort.value);
    LoadPageVideos(null,$e('#filCategories').value,$e('#filModels').value,$e('#filSearch').value);
  }
  filDiv.appendChild(sort);
  $e('body').appendChild(filDiv);
}
function LoadPageVideos(page,cat,mod,search){
  ClearPage();
  CreateFilter();
  var fvideos=SortArray(videos,$e('#sort').value);
  if(!page){page=1;}
  if(cat){fvideos=fvideos.filter(({category}) => category.split(':').includes(cat));};
  if(mod){fvideos=fvideos.filter(({ model }) => model.split(':').includes(mod));}
  if(search){fvideos=fvideos.filter(({model,name}) => model.toUpperCase().includes(search.toUpperCase()) || name.toUpperCase().includes(search.toUpperCase()) );}
  var pages = Math.ceil(fvideos.length/videosperpage);
  document.title='Videos';
  var position=$c('div');
  position.className='listItems videos';
  $e('body').appendChild(position);
  if(mod){
    document.title='Model ' + mod;
    var modelinfo=$c('div'),
        modelimg=$c('img'),
        modelnames=$c('p'),
        modelpos=models.indexOf(models.find(({ name }) => name === mod )),
        modelLastVideo=videos.findLast(({model}) => model === mod);
    modelinfo.id='modelinfo';
    modelinfo.innerHTML='<h1>' + mod + '</h1>';
    if (modelLastVideo){
      modelimg.src=getImageSrc(modelLastVideo.id, 1);
      modelimg.onerror=function(){this.remove();};
      modelinfo.appendChild(modelimg);
    }
    modelnames.innerText=models[modelpos].otherName;
    position.appendChild(modelinfo);
    modelinfo.appendChild(modelnames);
  }
  for (var i = videosperpage*(page-1); i < videosperpage*page; i++) {
    if(i<fvideos.length){
      CreateVideoCard(fvideos[i].id);
    }
  }
  if (pages>1){
    var pagesnav=$c('div');
    pagesnav.id = 'pagesnav';
    for (i=1; i<=pages; i++){
      if (i==1 || (i>=page-5 && i<=page+5) || i==pages){
        var pagenav=$c('a');
        pagenav.innerText = i;
        if (i==page){pagenav.className = 'active';}
        pagenav.onclick = function(){LoadPageVideos(Number(this.innerText),cat,mod,search);window.scrollTo({top: 0,left: 0,behavior: 'smooth'});}
        pagesnav.appendChild(pagenav);
      }
    }
    position.appendChild(pagesnav);
  }
  var fcats=$e('#filCategories'),
      fmods=$e('#filModels');
  if (cat){fcats.value=cat;};
  if (mod){fmods.value=mod;};
}
function CreateVideoCard(vid){
  var data=videos.findLast(({id})=>id==vid),
      position=$e('.listItems'),
      link=$c('a'),
      div=$c('div'),
      picture=$c('img'),
      name=$c('p'),
      info=$c('p'),
      interval;
  link.href='#video='+data.id;
  link.className='item';
  link.onclick=function(){var video=this.href.substring(this.href.indexOf('#video=')+7); loadVideo(video);};
  if (data.category.includes('*') || data.length==''){link.className+=' action';}
  picture.src=getImageSrc(data.id, 1);
  picture.loading='lazy';
  picture.onerror=function(){this.remove();};
  picture.onmouseover=function(){
    interval=setInterval(function() {videoPreview(picture)}, 1000);
  };
  picture.onmouseout=function() {
    clearInterval(interval);
    picture.src=getImageSrc(data.id, 1);
  };
  name.className='videoname'
  name.innerText=data.name;
  info.className='info';
  info.innerHTML='<span>' + data.length + '</span><span>' + data.views + '</span>';
  position.appendChild(link);
  link.appendChild(div);
  div.appendChild(picture);
  link.appendChild(name);
  link.appendChild(info);
}
function loadVideo(vid){
  ClearPage();
  var data=videos.findLast(({id})=>id==vid);
  document.title='Video '+data.name;
  var position=$c('div'),
      element=$c('video'),
      name=$c('h3'),
      videodiv=$c('div'),
      categoriesdiv=$c('div'),
      modelsdiv=$c('div'),
      imagesdiv=$c('div'),
      imagedetail=$c('div');
  position.className='video';
  name.innerText=data.name;
  position.appendChild(name);
  videodiv.id='player';
  element.src=data.link;
  element.preload='metadata';
  element.controls='controls';
  element.setAttribute('height','100%');
  element.onkeyup=function(event){if (event.code == 'KeyF'){element.requestFullscreen();}};
  if (data.views){
    localStorage['video'+vid]=data.views;
  } else {
    localStorage['video'+vid]=0;
  };
  element.onplay=function(){localStorage['video'+vid]++; element.onplay=function(){};}
  videodiv.className=categoriesdiv.className=modelsdiv.className=imagesdiv.className='videodiv';
  if (window.location.href.includes('#edit')) {
    categoriesdiv.appendChild(Shuttle('categories', getCategories(), data.category.split(':')));
    if (!data.model || data.model=='--unknown--'){
      data.model=getModelsNames(data.name);
    }
    modelsdiv.appendChild(Shuttle('categories', getModels(), data.model.split(':')));
  } else {
    var selectedCategories=data.category.split(':');
    selectedCategories.sort();
    for (i=0; i<selectedCategories.length; i++){
      var category=$c('a');
      category.innerText=selectedCategories[i].replaceAll('_',' ');
      category.href='#category=' + selectedCategories[i];
      category.onclick=function(){loadCategoryVideos(this.href.substring(this.href.indexOf('#category=')+10));};
      categoriesdiv.appendChild(category);
    }
    var models=data.model.split(':');
    models.sort();
    for (i=0; i<models.length; i++){
      var model=$c('a');
      model.innerText=models[i];
      model.href='#model=' + models[i];
      model.onclick=function(){loadModelVideos(this.href.substring(this.href.indexOf('#model=')+7));};
      modelsdiv.appendChild(model);
    }
  }
  imagesdiv.id='images';
  for (var i=1; i<=data.images; i++) {
    var image=$c('img');
    image.src=getImageSrc(data.id, i, 'large');
    imagesdiv.appendChild(image);
    image.onclick=function(){
      imagedetail.style.display='flex';
      imagedetail.firstElementChild.src=this.src;
      imagedetail.focus();
    }
  }
  imagedetail.id='imagedetail';
  imagedetail.innerHTML='<img height="90%">';
  window.onkeyup=function(event){
    if (event.code == 'Escape'){imagedetail.style.display='none';}
    if (data.images>1) {
      var img=document.querySelector('#imagedetail img');
      var imageid=Number(img.src.substring(img.src.indexOf('.jpg'),img.src.lastIndexOf('/')+1));
      if (event.code == 'ArrowRight'){
        imageid++;
        if (imageid==data.images+1){imageid=1;}
        img.src=getImageSrc(data.id, imageid, 'large');
      } else if (event.code == 'ArrowLeft') {
        imageid--;
        if (imageid==0){imageid=data.images;}
        img.src=getImageSrc(data.id, imageid, 'large');
      }
    }
  };
  position.appendChild(videodiv);
  videodiv.appendChild(element);
  position.appendChild(categoriesdiv);
  position.appendChild(modelsdiv);
  position.appendChild(imagesdiv);
  position.appendChild(imagedetail);
  $e('body').appendChild(position);
  window.scroll(0,120);
  element.focus();
}
